'use client';

import { useState } from 'react';
import { CreateOrderRequest } from '../lib/generated/orderApi'

export default function Home() {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('送信中...');

    const request: CreateOrderRequest = {
      item,
      quantity: Number(quantity) 
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
                throw new Error('注文に失敗しました');
      }

      const data = await res.json();
      setStatus(`✅ 注文成功！注文ID: ${data.order.orderId}`);
      setItem('');
      setQuantity(1);
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
              value={item}
              onChange={(e) => setItem(e.target.value)}
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
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
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