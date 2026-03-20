import Link from 'next/link'

export default function StockInPage() {
  return (
    <div className="text-center py-16 space-y-4">
      <div className="text-sm" style={{ color: '#6b6b6b' }}>
        入庫の登録は一覧画面から直接行えます
      </div>
      <Link href="/"
        className="inline-block px-6 py-3 rounded-xl text-sm font-medium"
        style={{ background: '#1e3a5f', color: '#fff' }}>
        一覧へ戻る
      </Link>
    </div>
  )
}
