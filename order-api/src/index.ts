import { serve } from '@hono/node-server';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { Kafka } from 'kafkajs';
import { config } from './config.js';
import { OrderCreatedEvent } from './generated/order.js';

const app = new OpenAPIHono();

app.use('/*', cors());

const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: [config.kafka.broker],
});

const producer = kafka.producer();

const orderInputSchema = z.object({
  item: z.string().min(1, "商品名は必須です").openapi({ example: 'コーヒー豆' }),
  quantity: z.number().int().positive("数量は1以上である必要があります").openapi({ example: 2 }),
}).openapi('OrderInput');

const createOrderRoute = createRoute({
  method: 'post',
  path: '/orders',
  request: {
    body: {
      content: {
        'application/json': {
          schema: orderInputSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Order created successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            order: z.any(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid request',
    },
  },
});

const startServer = async () => {
  await producer.connect();
  console.log('Kafka Producer connected successfully.');

  // 3. 定義したルートに対するハンドラーの実装（ここで自動バリデーションされる）
  app.openapi(createOrderRoute, async (c) => {
    // バリデーション済みの安全なデータを取得
    const { item, quantity } = c.req.valid('json');

    console.log('Received order request:', { item, quantity });
    const orderId = Date.now().toString();

    try {
      const payloadMessage = {
        orderId: orderId,
        item: item,
        quantity: quantity,
        createdAt: new Date().toISOString(),
      };

      const encodedPayload = OrderCreatedEvent.encode(payloadMessage).finish();

      await producer.send({
        topic: config.kafka.topic,
        messages: [
          {
            value: Buffer.from(encodedPayload),
          },
        ],
      });

      console.log('Order event published to Kafka successfully.');

      return c.json({ 
        message: 'Order received and event published!', 
        order: payloadMessage 
      }, 201);

    } catch (error) {
      console.error('Failed to publish order event:', error);
      return c.json({ error: 'Internal Server Error' }, 500);
    }
  });

  // 4. 自動生成されたOpenAPI（Swagger）のJSONエンドポイントを生やす
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Order API',
    },
  });

  const port = Number(config.port) || 3000;
  console.log(`Order API is running on http://localhost:${port}`);
  console.log(`Swagger JSON is available at http://localhost:${port}/doc`);

  serve({
    fetch: app.fetch,
    port,
  });
};

startServer().catch(console.error);