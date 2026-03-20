# 在庫管理システム

## セットアップ

### 1. Supabase設定
1. [supabase.com](https://supabase.com) で新しいプロジェクトを作成
2. SQL Editorで `supabase/migrations/001_init.sql` を実行
3. SQL Editorで `supabase/migrations/002_seed_items.sql` を実行

### 2. 環境変数
`.env.local` を作成して以下を設定:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 開発サーバー起動
```bash
npm install
npm run dev
```

## 機能
- 📥 入庫登録
- 📤 使用登録
- 📋 在庫一覧
- 📝 棚卸し
- 📊 レポート（使用量・回転率）
