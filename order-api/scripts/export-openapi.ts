import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { app } from '../src/app.js';

// OpenAPIの仕様書JSONを生成
const spec = app.getOpenAPIDocument({
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Order API',
  },
});

// プロジェクトのルートディレクトリに `openapi.json` として書き出す
const outputPath = path.resolve(process.cwd(), 'openapi.json');
writeFileSync(outputPath, JSON.stringify(spec, null, 2));

console.log('OpenAPI spec exported to:', outputPath);