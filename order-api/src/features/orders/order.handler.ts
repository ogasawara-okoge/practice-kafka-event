import { Kafka } from 'kafkajs';
import { config } from '../../config.js';
import { OrderCreatedEvent } from '../../generated/order.js';
import { orderResponseSchema } from './order.schema.js'

// Kafka Producerの初期化
const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: [config.kafka.broker],
});
const producer = kafka.producer();
let isConnected = false;

const ensureProducerConnected = async () => {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
    console.log('Kafka Producer connected successfully.');
  }
};

// ハンドラーの実装
export const handleCreateOrder = async (c: any) => {
  // Zodによるバリデーション済みの安全なデータを取得
  const { item, quantity } = c.req.valid('json');

  console.log('Received order request:', { item, quantity });
  const orderId = Date.now().toString();

  try {
    await ensureProducerConnected();

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
    console.error('Failed to process order event:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
};