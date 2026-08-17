import express, { Request, Response } from 'express';
import cors from 'cors';
import { Kafka } from 'kafkajs';
import { config } from './config.js';
import { OrderCreatedEvent } from './generated/order.js';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = config.port;

const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: [config.kafka.broker],
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  console.log('Kafka Producer connected successfully.');

  app.post('/orders', async (req: Request, res: Response) => {
    const orderData = req.body;
    console.log('Received order request:', orderData);
    const orderId = Date.now().toString();

    try {
      const payloadMessage = {
        orderId: orderId,
        item: orderData.item || 'Default Item',
        quantity: orderData.quantity || 1,
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

      res.status(201).json({ 
        message: 'Order received and event published!', 
        order: payloadMessage 
      });
    } catch (error) {
      console.error('Failed to publish order event:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.listen(PORT, () => {
    console.log(`Order API is running on http://localhost:${PORT}`);
  });
};

run().catch(console.error);