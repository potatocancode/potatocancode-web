/** 購物車 + 三步驟結帳（收件 → 付款 → 完成） */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { BEANS } from '../../src/data';
import { CART_RULES, SIZES, useCart } from '../../src/cart';
import { apps, font, nt, radius, shadow, space } from '../../src/theme';
import { BeanArt } from '../../src/BeanArt';
import { Button, Header, StatusBar } from '../../src/ui';

const t = apps.shop;
const STEPS = ['購物車', '收件資料', '付款方式', '完成'] as const;

export default function Cart() {
  const router = useRouter();
  const cart = useCart();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', phone: '', addr: '' });
  const [pay, setPay] = useState<'card' | 'cod' | 'store'>('card');

  const canNext =
    step === 0 ? cart.count > 0
    : step === 1 ? form.name.trim() !== '' && form.phone.trim().length >= 8 && form.addr.trim() !== ''
    : true;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar t={t} />
      <Header
        t={t}
        title={STEPS[step]}
        sub={step < 3 ? `步驟 ${step + 1} / 3` : undefined}
        onBack={step === 0 ? () => router.back() : () => setStep((s) => s - 1)}
      />

      {step < 3 && <Progress step={step} />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: 140 }}
      >
        {step === 0 && <StepCart />}
        {step === 1 && <StepAddress form={form} setForm={setForm} />}
        {step === 2 && <StepPayment pay={pay} setPay={setPay} />}
        {step === 3 && <StepDone form={form} />}
      </ScrollView>

      {step < 3 && (
        <View
          style={[
            {
              position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: t.surface,
              paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.xl,
              borderTopWidth: 1, borderTopColor: 'rgba(16,24,40,.07)', gap: space.md,
            },
            shadow(2),
          ]}
        >
          <Totals />
          <Button
            t={t}
            label={step === 2 ? `確認付款 ${nt(cart.total)}` : '下一步'}
            disabled={!canNext}
            onPress={() => setStep((s) => s + 1)}
          />
        </View>
      )}
    </View>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: space.lg, paddingBottom: space.lg }}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{
            flex: 1, height: 4, borderRadius: 2,
            backgroundColor: i <= step ? t.accent : 'rgba(16,24,40,.10)',
          }}
        />
      ))}
    </View>
  );
}

function StepCart() {
  const cart = useCart();
  const router = useRouter();

  if (cart.count === 0) {
    return (
      <View style={{ alignItems: 'center', paddingTop: 70, gap: space.lg }}>
        <Text style={{ fontSize: 44 }}>🛒</Text>
        <Text style={{ fontFamily: font.family, fontSize: 15, color: t.dim }}>購物車還是空的</Text>
        <Button t={t} label="去挑豆子" variant="soft" onPress={() => router.replace('/shop')} />
      </View>
    );
  }

  return (
    <View style={{ gap: space.md }}>
      {cart.lines.map((l) => {
        const bean = BEANS.find((b) => b.id === l.beanId)!;
        const unit = Math.round(bean.price * SIZES[l.sizeIdx].mul);
        return (
          <View
            key={l.key}
            style={[
              {
                backgroundColor: t.surface, borderRadius: radius.lg, padding: space.md,
                flexDirection: 'row', gap: space.md, alignItems: 'center',
              },
              shadow(1),
            ]}
          >
            <BeanArt hue={bean.hue} size={64} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                numberOfLines={1}
                style={{ fontFamily: font.family, fontSize: 14.5, fontWeight: '700', color: t.ink }}
              >
                {bean.name}
              </Text>
              <Text style={{ fontFamily: font.family, fontSize: 11.5, color: t.dim, marginTop: 2 }}>
                {l.grind} · {SIZES[l.sizeIdx].label}
              </Text>
              <Text style={{ fontFamily: font.mono, fontSize: 13.5, fontWeight: '700', color: t.ink, marginTop: 5 }}>
                {nt(unit * l.qty)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <MiniBtn label="−" onPress={() => cart.setQty(l.key, l.qty - 1)} />
              <Text
                style={{
                  fontFamily: font.mono, fontSize: 14, fontWeight: '700',
                  color: t.ink, minWidth: 22, textAlign: 'center',
                }}
              >
                {l.qty}
              </Text>
              <MiniBtn label="＋" onPress={() => cart.setQty(l.key, l.qty + 1)} />
            </View>
          </View>
        );
      })}

      {cart.subtotal < CART_RULES.FREE_SHIPPING_AT && (
        <View style={{ backgroundColor: t.accentSoft, borderRadius: radius.md, padding: space.md }}>
          <Text style={{ fontFamily: font.family, fontSize: 12.5, color: t.accent, lineHeight: 20 }}>
            再買 {nt(CART_RULES.FREE_SHIPPING_AT - cart.subtotal)} 就免運費
          </Text>
        </View>
      )}
    </View>
  );
}

function MiniBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label === '＋' ? '增加' : '減少'}
      style={({ pressed }) => ({
        width: 36, height: 36, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center',
        backgroundColor: t.accentSoft, opacity: pressed ? 0.65 : 1,
      })}
    >
      <Text style={{ fontSize: 16, fontWeight: '700', color: t.accent, lineHeight: 18 }}>{label}</Text>
    </Pressable>
  );
}

function StepAddress({
  form, setForm,
}: {
  form: { name: string; phone: string; addr: string };
  setForm: (f: any) => void;
}) {
  return (
    <View style={{ gap: space.lg }}>
      <Field label="收件人" value={form.name} placeholder="王小明"
        onChange={(v) => setForm({ ...form, name: v })} />
      <Field label="手機號碼" value={form.phone} placeholder="09xx-xxx-xxx" keyboard="phone-pad"
        onChange={(v) => setForm({ ...form, phone: v })}
        hint={form.phone.length > 0 && form.phone.length < 8 ? '手機號碼看起來不完整' : undefined} />
      <Field label="配送地址" value={form.addr} placeholder="台北市大安區信義路四段 07 號 7 樓" multiline
        onChange={(v) => setForm({ ...form, addr: v })} />
    </View>
  );
}

