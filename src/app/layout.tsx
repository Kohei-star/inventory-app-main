import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Connect Place 在庫管理',
  description: '消耗品・備品の在庫管理',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen" style={{ background: '#f5f4f2', color: '#2a2a2a', fontFamily: "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif" }}>
        <header style={{ background: '#1e3a5f', color: '#fff' }} className="px-5 py-4 shadow-md">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded" style={{ background: '#2d5a8e' }} />
              <span className="font-semibold text-base tracking-wide">Connect Place 在庫管理</span>
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-5 pb-24">
          {children}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 border-t" style={{ background: '#fff', borderColor: '#e8e6e3' }}>
          <div className="max-w-lg mx-auto flex">
            {[
              { href: '/', icon: '▦', label: '一覧' },
              { href: '/inventory', icon: '✓', label: '棚卸し' },
              { href: '/reports', icon: '≡', label: 'レポート' },
            ].map(({ href, icon, label }) => (
              <a key={href} href={href}
                className="flex-1 flex flex-col items-center py-3 gap-0.5 text-xs transition-colors"
                style={{ color: '#6b6b6b' }}>
                <span className="text-lg leading-tight">{icon}</span>
                <span>{label}</span>
              </a>
            ))}
          </div>
        </nav>
      </body>
    </html>
  )
}
