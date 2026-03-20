import { createClient } from '@/lib/supabase/server'

export default async function ItemsPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .order('no')

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">📋 在庫一覧</h2>
      <div className="space-y-2">
        {items?.map(item => {
          const isLow = item.min_stock != null && item.current_stock <= item.min_stock
          return (
            <div key={item.id} className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${isLow ? 'border-red-400' : 'border-transparent'}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-1 space-x-3">
                    {item.vendor && <span>🏪 {item.vendor}</span>}
                    {item.storage_location && <span>📍 {item.storage_location}</span>}
                    {item.purchase_price && <span>¥{item.purchase_price.toLocaleString()}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${isLow ? 'text-red-500' : 'text-gray-800'}`}>
                    {item.current_stock}
                  </div>
                  {item.purchase_unit && (
                    <div className="text-xs text-gray-400">{item.purchase_unit}</div>
                  )}
                  {isLow && <div className="text-xs text-red-500 font-medium">⚠️ 在庫不足</div>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
