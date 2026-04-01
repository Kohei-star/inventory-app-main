'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function MonthlyExport() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleExport() {
    setLoading(true)
    const start = new Date(year, month - 1, 1).toISOString()
    const end = new Date(year, month, 1).toISOString()

    const { data } = await supabase
      .from('stock_transactions')
      .select('transaction_date, type, quantity, resident_name, staff_name, items(name, purchase_price)')
      .gte('transaction_date', start)
      .lt('transaction_date', end)
      .order('transaction_date')

    if (!data || data.length === 0) {
      alert('該当期間のデータがありません')
      setLoading(false)
      return
    }

    const rows = [
      ['日付', '品目名', '種別', '数量', '利用者', '担当職員', '単価（円）', '金額（円）'],
      ...data.map(tx => {
        const item = tx.items as any
        const price = item?.purchase_price ?? 0
        const date = new Date(tx.transaction_date).toLocaleDateString('ja-JP')
        const type = tx.type === 'in' ? '入庫' : '使用'
        const amount = tx.type === 'out' ? tx.quantity * price : ''
        return [
          date,
          item?.name ?? '',
          type,
          tx.quantity,
          tx.resident_name ?? '',
          tx.staff_name ?? '',
          price,
          amount,
        ]
      }),
    ]

    const csv = '\uFEFF' + rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `在庫レポート_${year}年${month}月.csv`
    a.click()
    URL.revokeObjectURL(url)
    setLoading(false)
  }

  const years = [now.getFullYear() - 1, now.getFullYear()]

  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: '#fff', border: '1px solid #e8e6e3' }}>
      <h3 className="text-sm font-semibold" style={{ color: '#1e3a5f' }}>月次レポート CSV出力</h3>
      <div className="flex gap-2 items-center">
        <select
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          className="rounded-lg px-3 py-2 text-sm border-0 outline-none"
          style={{ background: '#f9f8f6', color: '#2a2a2a' }}>
          {years.map(y => <option key={y} value={y}>{y}年</option>)}
        </select>
        <select
          value={month}
          onChange={e => setMonth(Number(e.target.value))}
          className="rounded-lg px-3 py-2 text-sm border-0 outline-none"
          style={{ background: '#f9f8f6', color: '#2a2a2a' }}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>{m}月</option>
          ))}
        </select>
        <button
          onClick={handleExport}
          disabled={loading}
          className="flex-1 py-2 rounded-lg text-sm font-bold transition-opacity disabled:opacity-50"
          style={{ background: '#1e3a5f', color: '#fff' }}>
          {loading ? '準備中...' : '⬇ CSVダウンロード'}
        </button>
      </div>
      <p className="text-xs" style={{ color: '#9b9b9b' }}>
        日付・品目・種別・数量・利用者・職員・単価・金額を含みます
      </p>
    </div>
  )
}
