/**
 * 假資料 —— 沿用網頁範例集與儀表板那套 STUDIO 07 世界觀。
 * 客戶名、專案名、金額都對得起來，三個範例集串成同一個故事。
 */

/* ---------------- 電商：霧谷咖啡 ---------------- */
export type Bean = {
  id: string; name: string; en: string; origin: string; roast: '淺焙' | '中焙' | '深焙';
  price: number; notes: string[]; desc: string; stock: number; rating: number; hue: string;
};

export const BEANS: Bean[] = [
  { id: 'b1', name: '霧谷日曬', en: 'Misty Valley', origin: '衣索比亞 耶加雪菲', roast: '淺焙',
    price: 520, notes: ['藍莓', '茉莉', '柑橘'], stock: 24, rating: 4.8, hue: '#C97B4A',
    desc: '日曬處理帶出飽滿的莓果甜感，尾韻乾淨帶花香。冷掉之後更好喝。' },
  { id: 'b2', name: '晨霧拼配', en: 'Morning Fog', origin: '巴西 × 哥倫比亞', roast: '中焙',
    price: 420, notes: ['焦糖', '堅果', '可可'], stock: 58, rating: 4.6, hue: '#8B5E3C',
    desc: '店裡最常被回購的一支。牛奶進去也不會被蓋掉，做拿鐵很穩。' },
  { id: 'b3', name: '深谷夜行', en: 'Deep Valley', origin: '印尼 曼特寧', roast: '深焙',
    price: 460, notes: ['黑巧克力', '雪松', '菸草'], stock: 12, rating: 4.5, hue: '#4A3227',
    desc: '厚實、低酸、餘韻長。適合早上第一杯，或需要清醒的下午。' },
  { id: 'b4', name: '山嵐水洗', en: 'Mountain Haze', origin: '瓜地馬拉 安提瓜', roast: '淺焙',
    price: 480, notes: ['青蘋果', '蜂蜜', '紅茶'], stock: 31, rating: 4.7, hue: '#B98D5F',
    desc: '酸質明亮但不刺激，像剛切開的青蘋果。手沖的甜感很清楚。' },
  { id: 'b5', name: '午后微光', en: 'Afternoon Light', origin: '哥斯大黎加 塔拉珠', roast: '中焙',
    price: 540, notes: ['杏桃', '黑糖', '橙皮'], stock: 8, rating: 4.9, hue: '#D19A66',
    desc: '蜜處理的代表作。甜度高、層次多，冷萃放隔夜是另一種風景。' },
  { id: 'b6', name: '長夜漫漫', en: 'Long Night', origin: '低咖啡因 瑞士水處理', roast: '中焙',
    price: 500, notes: ['杏仁', '奶油', '麥芽'], stock: 19, rating: 4.3, hue: '#6E5241',
    desc: '拿掉咖啡因但沒拿掉味道。晚上想喝一杯又怕睡不著就是它。' },
];

export const GRINDS = ['原豆不磨', '手沖 中細', '義式 極細', '法壓 粗'] as const;
export const SIZES = [
  { label: '半磅 227g', mul: 1 },
  { label: '一磅 454g', mul: 1.85 },
] as const;

/* ---------------- 客戶端：STUDIO 07 專案 ---------------- */
export type Milestone = { name: string; date: string; done: boolean };
export type Project = {
  id: string; name: string; client: string; type: string; progress: number;
  status: '進行中' | '待回饋' | '已完成'; owner: string; due: string;
  milestones: Milestone[]; unread: number;
};

