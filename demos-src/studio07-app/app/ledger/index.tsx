/** 記一筆 —— 自製數字鍵盤 + 最近紀錄 */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { CATEGORIES, CategoryKey } from '../../src/data';
import { apps, font, nt, radius, shadow, space } from '../../src/theme';
import { Header, HomeButton, Label, StatusBar } from '../../src/ui';
import { useLedger } from './_layout';

const t = apps.ledger;
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

export default function Ledger() {
  const router = useRouter();
  const { entries, add, ready } = useLedger();
  const [amount, setAmount] = useState('');
  const [cat, setCat] = useState<CategoryKey>('food');
  const [note, setNote] = useState('');

  const todayTotal = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return entries.filter((e) => e.ts >= start.getTime()).reduce((s, e) => s + e.amount, 0);
  }, [entries]);

  const press = (k: string) => {
    if (k === 'C') return setAmount('');
    if (k === '⌫') return setAmount((a) => a.slice(0, -1));
    if (amount.length >= 7) return;
    if (k === '0' && amount === '') return;
    setAmount((a) => a + k);
  };

  const submit = () => {
    const n = Number(amount);
    if (!n) return;
    add(n, cat, note.trim() || CATEGORIES.find((c) => c.key === cat)!.label);
    setAmount('');
    setNote('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar t={t} />
      <Header
        t={t}
        title="記一筆"
        sub={ready ? `今天已花 ${nt(todayTotal)}` : '讀取本機資料…'}
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <HomeButton t={t} />
            <Pressable
              onPress={() => router.push('/ledger/stats')}
              accessibilityRole="button"
              accessibilityLabel="查看統計"
              style={({ pressed }) => ({
                width: 40, height: 40, borderRadius: radius.pill,
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: pressed ? t.accentSoft : 'transparent',
              })}
            >
              <Text style={{ fontSize: 18 }}>📊</Text>
            </Pressable>
          </View>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: space.xl }}>
        {/* 金額顯示 */}
        <View style={{ alignItems: 'center', paddingVertical: space.md }}>
          <Text
            style={{
              fontFamily: font.mono, fontSize: 46, fontWeight: '700',
              color: amount ? t.ink : 'rgba(108,128,120,.35)', letterSpacing: -2,
            }}
          >
            ${amount || '0'}
          </Text>
        </View>

        {/* 分類 */}
        <View
          style={{
            flexDirection: 'row', flexWrap: 'wrap', gap: space.sm,
            paddingHorizontal: space.lg, justifyContent: 'center',
          }}
        >
          {CATEGORIES.map((c) => {
            const on = cat === c.key;
            return (
              <Pressable
                key={c.key}
                onPress={() => setCat(c.key)}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                style={({ pressed }) => ({
                  minWidth: 62, minHeight: 62, borderRadius: radius.md,
                  alignItems: 'center', justifyContent: 'center', gap: 3,
                  backgroundColor: on ? c.color : t.surface,
                  borderWidth: 1.5, borderColor: on ? c.color : 'rgba(16,24,40,.09)',
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <Text style={{ fontSize: 19 }}>{c.icon}</Text>
                <Text
                  style={{
                    fontFamily: font.family, fontSize: 11, fontWeight: '600',
                    color: on ? '#fff' : t.dim,
                  }}
                >
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 備註 */}
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="備註（選填）"
          placeholderTextColor="rgba(108,128,120,.5)"
          accessibilityLabel="備註"
          style={[
            {
              marginHorizontal: space.lg, marginTop: space.lg, height: 46,
              borderRadius: radius.md, backgroundColor: t.surface,
              borderWidth: 1.5, borderColor: 'rgba(16,24,40,.09)',
              paddingHorizontal: space.lg, fontFamily: font.family, fontSize: 14, color: t.ink,
            },
            { outlineStyle: 'none' } as any,
          ]}
        />

        {/* 數字鍵盤 */}
        <View
          style={{
            flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: space.lg,
            marginTop: space.lg, gap: space.sm,
          }}
        >
          {KEYS.map((k) => (
            <Pressable
              key={k}
              onPress={() => press(k)}
              accessibilityRole="button"
              accessibilityLabel={k === '⌫' ? '刪除' : k === 'C' ? '清除' : k}
              style={({ pressed }) => ({
                width: '31.4%', height: 54, borderRadius: radius.md,
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: pressed ? t.accentSoft : t.surface,
                borderWidth: 1, borderColor: 'rgba(16,24,40,.07)',
              })}
            >
              <Text
                style={{
                  fontFamily: font.mono, fontSize: 21, fontWeight: '600',
                  color: k === 'C' || k === '⌫' ? t.dim : t.ink,
                }}
              >
                {k}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={submit}
          disabled={!amount}
          accessibilityRole="button"
          style={({ pressed }) => ({
            marginHorizontal: space.lg, marginTop: space.lg, height: 52,
            borderRadius: radius.md, alignItems: 'center', justifyContent: 'center',
            backgroundColor: t.accent, opacity: !amount ? 0.35 : pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ fontFamily: font.family, fontSize: 16, fontWeight: '700', color: '#fff' }}>
            記下來
          </Text>
        </Pressable>

        {/* 最近紀錄 */}
        <View style={{ paddingHorizontal: space.lg, marginTop: space.xl }}>
          <Label t={t} style={{ marginBottom: space.md }}>最近紀錄</Label>
          {entries.slice(0, 6).map((e) => {
            const c = CATEGORIES.find((x) => x.key === e.cat)!;
            return (
              <View
                key={e.id}
                style={[
                  {
                    backgroundColor: t.surface, borderRadius: radius.md, padding: space.md,
                    flexDirection: 'row', alignItems: 'center', gap: space.md, marginBottom: space.sm,
                  },
                  shadow(1),
                ]}
              >
                <View
                  style={{
                    width: 36, height: 36, borderRadius: 18, backgroundColor: c.color + '22',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{c.icon}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text numberOfLines={1} style={{ fontFamily: font.family, fontSize: 14, fontWeight: '600', color: t.ink }}>
                    {e.note}
                  </Text>
                  <Text style={{ fontFamily: font.family, fontSize: 11, color: t.dim, marginTop: 1 }}>
                    {c.label} · {new Date(e.ts).toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' })}
                  </Text>
                </View>
                <Text style={{ fontFamily: font.mono, fontSize: 15, fontWeight: '700', color: t.ink }}>
                  −{e.amount}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
