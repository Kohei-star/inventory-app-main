'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Item } from '@/types'

interface Props {
  items: Item[]
  type: 'in' | 'out'
}

export default function StockForm({ items, type }: Props) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [staffName, setStaffName] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  const supabase = createClient()

  async function handleSubmit() {
    if (!selectedItem) return
    setLoading(true)
    try {
      const newStock = type === 'in'
        ? selectedItem.current_stock + quantity
        : selectedItem.current_stock - quantity

      await supabase.from('stock_transactions').insert({
        item_id: selectedItem.id,
        type,
        quantity,
        staff_name: staffName || null,
        note: note || null,
        transaction_date: new Date().toISOString(),
      })

      await supabase.from('items')
        .update({ current_stock: Math.max(0, newStock) })
        .eq('id', selectedItem.id)

      setDone(true)
      setTimeout(() => {
        setDone(false)
        setSelectedItem(null)
        setQuantity(1)
        setNote('')
        setSearch('')
      }, 1500)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">✅</div>
        <p className="text-xl font-bold text-green-600">登録しました！</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 品目選択 */}
      {!selectedItem ? (
        <div>
          <input
            type="text"
            placeholder="品目を検索..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
            {filtered.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="text-left bg-white border border-gray-200 rounded-xl px-4 py-3 hover:bg-blue-50 hover:border-blue-300 active:scale-95 transition-all shadow-sm"
              >
                <div className="font-medium text-gray-800">{item.name}</div>
                <div className="text-sm text-gray-500 mt-0.5">
                  現在庫: <span className="font-bold text-gray-700">{item.current_stock}</span>
                  {item.storage_location && <span className="ml-3">📍{item.storage_location}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 選択中の品目 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex justify-between items-center">
            <div>
              <div className="font-bold text-blue-800">{selectedItem.name}</div>
              <div className="text-sm text-blue-600">現在庫: {selectedItem.current_stock}</div>
            </div>
            <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
          </div>

          {/* 数量 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">数量</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-12 h-12 bg-gray-200 rounded-full text-2xl font-bold hover:bg-gray-300 active:scale-95 transition"
              >−</button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 text-center text-2xl font-bold border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-12 h-12 bg-gray-200 rounded-full text-2xl font-bold hover:bg-gray-300 active:scale-95 transition"
              >＋</button>
            </div>
          </div>

          {/* スタッフ名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">担当者（任意）</label>
            <input
              type="text"
              value={staffName}
              onChange={e => setStaffName(e.target.value)}
              placeholder="例：山下"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* メモ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">メモ（任意）</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="例：田中様用"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* 登録ボタン */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 rounded-xl text-white text-lg font-bold shadow-md active:scale-95 transition-all ${
              type === 'in' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
            } disabled:opacity-50`}
          >
            {loading ? '登録中...' : type === 'in' ? '📥 入庫を登録' : '📤 使用を登録'}
          </button>
        </div>
      )}
    </div>
  )
}
