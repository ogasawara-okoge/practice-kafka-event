import dotenv from 'dotenv';

// .env ファイルの内容を読み込む
dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID || 'mail-service',
    broker: process.env.KAFKA_BROKER || 'localhost:9092',
    topic: process.env.KAFKA_TOPIC || 'mail-events',
  },
};