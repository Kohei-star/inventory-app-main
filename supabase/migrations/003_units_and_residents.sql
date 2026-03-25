-- items_per_box: 1箱あたりの個数（個で管理する品目に設定）
alter table items add column if not exists items_per_box integer;

-- resident_name: 使用時の利用者名
alter table stock_transactions add column if not exists resident_name text;

-- カテゴリを3分類に統一: facility（施設備品）, sellable（販売品）, aroma（アロマ）
-- 既存データのマッピング
update items set category = 'facility' where category in ('consumable', 'equipment');
