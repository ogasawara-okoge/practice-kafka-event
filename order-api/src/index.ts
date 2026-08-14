import express, { Request, Response } from 'express';
import cors from 'cors';
import { Kafka } from 'kafkajs';
import { config } from './config.js';

const app = express();
app.use(express.json());
app.use(cors());

// ★ config からポート番号を取得
const PORT = config.port;

// 1. Kafkaクライアントの初期化（configの値を使用）
const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: [config.kafka.broker],
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  console.log('Kafka Producer connected successfully.');

  app.post('/orders', async (req: Request, res: Response) => {
    const orderData = req.body;// 注文IDをここで確定させる
    console.log('Received order request:', orderData);
    const orderId = Date.now().toString();
    const requestOrderData = {
      orderId: orderId,
      item: orderData.item || 'Default Item',
      quantity: orderData.quantity || 1,
      createdAt: new Date().toISOString(),
    };
    try {
      // 4. Kafkaへの送信（configのトピック名を使用）
      await producer.send({
        topic: config.kafka.topic,
        messages: [
          {
            value: JSON.stringify(requestOrderData),
          },
        ],
      });

      console.log('Order event published to Kafka successfully.');
      res.status(201).json({ message: 'Order received and event published!', order: requestOrderData });
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