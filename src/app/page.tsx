import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('items')
    .select('id, name, current_stock, min_stock')
    .not('min_stock', 'is', null)
    .order('name')

  const lowStock = items?.filter(i => i.current_stock <= (i.min_stock ?? 0)) ?? []

  const { data: recentTx } = await supabase
    .from('stock_transactions')
    .select('id, type, quantity, note, transaction_date, items(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      {/* メインボタン */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/stock-in"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl p-6 flex flex-col items-center gap-3 shadow-md active:scale-95 transition-transform">
          <span className="text-5xl">📥</span>
          <span className="text-xl font-bold">入　庫</span>
          <span className="text-sm opacity-80">商品が届いたとき</span>
        </Link>
        <Link href="/stock-out"
          className="bg-green-500 hover:bg-green-600 text-white rounded-2xl p-6 flex flex-col items-center gap-3 shadow-md active:scale-95 transition-transform">
          <span className="text-5xl">📤</span>
          <span className="text-xl font-bold">使　用</span>
          <span className="text-sm opacity-80">在庫を使うとき</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/inventory"
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl p-5 flex flex-col items-center gap-2 shadow-md active:scale-95 transition-transform">
          <span className="text-4xl">📝</span>
          <span className="text-lg font-bold">棚卸し</span>
        </Link>
        <Link href="/reports"
          className="bg-purple-500 hover:bg-purple-600 text-white rounded-2xl p-5 flex flex-col items-center gap-2 shadow-md active:scale-95 transition-transform">
          <span className="text-4xl">📊</span>
          <span className="text-lg font-bold">レポート</span>
        </Link>
      </div>

      {/* 在庫不足アラート */}
      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h2 className="text-red-700 font-bold mb-2">⚠️ 在庫不足 ({lowStock.length}品目)</h2>
          <ul className="space-y-1">
            {lowStock.map(item => (
              <li key={item.id} className="text-sm text-red-600 flex justify-between">
                <span>{item.name}</span>
                <span className="font-bold">残{item.current_stock}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 最近の履歴 */}
      {recentTx && recentTx.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-bold text-gray-700 mb-3">最近の操作</h2>
          <ul className="space-y-2">
            {recentTx.map((tx: any) => (
              <li key={tx.id} className="flex items-center gap-3 text-sm">
                <span>{tx.type === 'in' ? '📥' : tx.type === 'out' ? '📤' : '📝'}</span>
                <span className="flex-1 text-gray-800">{tx.items?.name}</span>
                <span className={`font-bold ${tx.type === 'in' ? 'text-blue-600' : 'text-green-600'}`}>
                  {tx.type === 'in' ? '+' : '-'}{tx.quantity}
                </span>
                <span className="text-gray-400">{new Date(tx.transaction_date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
