import { createClient } from '@/lib/supabase/server'
import StockForm from '@/components/StockForm'

export default async function StockInPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .order('no')

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">📥 入庫登録</h2>
      <StockForm items={items ?? []} type="in" />
    </div>
  )
}