export const PROJECTS: Project[] = [
  { id: 'p1', name: '品牌識別重塑', client: '霧谷咖啡', type: '品牌識別', progress: 72,
    status: '待回饋', owner: '陳彥文', due: '2026-08-15', unread: 2,
    milestones: [
      { name: '探索 Discover', date: '06-02', done: true },
      { name: '定義 Define', date: '06-20', done: true },
      { name: '製作 Design', date: '07-28', done: false },
      { name: '上線 Deliver', date: '08-15', done: false },
    ] },
  { id: 'p2', name: '售票頁與主視覺', client: '潮汐音樂節', type: '視覺統籌', progress: 95,
    status: '待回饋', owner: '李思婷', due: '2026-07-25', unread: 1,
    milestones: [
      { name: '探索 Discover', date: '05-10', done: true },
      { name: '定義 Define', date: '05-28', done: true },
      { name: '製作 Design', date: '07-10', done: true },
      { name: '上線 Deliver', date: '07-25', done: false },
    ] },
  { id: 'p3', name: '產品官網維運', client: '明日方舟金融', type: '產品官網', progress: 100,
    status: '已完成', owner: '王柏睿', due: '2026-06-30', unread: 0,
    milestones: [
      { name: '探索 Discover', date: '03-04', done: true },
      { name: '定義 Define', date: '03-22', done: true },
      { name: '製作 Design', date: '05-30', done: true },
      { name: '上線 Deliver', date: '06-30', done: true },
    ] },
  { id: 'p4', name: '互動展場延伸', client: '白鹿美術館', type: '互動裝置', progress: 38,
    status: '進行中', owner: '林曉彤', due: '2026-09-30', unread: 0,
    milestones: [
      { name: '探索 Discover', date: '07-01', done: true },
      { name: '定義 Define', date: '07-30', done: false },
      { name: '製作 Design', date: '09-05', done: false },
      { name: '上線 Deliver', date: '09-30', done: false },
    ] },
];

/** 審稿畫面用的既有標註 */
export type Pin = { id: string; x: number; y: number; by: string; text: string; resolved: boolean };
export const REVIEW_PINS: Pin[] = [
  { id: 'k1', x: 0.26, y: 0.22, by: '陳品瑜', text: 'Logo 再大一點點，現在有點退縮。', resolved: false },
  { id: 'k2', x: 0.72, y: 0.55, by: '陳品瑜', text: '這裡的咖啡色偏紅，可以再灰一些嗎？', resolved: true },
];

/* ---------------- 記帳 ---------------- */
export const CATEGORIES = [
  { key: 'food', label: '餐飲', icon: '🍜', color: '#F59E0B' },
  { key: 'coffee', label: '咖啡', icon: '☕', color: '#8B5E3C' },
  { key: 'transit', label: '交通', icon: '🚇', color: '#2563EB' },
  { key: 'shop', label: '購物', icon: '🛍️', color: '#EC4899' },
  { key: 'fun', label: '娛樂', icon: '🎬', color: '#8B5CF6' },
  { key: 'other', label: '其他', icon: '📦', color: '#64748B' },
] as const;
export type CategoryKey = (typeof CATEGORIES)[number]['key'];

export type Entry = { id: string; amount: number; cat: CategoryKey; note: string; ts: number };

/** 第一次開啟時的示範資料（之後以使用者實際輸入為準，存在本機） */
export function seedEntries(): Entry[] {
  const now = Date.now();
  const day = 86400000;
  const raw: [number, CategoryKey, string, number][] = [
    [120, 'coffee', '霧谷 手沖', 0], [85, 'transit', '捷運', 0], [260, 'food', '午餐 便當', 0],
    [1280, 'shop', '球鞋', 1], [95, 'coffee', '拿鐵', 1], [420, 'food', '晚餐', 1],
    [330, 'fun', '電影票', 2], [60, 'transit', '公車', 2],
    [155, 'food', '早午餐', 3], [520, 'shop', '咖啡豆', 3],
    [88, 'coffee', '美式', 4], [240, 'food', '火鍋', 4], [150, 'other', '雜支', 5],
  ];
  return raw.map(([amount, cat, note, d], i) => ({
    id: 'e' + i, amount, cat, note, ts: now - d * day - i * 3600_000,
  }));
}

/* ---------------- 即時追蹤 ---------------- */
export const LIVE_STAGES = [
  { key: 'confirmed', label: '訂單已確認', detail: '霧谷咖啡 已收到你的訂單', icon: '✓' },
  { key: 'roasting', label: '現烘處理中', detail: '晨霧拼配 · 中焙 · 半磅', icon: '🔥' },
  { key: 'packed', label: '包裝完成', detail: '已交給外送夥伴', icon: '📦' },
  { key: 'delivering', label: '外送中', detail: '阿哲 正在前往你的位置', icon: '🛵' },
  { key: 'arrived', label: '已送達', detail: '請確認收件，祝有美好的一天', icon: '🎉' },
] as const;

export const COURIER = { name: '阿哲', plate: 'MRK-2071', rating: 4.9, trips: 1284 };
