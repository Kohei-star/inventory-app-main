'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Item } from '@/types'

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('items').select('*').order('no').then(({ data }) => {
      if (data) {
        setItems(data)
        const initial: Record<string, number> = {}
        data.forEach(i => { initial[i.id] = i.current_stock })
        setCounts(initial)
      }
      setLoading(false)
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    const now = new Date().toISOString()
    const records = items.map(item => ({
      item_id: item.id,
      counted_stock: counts[item.id] ?? item.current_stock,
      system_stock: item.current_stock,
      diff: (counts[item.id] ?? item.current_stock) - item.current_stock,
      counted_at: now,
    }))

    await supabase.from('inventory_records').insert(records)

    for (const item of items) {
      const counted = counts[item.id] ?? item.current_stock
      if (counted !== item.current_stock) {
        await supabase.from('items').update({ current_stock: counted }).eq('id', item.id)
        await supabase.from('stock_transactions').insert({
          item_id: item.id,
          type: 'inventory',
          quantity: Math.abs(counted - item.current_stock),
          note: `棚卸し調整 (${item.current_stock}→${counted})`,
          transaction_date: now,
        })
      }
    }

    setSaving(false)
    setDone(true)
  }

  if (loading) return <div className="text-center py-10 text-gray-500">読み込み中...</div>

  if (done) return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">✅</div>
      <p className="text-xl font-bold text-green-600">棚卸しを保存しました！</p>
      <a href="/" className="mt-4 inline-block text-blue-600 underline">ホームに戻る</a>
    </div>
  )

  const hasDiff = items.some(i => (counts[i.id] ?? i.current_stock) !== i.current_stock)

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">📝 棚卸し</h2>
      <p className="text-sm text-gray-500 mb-4">実際の在庫数を入力してください。差異がある場合は自動で調整されます。</p>

      <div className="space-y-2 mb-6">
        {items.map(item => {
          const counted = counts[item.id] ?? item.current_stock
          const diff = counted - item.current_stock
          return (
            <div key={item.id} className={`bg-white rounded-xl shadow-sm p-4 ${diff !== 0 ? 'border border-orange-300' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm">{item.name}</div>
                  <div className="text-xs text-gray-400">システム在庫: {item.current_stock}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCounts(c => ({ ...c, [item.id]: Math.max(0, (c[item.id] ?? item.current_stock) - 1) }))}
                    className="w-9 h-9 bg-gray-200 rounded-full font-bold hover:bg-gray-300 active:scale-95">−</button>
                  <input
                    type="number"
                    min={0}
                    value={counted}
                    onChange={e => setCounts(c => ({ ...c, [item.id]: Math.max(0, parseInt(e.target.value) || 0) }))}
                    className="w-16 text-center text-lg font-bold border border-gray-300 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button onClick={() => setCounts(c => ({ ...c, [item.id]: (c[item.id] ?? item.current_stock) + 1 }))}
                    className="w-9 h-9 bg-gray-200 rounded-full font-bold hover:bg-gray-300 active:scale-95">＋</button>
                </div>
                {diff !== 0 && (
                  <span className={`text-sm font-bold w-12 text-right ${diff > 0 ? 'text-blue-500' : 'text-red-500'}`}>
                    {diff > 0 ? '+' : ''}{diff}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {hasDiff && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 text-sm text-orange-700">
          ⚠️ 差異がある品目があります。保存すると在庫数が実数に更新されます。
        </div>
      )}

      <button onClick={handleSave} disabled={saving}
        className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg font-bold shadow-md active:scale-95 transition disabled:opacity-50">
        {saving ? '保存中...' : '📝 棚卸しを保存'}
      </button>
    </div>
  )
}
