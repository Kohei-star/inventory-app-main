'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Item } from '@/types'

interface Props {
  item: Item
  onDone: (updatedItem: Item) => void
}

export default function QuickAction({ item, onDone }: Props) {
  const [mode, setMode] = useState<'in' | 'out' | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit() {
    if (!mode) return
    setLoading(true)
    const newStock = mode === 'in'
      ? item.current_stock + quantity
      : Math.max(0, item.current_stock - quantity)

    await supabase.from('stock_transactions').insert({
      item_id: item.id,
      type: mode,
      quantity,
      transaction_date: new Date().toISOString(),
    })
    await supabase.from('items').update({ current_stock: newStock }).eq('id', item.id)

    onDone({ ...item, current_stock: newStock })
    setMode(null)
    setQuantity(1)
    setLoading(false)
  }

  return (
    <div>
      {/* 入庫・使用ボタン */}
      {!mode && (
        <div className="flex gap-2">
          <button onClick={() => setMode('out')}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ background: '#eef4ee', color: '#3d6b47' }}>
            使用 −
          </button>
          <button onClick={() => setMode('in')}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ background: '#eef0f7', color: '#2d5a8e' }}>
            入庫 ＋
          </button>
        </div>
      )}

      {/* 数量入力（インライン） */}
      {mode && (
        <div className="rounded-xl p-3 mt-1" style={{ background: mode === 'in' ? '#eef0f7' : '#eef4ee' }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-medium" style={{ color: mode === 'in' ? '#2d5a8e' : '#3d6b47' }}>
              {mode === 'in' ? '入庫数量' : '使用数量'}
            </span>
            <button onClick={() => { setMode(null); setQuantity(1) }}
              className="ml-auto text-xs px-2 py-0.5 rounded"
              style={{ color: '#6b6b6b', background: '#e8e6e3' }}>
              取消
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-full text-xl font-bold flex items-center justify-center"
              style={{ background: '#fff', color: '#2a2a2a' }}>−</button>
            <input
              type="number" min={1} value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center text-xl font-bold rounded-lg py-1.5 border-0 outline-none"
              style={{ background: '#fff' }}
            />
            <button onClick={() => setQuantity(q => q + 1)}
              className="w-10 h-10 rounded-full text-xl font-bold flex items-center justify-center"
              style={{ background: '#fff', color: '#2a2a2a' }}>＋</button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-opacity disabled:opacity-50"
              style={{ background: mode === 'in' ? '#2d5a8e' : '#3d6b47', color: '#fff' }}>
              {loading ? '...' : '登録'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
