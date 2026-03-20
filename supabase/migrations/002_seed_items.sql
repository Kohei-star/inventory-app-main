-- 消耗品データ（備品リスト.xlsxより）
insert into items (no, name, category, purchase_unit, purchase_price, vendor, storage_location, current_stock) values
(1,  'プラスチックグローブ（M)100枚',                       'consumable', '20箱',   null, '日野出（株）', '会社1F倉庫', 0),
(2,  'プラスチックグローブ（L)100枚',                       'consumable', '20箱',   null, '日野出（株）', '会社1F倉庫', 0),
(3,  'ワンタッチコアレス 170m6ロール・シングル',              'consumable', '8パック', null, '日野出（株）', '会社1F倉庫', 0),
(4,  'SBペーパータオル小判200枚',                           'consumable', '50パック',null, '日野出（株）', '会社1F倉庫', 0),
(5,  '新BESTサージカルマスク50枚',                          'consumable', '40箱',   null, '日野出（株）', '会社1F倉庫', 0),
(6,  'タケックスクリーンBiz 18L',                           'consumable', '1箱',    null, '日野出（株）', '会社1F倉庫', 0),
(7,  'BPポケットノギス',                                    'consumable', '１個',   300,  '古野',        '会社1F倉庫', 7),
(8,  'マウスモイスト20g/本',                                'sellable',   '１個',   510,  '古野',        '会社1F倉庫', 3),
(9,  'リフレ おしりうるおい洗浄液 350ml',                    'consumable', '1個',    1620, '古野',        '会社1F倉庫', 1),
(10, '洗浄ボトル',                                          'consumable', null,     null, '100均',       null,        0),
(11, '泡ベーテルF清拭・洗浄料 150ml',                        'consumable', '1本',    855,  '古野',        '会社1F倉庫', 2),
(12, 'ベーテル保湿ローション 300ml',                         'sellable',   '1本',    990,  '古野',        '会社1F倉庫', 2),
(13, 'ポリマーコーティングクリーム 28g',                     'sellable',   '1本',    837,  '古野',        '会社1F倉庫', 0),
(14, 'ポリマーコーティングクリーム 92g',                     'sellable',   '1本',    1620, '古野',        '会社1F倉庫', 0),
(15, '守り帯 ９号ホワイト 20枚/箱',                          'sellable',   '1箱',    4000, '古野',        '会社1F倉庫', 0),
(16, '守り帯 12号ホワイト 20枚/箱',                          'sellable',   '1箱',    4000, '古野',        '会社1F倉庫', 0),
(17, 'ジェントルフィックス 12.5mm×7m 24巻/箱',              'sellable',   '1箱',    3240, '古野',        '会社1F倉庫', 0),
(18, 'ジェントルフィックス 23mm×7m 12巻/箱',                'sellable',   '1箱',    3240, '古野',        '会社1F倉庫', 0),
(19, 'トランスポアサージカルテープ 25mm×9.1m 12巻/箱',       'sellable',   '1箱',    2700, '古野',        '会社1F倉庫', 0),
(20, 'マイクロポアサージカルテープ 25mm×9.1m 12巻/箱',       'sellable',   '1箱',    2250, '古野',        '会社1F倉庫', 0),
(21, 'テガダーム スムースフィルムロール 5cm×12m',            'sellable',   '1個',    2430, '古野',        '会社1F倉庫', 0),
(22, 'テガダーム スムースフィルムロール 10cm×12m',           'sellable',   '1個',    4410, '古野',        '会社1F倉庫', 0),
(23, 'メディコムバイタル不織布ガーゼ 200枚/袋',              'sellable',   '1袋',    700,  '古野',        '会社1F倉庫', 5),
(24, 'メロリンガーゼ（未滅菌）10cm×20cm 75枚入り/箱',        'sellable',   '１箱',   4824, '古野',        '会社1F倉庫', 0),
(25, 'エスアイエイド 11号 30m×55cm/枚',                     'sellable',   '1枚',    3000, '古野',        '会社1F倉庫', 0),
(26, '週間投薬カレンダー（１日４回用）',                      'consumable', '1個',    2142, '古野',        '会社1F倉庫', 0),
(27, 'カットメン4cm×4cm 500g',                             'consumable', '1個',    910,  '古野',        '会社1F倉庫', 0),
(28, '白色ワセリンP',                                       'consumable', null,     988,  '個別購入',    '会社1F倉庫', 0),
(29, '母乳パット 130枚/１袋',                                'sellable',   '１袋',   713,  '個別購入',    '会社1F倉庫', 0),
(30, '消毒用エタノール',                                     'consumable', '１ボトル',966,  '個別購入',    '会社1F倉庫', 0),
(31, 'リップスティック',                                     'consumable', '１個',   550,  '個別購入',    '会社1F倉庫', 0),
(32, '血圧計',                                              'equipment',  '１個',   null, null,          '会社1F倉庫', 5),
(33, 'パルスオキシメーター',                                  'equipment',  '１個',   null, null,          '会社1F倉庫', 5),
(34, '電子体温計',                                           'equipment',  '１個',   null, null,          '会社1F倉庫', 5),
(35, 'メジャー',                                             'equipment',  '1個',    null, null,          '会社1F倉庫', 5),
(36, 'iphoneSE(3Gen)',                                      'equipment',  '１個',   null, null,          '会社1F倉庫', 1);

-- 販売単価の更新
update items set sell_unit = '1本',     sell_price = 1000 where no = 12;
update items set sell_unit = '1本',     sell_price = 1000 where no = 13;
update items set sell_unit = '1本',     sell_price = 2000 where no = 14;
update items set sell_unit = '1枚',     sell_price = 300  where no = 15;
update items set sell_unit = '1枚',     sell_price = 300  where no = 16;
update items set sell_unit = '１巻',    sell_price = 200  where no = 17;
update items set sell_unit = '１巻',    sell_price = 300  where no = 18;
update items set sell_unit = '１巻',    sell_price = 300  where no = 19;
update items set sell_unit = '１巻',    sell_price = 200  where no = 20;
update items set sell_unit = '１m',     sell_price = 300  where no = 21;
update items set sell_unit = '１m',     sell_price = 400  where no = 22;
update items set sell_unit = '20枚',    sell_price = 100  where no = 23;
update items set sell_unit = '１枚',    sell_price = 100  where no = 24;
update items set sell_unit = '10*10cm', sell_price = 200  where no = 25;
update items set sell_unit = '1本',     sell_price = 600  where no = 8;
update items set sell_unit = '20枚',    sell_price = 100  where no = 29;
