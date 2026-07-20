/** 統計：分類佔比環圈 + 近 7 日長條，全部用 SVG 手刻 */
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { CATEGORIES } from '../../src/data';
import { apps, font, nt, radius, shadow, space } from '../../src/theme';
import { Button, Card, Header, Label, StatusBar } from '../../src/ui';
import { useLedger } from './_layout';

const t = apps.ledger;

export default function Stats() {
  const router = useRouter();
  const { entries, reset } = useLedger();

  const total = entries.reduce((s, e) => s + e.amount, 0);

  const byCat = useMemo(() => {
    const m = CATEGORIES.map((c) => ({
      ...c,
      sum: entries.filter((e) => e.cat === c.key).reduce((s, e) => s + e.amount, 0),
    }))
      .filter((c) => c.sum > 0)
      .sort((a, b) => b.sum - a.sum);
    return m;
  }, [entries]);

  const days = useMemo(() => {
    const out: { label: string; sum: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const next = d.getTime() + 86400000;
      out.push({
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        sum: entries.filter((e) => e.ts >= d.getTime() && e.ts < next).reduce((s, e) => s + e.amount, 0),
      });
    }
    return out;
  }, [entries]);

  const maxDay = Math.max(1, ...days.map((d) => d.sum));

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar t={t} />
      <Header t={t} title="統計" sub={`共 ${entries.length} 筆紀錄`} onBack={() => router.back()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: space.xxl, gap: space.md }}
      >
        <Card t={t} style={[{ alignItems: 'center', paddingVertical: space.xl }, shadow(1)]}>
          <Donut data={byCat} total={total} />
          <Text style={{ fontFamily: font.family, fontSize: 12.5, color: t.dim, marginTop: space.md }}>
            全部支出合計
          </Text>
        </Card>

        <Card t={t} style={shadow(1)}>
          <Label t={t} style={{ marginBottom: space.lg }}>分類佔比</Label>
          {byCat.map((c) => (
            <View key={c.key} style={{ marginBottom: space.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, marginBottom: 6 }}>
                <Text style={{ fontSize: 14 }}>{c.icon}</Text>
                <Text style={{ flex: 1, fontFamily: font.family, fontSize: 13.5, color: t.ink }}>
                  {c.label}
                </Text>
                <Text style={{ fontFamily: font.mono, fontSize: 13, fontWeight: '700', color: t.ink }}>
                  {nt(c.sum)}
                </Text>
                <Text style={{ fontFamily: font.mono, fontSize: 11, color: t.dim, width: 40, textAlign: 'right' }}>
                  {((c.sum / total) * 100).toFixed(0)}%
                </Text>
              </View>
              <View style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(16,24,40,.06)', overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${(c.sum / total) * 100}%`, backgroundColor: c.color, borderRadius: 3 }} />
              </View>
            </View>
          ))}
        </Card>

        <Card t={t} style={shadow(1)}>
          <Label t={t} style={{ marginBottom: space.lg }}>近 7 日</Label>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 110, gap: 6 }}>
            {days.map((d) => (
              <View key={d.label} style={{ flex: 1, alignItems: 'center', gap: 5 }}>
                <Text style={{ fontFamily: font.mono, fontSize: 9.5, color: t.dim }}>
                  {d.sum > 0 ? d.sum : ''}
                </Text>
                <View
                  style={{
                    width: '100%',
                    height: Math.max(3, (d.sum / maxDay) * 74),
                    borderRadius: 4,
                    backgroundColor: d.sum > 0 ? t.accent : 'rgba(16,24,40,.08)',
                  }}
                />
                <Text style={{ fontFamily: font.mono, fontSize: 9.5, color: t.dim }}>{d.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card t={t} style={shadow(1)}>
          <Label t={t}>資料儲存在哪</Label>
          <Text style={{ fontFamily: font.family, fontSize: 12.5, color: t.dim, lineHeight: 21, marginTop: space.sm }}>
            這些紀錄存在你自己的裝置上（AsyncStorage）。重新整理、關掉分頁再回來都還在，
            完全不需要連線。按下面的按鈕可以還原成示範資料。
          </Text>
          <Button t={t} label="重設為示範資料" variant="soft" onPress={reset} style={{ marginTop: space.lg }} />
        </Card>
      </ScrollView>
    </View>
  );
}

/** 環圈圖：用 stroke-dasharray 疊圓，比算弧線 path 簡單且不會有浮點誤差 */
function Donut({ data, total }: { data: { color: string; sum: number }[]; total: number }) {
  const size = 168;
  const stroke = 22;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2} cy={size / 2} r={r}
            stroke="rgba(16,24,40,.06)" strokeWidth={stroke} fill="none"
          />
          {data.map((d) => {
            const len = (d.sum / (total || 1)) * circ;
            const el = (
              <Circle
                key={d.color}
                cx={size / 2} cy={size / 2} r={r}
                stroke={d.color} strokeWidth={stroke} fill="none"
                strokeDasharray={`${len} ${circ - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += len;
            return el;
          })}
        </G>
      </Svg>
      <Text
        style={{
          fontFamily: font.mono, fontSize: 25, fontWeight: '700',
          color: t.ink, letterSpacing: -1,
        }}
      >
        {nt(total)}
      </Text>
    </View>
  );
}
