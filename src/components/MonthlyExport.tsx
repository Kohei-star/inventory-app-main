'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function toDateStr(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function MonthlyExport() {
  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const [startDate, setStartDate] = useState(toDateStr(firstOfMonth))
  const [endDate, setEndDate] = useState(toDateStr(now))
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleExport() {
    if (!startDate || !endDate || startDate > endDate) {
      alert('期間を正しく設定してください')
      return
    }
    setLoading(true)
    const start = new Date(startDate).toISOString()
    const end = new Date(new Date(endDate).getTime() + 86400000).toISOString() // 終了日を含む

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
        return [date, item?.name ?? '', type, tx.quantity, tx.resident_name ?? '', tx.staff_name ?? '', price, amount]
      }),
    ]

    const csv = '\uFEFF' + rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `在庫レポート_${startDate}_${endDate}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setLoading(false)
  }

  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: '#fff', border: '1px solid #e8e6e3' }}>
      <h3 className="text-sm font-semibold" style={{ color: '#1e3a5f' }}>レポート CSV出力</h3>
      <div className="flex gap-2 items-center flex-wrap">
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm border-0 outline-none"
          style={{ background: '#f9f8f6', color: '#2a2a2a' }}
        />
        <span className="text-sm" style={{ color: '#6b6b6b' }}>〜</span>
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm border-0 outline-none"
          style={{ background: '#f9f8f6', color: '#2a2a2a' }}
        />
        <button
          onClick={handleExport}
          disabled={loading}
          className="flex-1 py-2 rounded-lg text-sm font-bold transition-opacity disabled:opacity-50"
          style={{ background: '#1e3a5f', color: '#fff', minWidth: '140px' }}>
          {loading ? '準備中...' : '⬇ CSVダウンロード'}
        </button>
      </div>
      <p className="text-xs" style={{ color: '#9b9b9b' }}>
        日付・品目・種別・数量・利用者・職員・単価・金額を含みます
      </p>
    </div>
  )
}
