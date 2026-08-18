import { defineConfig } from 'orval';

export default defineConfig({
  orderApi: {
    input: '../infrastructure/order-api-swagger.yaml',
    output: {
      target: './lib/generated/orderApi.ts',
      client: 'axios',
    },
  },
});