function Field({
  label, value, onChange, placeholder, multiline, keyboard, hint,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  multiline?: boolean; keyboard?: 'phone-pad'; hint?: string;
}) {
  return (
    <View>
      {/* 標籤永遠顯示，不用 placeholder 當標籤 */}
      <Text style={{ fontFamily: font.family, fontSize: 12.5, fontWeight: '600', color: t.ink, marginBottom: 7 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="rgba(138,119,103,.55)"
        keyboardType={keyboard}
        multiline={multiline}
        accessibilityLabel={label}
        style={[
          {
            backgroundColor: t.surface, borderRadius: radius.md,
            borderWidth: 1.5, borderColor: hint ? '#E0483C' : 'rgba(16,24,40,.12)',
            paddingHorizontal: space.lg, paddingVertical: 13,
            minHeight: multiline ? 84 : 50, textAlignVertical: multiline ? 'top' : 'center',
            fontFamily: font.family, fontSize: 14.5, color: t.ink,
          },
          // 取消瀏覽器預設的聚焦外框（RN 型別沒有這個屬性，但 web 上有效）
          { outlineStyle: 'none' } as any,
        ]}
      />
      {!!hint && (
        <Text style={{ fontFamily: font.family, fontSize: 11.5, color: '#E0483C', marginTop: 5 }}>
          {hint}
        </Text>
      )}
    </View>
  );
}

function StepPayment({ pay, setPay }: { pay: string; setPay: (p: any) => void }) {
  const opts = [
    { k: 'card', icon: '💳', label: '信用卡', sub: '一次付清 · 支援 3D 驗證' },
    { k: 'cod', icon: '💵', label: '貨到付款', sub: '需額外支付 30 元手續費' },
    { k: 'store', icon: '🏪', label: '超商取貨付款', sub: '7-11 / 全家 · 約 2-3 個工作天' },
  ];
  return (
    <View style={{ gap: space.md }}>
      {opts.map((o) => (
        <Pressable
          key={o.k}
          onPress={() => setPay(o.k)}
          accessibilityRole="radio"
          accessibilityState={{ selected: pay === o.k }}
          style={({ pressed }) => [
            {
              backgroundColor: t.surface, borderRadius: radius.lg, padding: space.lg,
              flexDirection: 'row', alignItems: 'center', gap: space.md,
              borderWidth: 1.8, borderColor: pay === o.k ? t.accent : 'rgba(16,24,40,.10)',
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Text style={{ fontSize: 24 }}>{o.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: font.family, fontSize: 14.5, fontWeight: '700', color: t.ink }}>
              {o.label}
            </Text>
            <Text style={{ fontFamily: font.family, fontSize: 11.5, color: t.dim, marginTop: 2 }}>
              {o.sub}
            </Text>
          </View>
          <View
            style={{
              width: 21, height: 21, borderRadius: 11, borderWidth: 2,
              borderColor: pay === o.k ? t.accent : 'rgba(16,24,40,.2)',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            {pay === o.k && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: t.accent }} />}
          </View>
        </Pressable>
      ))}
    </View>
  );
}

function StepDone({ form }: { form: { name: string; addr: string } }) {
  const cart = useCart();
  const router = useRouter();
  return (
    <View style={{ alignItems: 'center', paddingTop: 50, gap: space.lg }}>
      <View
        style={{
          width: 84, height: 84, borderRadius: 42, backgroundColor: t.accentSoft,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 40 }}>✓</Text>
      </View>
      <Text style={{ fontFamily: font.family, fontSize: 21, fontWeight: '800', color: t.ink }}>
        訂單成立
      </Text>
      <Text style={{ fontFamily: font.family, fontSize: 13.5, color: t.dim, textAlign: 'center', lineHeight: 22 }}>
        {form.name || '王小明'}，我們會在今天下午現烘{'\n'}並於明天送達 {form.addr || '你填的地址'}
      </Text>
      <Text style={{ fontFamily: font.mono, fontSize: 12.5, color: t.dim, marginTop: space.sm }}>
        訂單編號 WG-26071901
      </Text>
      <View style={{ gap: space.md, width: '100%', marginTop: space.lg }}>
        <Button t={t} label="追蹤這筆訂單" onPress={() => router.push('/live')} />
        <Button
          t={t}
          label="回到商品列表"
          variant="soft"
          onPress={() => { cart.clear(); router.replace('/shop'); }}
        />
      </View>
    </View>
  );
}

function Totals() {
  const cart = useCart();
  return (
    <View style={{ gap: 4 }}>
      <Row label={`小計（${cart.count} 件）`} value={nt(cart.subtotal)} />
      <Row label="運費" value={cart.shipping === 0 ? '免運' : nt(cart.shipping)} />
      <View style={{ height: 1, backgroundColor: 'rgba(16,24,40,.08)', marginVertical: 5 }} />
      <Row label="總計" value={nt(cart.total)} bold />
    </View>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ fontFamily: font.family, fontSize: bold ? 14 : 12.5, fontWeight: bold ? '700' : '400', color: bold ? t.ink : t.dim }}>
        {label}
      </Text>
      <Text style={{ fontFamily: font.mono, fontSize: bold ? 17 : 13, fontWeight: '700', color: t.ink }}>
        {value}
      </Text>
    </View>
  );
}
