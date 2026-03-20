import { createClient } from '@/lib/supabase/server'

export default async function ReportsPage() {
  const supabase = await createClient()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: txData } = await supabase
    .from('stock_transactions')
    .select('item_id, type, quantity, items(name, purchase_price)')
    .gte('transaction_date', thirtyDaysAgo.toISOString())

  const { data: items } = await supabase
    .from('items')
    .select('id, current_stock, purchase_price')

  const summary: Record<string, { name: string; in: number; out: number; price: number }> = {}
  for (const tx of txData ?? []) {
    const item = tx.items as any
    if (!summary[tx.item_id]) {
      summary[tx.item_id] = { name: item?.name ?? '', in: 0, out: 0, price: item?.purchase_price ?? 0 }
    }
    if (tx.type === 'in') summary[tx.item_id].in += tx.quantity
    if (tx.type === 'out') summary[tx.item_id].out += tx.quantity
  }

  const sorted = Object.values(summary).sort((a, b) => b.out - a.out)
  const totalValue = items?.reduce((s, i) => s + (i.current_stock * (i.purchase_price ?? 0)), 0) ?? 0
  const totalOut = (txData ?? []).filter(t => t.type === 'out').length

  const cardStyle = {
    background: '#fff',
    border: '1px solid #e8e6e3',
    borderRadius: '14px',
    padding: '16px',
  }

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold" style={{ color: '#1e3a5f' }}>レポート</h2>

      <div className="grid grid-cols-2 gap-3">
        <div style={cardStyle}>
          <div className="text-xs mb-1" style={{ color: '#6b6b6b' }}>在庫総額</div>
          <div className="text-xl font-bold" style={{ color: '#1e3a5f' }}>¥{totalValue.toLocaleString()}</div>
        </div>
        <div style={cardStyle}>
          <div className="text-xs mb-1" style={{ color: '#6b6b6b' }}>過去30日 使用回数</div>
          <div className="text-xl font-bold" style={{ color: '#1e3a5f' }}>{totalOut}回</div>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#1e3a5f' }}>使用量の多い品目（過去30日）</h3>
        {sorted.length === 0 ? (
          <p className="text-sm" style={{ color: '#6b6b6b' }}>まだデータがありません</p>
        ) : (
          <div className="space-y-3">
            {sorted.slice(0, 10).map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs w-4" style={{ color: '#6b6b6b' }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate" style={{ color: '#2a2a2a' }}>{item.name}</div>
                  <div className="flex gap-3 text-xs mt-0.5" style={{ color: '#6b6b6b' }}>
                    <span>使用 <b style={{ color: '#3d6b47' }}>{item.out}</b></span>
                    <span>入庫 <b style={{ color: '#2d5a8e' }}>{item.in}</b></span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold" style={{ color: '#2a2a2a' }}>
                    ¥{(item.out * item.price).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
