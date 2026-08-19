import { z } from '@hono/zod-openapi';

// 注文リクエストのZodスキーマ定義
export const orderInputSchema = z.object({
  item: z.string().min(1, "商品名は必須です").openapi({ example: 'コーヒー豆' }),
  quantity: z.number().int().positive("数量は1以上である必要があります").openapi({ example: 2 }),
}).openapi('OrderInput');

export const orderResponseSchema = z.object({
  message: z.string(),
  order: z.object({
    orderId: z.string(),
    item: z.string(),
    quantity: z.number(),
  }),
}).openapi('OrderResponse');