/** 商品詳情：選研磨度與份量，加入購物車時有飛入動畫 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, Text, View } from 'react-native';
import { BEANS } from '../../src/data';
import { GRINDS, SIZES, useCart } from '../../src/cart';
import { apps, font, nt, radius, shadow, space } from '../../src/theme';
import { BeanArt } from '../../src/BeanArt';
import { Button, Header, StatusBar } from '../../src/ui';

const t = apps.shop;

/**
 * 靜態匯出時要為每個 id 產生一份 HTML。
 * 沒有這個，dist 只會有一個字面檔名 [id].html，/shop/b1 會對不到任何檔案。
 */
export async function generateStaticParams() {
  return BEANS.map((b) => ({ id: b.id }));
}

export default function BeanDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const cart = useCart();
  const bean = BEANS.find((b) => b.id === id);

  const [grind, setGrind] = useState<string>(GRINDS[1]);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);

  // 加入購物車的回饋動畫
  const fly = useRef(new Animated.Value(0)).current;
  const [flying, setFlying] = useState(false);

  if (!bean) {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg }}>
        <StatusBar t={t} />
        <Header t={t} title="找不到商品" onBack={() => router.back()} />
      </View>
    );
  }

  const unit = Math.round(bean.price * SIZES[sizeIdx].mul);

  const onAdd = () => {
    cart.add(bean.id, grind, sizeIdx, qty);
    setFlying(true);
    fly.setValue(0);
    Animated.timing(fly, {
      toValue: 1, duration: 620, easing: Easing.out(Easing.cubic), useNativeDriver: true,
    }).start(() => setFlying(false));
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar t={t} />
      <Header
        t={t}
        title={bean.name}
        sub={bean.en}
        onBack={() => router.back()}
        right={
          <Pressable
            onPress={() => router.push('/shop/cart')}
            accessibilityRole="button"
            accessibilityLabel={`購物車，${cart.count} 件`}
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ fontSize: 19 }}>🛒</Text>
            {cart.count > 0 && (
              <View
                style={{
                  position: 'absolute', top: 2, right: 2, minWidth: 18, height: 18, borderRadius: 9,
                  backgroundColor: t.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
                }}
              >
                <Text style={{ fontFamily: font.mono, fontSize: 10, fontWeight: '700', color: '#fff' }}>
                  {cart.count}
                </Text>
              </View>
            )}
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: 130 }}
      >
        <View style={{ alignItems: 'center', marginVertical: space.md }}>
          <BeanArt hue={bean.hue} size={180} />
        </View>

        <Text style={{ fontFamily: font.family, fontSize: 13, color: t.dim }}>
          {bean.origin} · {bean.roast}
        </Text>
        <Text
          style={{
            fontFamily: font.mono, fontSize: 30, fontWeight: '700', color: t.ink,
            marginTop: 4, letterSpacing: -1,
          }}
        >
          {nt(unit)}
        </Text>

        <View style={{ flexDirection: 'row', gap: 6, marginTop: space.md, flexWrap: 'wrap' }}>
          {bean.notes.map((n) => (
            <Text
              key={n}
              style={{
                fontFamily: font.family, fontSize: 12, color: t.accent, fontWeight: '600',
                backgroundColor: t.accentSoft, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill,
              }}
            >
              {n}
            </Text>
          ))}
        </View>

        <Text style={{ fontFamily: font.family, fontSize: 14, lineHeight: 24, color: t.dim, marginTop: space.lg }}>
          {bean.desc}
        </Text>

        <Section title="研磨度">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
            {GRINDS.map((g) => (
              <Option key={g} label={g} active={grind === g} onPress={() => setGrind(g)} />
            ))}
          </View>
        </Section>

        <Section title="份量">
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            {SIZES.map((s, i) => (
              <Option
                key={s.label}
                label={s.label}
                sub={nt(Math.round(bean.price * s.mul))}
                active={sizeIdx === i}
                onPress={() => setSizeIdx(i)}
                grow
              />
            ))}
          </View>
        </Section>

        <Section title="數量">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.lg }}>
            <Stepper value={qty} onChange={setQty} max={bean.stock} />
            <Text style={{ fontFamily: font.family, fontSize: 12.5, color: t.dim }}>
              庫存 {bean.stock} 份
            </Text>
          </View>
        </Section>
      </ScrollView>

      {/* 底部固定操作列 */}
      <View
        style={[
          {
            position: 'absolute', left: 0, right: 0, bottom: 0,
            backgroundColor: t.surface, paddingHorizontal: space.lg,
            paddingTop: space.md, paddingBottom: space.xl,
            borderTopWidth: 1, borderTopColor: 'rgba(16,24,40,.07)',
            flexDirection: 'row', alignItems: 'center', gap: space.md,
          },
          shadow(2),
        ]}
      >
        <View>
          <Text style={{ fontFamily: font.family, fontSize: 11, color: t.dim }}>小計</Text>
          <Text style={{ fontFamily: font.mono, fontSize: 19, fontWeight: '700', color: t.ink }}>
            {nt(unit * qty)}
          </Text>
        </View>
        <Button t={t} label="加入購物車" onPress={onAdd} style={{ flex: 1 }} />
      </View>

      {/* 飛入購物車的小圓點 */}
      {flying && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute', left: '50%', top: 200, width: 26, height: 26, borderRadius: 13,
            backgroundColor: bean.hue, zIndex: 200,
            opacity: fly.interpolate({ inputRange: [0, 0.75, 1], outputRange: [1, 1, 0] }),
            transform: [
              { translateX: fly.interpolate({ inputRange: [0, 1], outputRange: [0, 120] }) },
              { translateY: fly.interpolate({ inputRange: [0, 0.45, 1], outputRange: [0, -110, -175] }) },
              { scale: fly.interpolate({ inputRange: [0, 1], outputRange: [1, 0.42] }) },
            ],
          }}
        />
      )}
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: space.xl }}>
      <Text
        style={{
          fontFamily: font.family, fontSize: 12.5, fontWeight: '700',
          color: t.ink, marginBottom: space.md,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function Option({
  label, sub, active, onPress, grow,
}: {
  label: string; sub?: string; active: boolean; onPress: () => void; grow?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      style={({ pressed }) => ({
        flex: grow ? 1 : undefined,
        minHeight: 46, paddingHorizontal: space.lg, paddingVertical: space.sm,
        borderRadius: radius.md, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.6,
        borderColor: active ? t.accent : 'rgba(16,24,40,.12)',
        backgroundColor: active ? t.accentSoft : t.surface,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text
        style={{
          fontFamily: font.family, fontSize: 13.5, fontWeight: active ? '700' : '500',
          color: active ? t.accent : t.ink,
        }}
      >
        {label}
      </Text>
      {!!sub && (
        <Text style={{ fontFamily: font.mono, fontSize: 11, color: active ? t.accent : t.dim, marginTop: 2 }}>
          {sub}
        </Text>
      )}
    </Pressable>
  );
}

function Stepper({ value, onChange, max }: { value: number; onChange: (n: number) => void; max: number }) {
  const btn = (label: string, delta: number, disabled: boolean) => (
    <Pressable
      onPress={() => onChange(Math.min(max, Math.max(1, value + delta)))}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={delta > 0 ? '增加數量' : '減少數量'}
      style={({ pressed }) => ({
        width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center',
        backgroundColor: t.accentSoft, opacity: disabled ? 0.35 : pressed ? 0.7 : 1,
      })}
    >
      <Text style={{ fontSize: 20, fontWeight: '700', color: t.accent, lineHeight: 22 }}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
      {btn('−', -1, value <= 1)}
      <Text
        style={{
          fontFamily: font.mono, fontSize: 18, fontWeight: '700', color: t.ink,
          minWidth: 28, textAlign: 'center',
        }}
      >
        {value}
      </Text>
      {btn('＋', 1, value >= max)}
    </View>
  );
}
