-- 品目マスター
create table items (
  id uuid primary key default gen_random_uuid(),
  no integer not null,
  name text not null,
  category text not null default 'consumable', -- consumable/equipment/sellable
  purchase_unit text,
  purchase_price integer,
  vendor text,
  storage_location text,
  current_stock integer not null default 0,
  min_stock integer,
  sell_unit text,
  sell_price integer,
  h_code text,
  created_at timestamptz default now()
);

-- 在庫トランザクション（入庫・使用・棚卸し調整）
create table stock_transactions (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references items(id) on delete cascade,
  type text not null check (type in ('in', 'out', 'inventory')),
  quantity integer not null,
  staff_name text,
  note text,
  transaction_date timestamptz not null default now(),
  created_at timestamptz default now()
);

-- 棚卸し記録
create table inventory_records (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references items(id) on delete cascade,
  counted_stock integer not null,
  system_stock integer not null,
  diff integer not null,
  note text,
  counted_at timestamptz not null,
  created_at timestamptz default now()
);

-- インデックス
create index on stock_transactions(item_id);
create index on stock_transactions(transaction_date);
create index on inventory_records(item_id);

-- RLS（認証なしで全員アクセス可能）
alter table items enable row level security;
alter table stock_transactions enable row level security;
alter table inventory_records enable row level security;

create policy "Allow all" on items for all using (true) with check (true);
create policy "Allow all" on stock_transactions for all using (true) with check (true);
create policy "Allow all" on inventory_records for all using (true) with check (true);
