import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import { OrderCreatedEvent } from './generated/order.js';

dotenv.config();

// 環境変数の取得
const broker = process.env.KAFKA_BROKER;
const clientId = process.env.KAFKA_CLIENT_ID;
const topic = process.env.KAFKA_TOPIC;
const groupId = process.env.KAFKA_GROUP_ID;

// 設定漏れがないかチェック
if (!broker || !clientId || !topic || !groupId) {
  throw new Error('Missing required environment variables in order-processor.');
}

const kafka = new Kafka({
  clientId,
  brokers: [broker],
});

const consumer = kafka.consumer({ groupId });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  console.log(`Order Processor started with group: ${groupId}`);

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const order = OrderCreatedEvent.decode(message.value);
      console.log(`[Order Processor] 📦 注文データをデータベースに保存中...`);
      // ここに保存処理
      console.log(`[Order Processor] ✅ 保存完了: Order ID: ${order.orderId}, Order Item: ${order.item}`);
    },
  });
};

run().catch(console.error);