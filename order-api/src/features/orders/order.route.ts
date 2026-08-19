import { createRoute, z } from '@hono/zod-openapi';
import { orderInputSchema, orderResponseSchema } from './order.schema.js';

export const createOrderRoute = createRoute({
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
            orderCreated: orderResponseSchema,
          }),
        },
      },
    },
    400: { description: 'Invalid request' },
  },
});