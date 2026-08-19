import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { createOrderRoute } from './features/orders/order.route.js';
import { handleCreateOrder } from './features/orders/order.handler.js';

export const app = new OpenAPIHono();

app.use('/*', cors());

app.openapi(createOrderRoute, handleCreateOrder);
