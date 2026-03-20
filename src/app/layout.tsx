import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '在庫管理システム',
  description: '消耗品・備品の在庫管理',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-blue-600 text-white px-4 py-3 shadow">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <span className="text-xl">📦</span>
            <h1 className="text-lg font-bold">在庫管理システム</h1>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
          {[
            { href: '/', icon: '🏠', label: 'ホーム' },
            { href: '/stock-in', icon: '📥', label: '入庫' },
            { href: '/stock-out', icon: '📤', label: '使用' },
            { href: '/items', icon: '📋', label: '在庫一覧' },
            { href: '/reports', icon: '📊', label: 'レポート' },
          ].map(({ href, icon, label }) => (
            <a key={href} href={href} className="flex-1 flex flex-col items-center py-2 text-gray-500 hover:text-blue-600 text-xs gap-1">
              <span className="text-xl">{icon}</span>
              {label}
            </a>
          ))}
        </nav>
        <div className="h-16" />
      </body>
    </html>
  )
}
