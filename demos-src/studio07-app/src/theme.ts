/**
 * 共用設計系統
 * 四個 App 各有自己的主色，但間距、圓角、字級、陰影全部共用，
 * 這樣切換 App 時「手感」是一致的，只有個性不同。
 */
import { Platform } from 'react-native';

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 12, lg: 18, xl: 26, pill: 999 } as const;

export const font = {
  // 網頁上用系統字體堆疊，中文才不會掉到細明體
  family: Platform.select({
    web: '"Inter","Noto Sans TC",-apple-system,"Segoe UI",Roboto,sans-serif',
    default: undefined,
  }),
  mono: Platform.select({
    web: '"JetBrains Mono",ui-monospace,Menlo,monospace',
    default: 'monospace',
  }),
  size: { xs: 11, sm: 13, md: 15, lg: 18, xl: 22, xxl: 28, huge: 38 },
} as const;

/** 每個 App 的識別色 —— 刻意差異很大，總覽頁一眼分得出來 */
export const apps = {
  shop: {
    key: 'shop',
    name: '霧谷咖啡',
    sub: '電商購物',
    tagline: '選豆、客製、結帳',
    accent: '#8B5E3C',
    accentSoft: '#F3EAE1',
    bg: '#FBF8F5',
    surface: '#FFFFFF',
    ink: '#241A14',
    dim: '#8A7767',
    proves: '列表效能 · 購物車狀態 · 多步驟結帳',
  },
  studio: {
    key: 'studio',
    name: 'STUDIO 07',
    sub: '客戶協作端',
    tagline: '看進度、審稿、簽收',
    accent: '#2563EB',
    accentSoft: '#E7EEFE',
    bg: '#F6F8FB',
    surface: '#FFFFFF',
    ink: '#141A24',
    dim: '#6B7688',
    proves: '進度視覺化 · 圖上標註 · 手勢',
  },
  ledger: {
    key: 'ledger',
    name: '記一筆',
    sub: '記帳工具',
    tagline: '三秒記完一筆帳',
    accent: '#0F9D58',
    accentSoft: '#E4F6EC',
    bg: '#F7FAF8',
    surface: '#FFFFFF',
    ink: '#12211A',
    dim: '#6C8078',
    proves: '本機儲存 · 離線可用 · 圖表',
  },
  live: {
    key: 'live',
    name: '追蹤中',
    sub: '即時外送',
    tagline: '你的咖啡在路上',
    accent: '#E8590C',
    accentSoft: '#FDECE0',
    bg: '#0F1115',
    surface: '#191D24',
    ink: '#F2F4F7',
    dim: '#8C95A3',
    proves: '狀態機 · 即時更新 · 動畫',
    dark: true,
  },
} as const;

export type AppKey = keyof typeof apps;
export type AppTheme = (typeof apps)[AppKey];

export const shadow = (level: 1 | 2 | 3 = 1) =>
  Platform.select({
    web: {
      boxShadow: [
        '0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.05)',
        '0 4px 10px -2px rgba(16,24,40,.10), 0 2px 6px -2px rgba(16,24,40,.06)',
        '0 18px 36px -12px rgba(16,24,40,.20)',
      ][level - 1],
    } as any,
    default: {
      shadowColor: '#101828',
      shadowOpacity: [0.06, 0.12, 0.2][level - 1],
      shadowRadius: [3, 10, 24][level - 1],
      shadowOffset: { width: 0, height: [1, 4, 12][level - 1] },
      elevation: [1, 4, 10][level - 1],
    },
  })!;

export const nt = (n: number) => 'NT$' + n.toLocaleString('zh-TW');
