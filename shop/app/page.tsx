'use client';

import { useState } from 'react';
import createClient from 'openapi-fetch';
import type { paths, components } from '../lib/client/schema';

const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

type OrderInput = components["schemas"]["OrderInput"];

export default function Home() {
  const [status, setStatus] = useState('');
  const [formData, setFormData] = useState<OrderInput>({
    item: '',
    quantity: 1
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('送信中...');
    try {
      const { data, error } = await client.POST('/orders', {
        body: formData,
      });

      if (error || !data) {
        console.error(error);
        throw new Error('注文に失敗しました');
      }

      setStatus(`✅ 注文成功！注文ID: ${data.order.orderId}`);
      setFormData({
        item: '',
        quantity: 1
      });
    } catch (err) {
      console.error(err);
      setStatus('❌ エラーが発生しました');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-black">
        <h1 className="text-2xl font-bold mb-6 text-center">🛒 ショップ注文画面</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">商品名</label>
            <input
              type="text"
              value={formData.item}
              onChange={(e) => setFormData({ ...formData, item: e.target.value })}
              required
              className="w-full border rounded p-2"
              placeholder="例: コーヒー豆"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">数量</label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            注文する
          </button>
        </form>
        {status && <p className="mt-4 text-center font-medium">{status}</p>}
      </div>
    </main>
  );
}