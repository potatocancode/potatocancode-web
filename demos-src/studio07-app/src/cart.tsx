/** 購物車狀態：用 Context 掛在 shop 的 layout 上，三個畫面共用 */
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { BEANS, GRINDS, SIZES } from './data';

export type CartLine = {
  key: string;          // beanId|grind|size 組合，同組合就累加數量
  beanId: string;
  grind: string;
  sizeIdx: number;
  qty: number;
};

type Ctx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  add: (beanId: string, grind: string, sizeIdx: number, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<Ctx | null>(null);

const FREE_SHIPPING_AT = 1500;
const SHIPPING_FEE = 80;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const value = useMemo<Ctx>(() => {
    const subtotal = lines.reduce((sum, l) => {
      const bean = BEANS.find((b) => b.id === l.beanId)!;
      return sum + Math.round(bean.price * SIZES[l.sizeIdx].mul) * l.qty;
    }, 0);
    // 滿額免運，這條規則在購物車與結帳都要一致
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE;

    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      add(beanId, grind, sizeIdx, qty = 1) {
        const key = `${beanId}|${grind}|${sizeIdx}`;
        setLines((prev) => {
          const hit = prev.find((l) => l.key === key);
          if (hit) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
          return [...prev, { key, beanId, grind, sizeIdx, qty }];
        });
      },
      setQty(key, qty) {
        setLines((prev) =>
          qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l)),
        );
      },
      clear: () => setLines([]),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error('useCart 必須在 CartProvider 之內使用');
  return c;
}

export const CART_RULES = { FREE_SHIPPING_AT, SHIPPING_FEE };
export { GRINDS, SIZES };
