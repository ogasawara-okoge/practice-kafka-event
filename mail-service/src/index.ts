import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import { OrderCreatedEvent } from './generated/order.js';

dotenv.config();

const broker = process.env.KAFKA_BROKER;
const clientId = process.env.KAFKA_CLIENT_ID;
const topic = process.env.KAFKA_TOPIC;
const groupId = process.env.KAFKA_GROUP_ID;

if (!broker || !clientId || !topic || !groupId) {
  throw new Error('Required environment variables are missing.');
}

const kafka = new Kafka({
  clientId,
  brokers: [broker],
});

const consumer = kafka.consumer({ groupId });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  console.log('Mail Service is listening for order events...');

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const order = OrderCreatedEvent.decode(message.value);
      console.log(`[Mail Service] 💌 注文メールを送信中...`);
      console.log(`宛先: 顧客, 内容: 商品「${order.item}」を ${order.quantity} 個受注しました。`);
      console.log(`[Mail Service] ✅ 送信完了! Order ID: ${order.orderId}`);
    },
  });
};

run().catch(console.error);