/** 專案詳情：里程碑時間軸 + 進入審稿 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { PROJECTS } from '../../src/data';
import { apps, font, shadow, space } from '../../src/theme';
import { Button, Card, Header, Label, StatusBar } from '../../src/ui';

const t = apps.studio;

/** 同 shop/[id]：靜態匯出需要為每個專案各產生一份 HTML */
export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

export default function ProjectDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const p = PROJECTS.find((x) => x.id === id);

  if (!p) {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg }}>
        <StatusBar t={t} />
        <Header t={t} title="找不到專案" onBack={() => router.back()} />
      </View>
    );
  }

  const doneCount = p.milestones.filter((m) => m.done).length;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar t={t} />
      <Header t={t} title={p.name} sub={p.client} onBack={() => router.back()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: space.xxl, gap: space.md }}
      >
        {/* 進度環 */}
        <Card t={t} style={[{ alignItems: 'center', paddingVertical: space.xl }, shadow(1)]}>
          <Ring value={p.progress} />
          <Text style={{ fontFamily: font.family, fontSize: 13, color: t.dim, marginTop: space.md }}>
            {doneCount} / {p.milestones.length} 個階段完成 · 預計 {p.due} 交付
          </Text>
        </Card>

        {/* 時間軸 */}
        <Card t={t} style={shadow(1)}>
          <Label t={t} style={{ marginBottom: space.lg }}>專案進度</Label>
          {p.milestones.map((m, i) => {
            const isCurrent = !m.done && p.milestones.slice(0, i).every((x) => x.done);
            return (
              <View key={m.name} style={{ flexDirection: 'row', gap: space.md }}>
                {/* 時間軸的點與線 */}
                <View style={{ alignItems: 'center', width: 18 }}>
                  <View
                    style={{
                      width: 13, height: 13, borderRadius: 7, marginTop: 3,
                      borderWidth: 2.5,
                      borderColor: m.done ? t.accent : isCurrent ? '#F59E0B' : 'rgba(16,24,40,.16)',
                      backgroundColor: m.done ? t.accent : t.surface,
                    }}
                  />
                  {i < p.milestones.length - 1 && (
                    <View
                      style={{
                        width: 2, flex: 1, minHeight: 34,
                        backgroundColor: m.done ? t.accent : 'rgba(16,24,40,.1)',
                      }}
                    />
                  )}
                </View>

                <View style={{ flex: 1, paddingBottom: i < p.milestones.length - 1 ? space.lg : 0 }}>
                  <Text
                    style={{
                      fontFamily: font.family, fontSize: 14.5,
                      fontWeight: isCurrent ? '800' : '600',
                      color: m.done || isCurrent ? t.ink : t.dim,
                    }}
                  >
                    {m.name}
                  </Text>
                  <Text style={{ fontFamily: font.mono, fontSize: 11.5, color: t.dim, marginTop: 2 }}>
                    {m.date} · {m.done ? '已完成' : isCurrent ? '進行中' : '未開始'}
                  </Text>
                </View>
              </View>
            );
          })}
        </Card>

        {p.unread > 0 && (
          <Card t={t} style={[{ backgroundColor: t.accentSoft }, shadow(1)]}>
            <Text style={{ fontFamily: font.family, fontSize: 14.5, fontWeight: '700', color: t.ink }}>
              有 {p.unread} 份設計稿等你確認
            </Text>
            <Text style={{ fontFamily: font.family, fontSize: 12.5, color: t.dim, marginTop: 5, lineHeight: 20 }}>
              在稿子上直接點一下就能留下意見，我們會收到通知。
            </Text>
            <Button
              t={t}
              label="開始審稿"
              onPress={() => router.push('/studio/review')}
              style={{ marginTop: space.lg }}
            />
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

/** 進度環：用兩層 View 疊出來，不引入圖表庫 */
function Ring({ value }: { value: number }) {
  const size = 132;
  const stroke = 11;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          position: 'absolute', width: size, height: size, borderRadius: size / 2,
          borderWidth: stroke, borderColor: 'rgba(16,24,40,.07)',
        }}
      />
      {/* 用 conic-gradient 畫弧線，比手刻 SVG path 少很多程式碼 */}
      <View
        style={[
          {
            position: 'absolute', width: size, height: size, borderRadius: size / 2,
          },
          {
            backgroundImage: `conic-gradient(${t.accent} ${value * 3.6}deg, transparent 0deg)`,
            WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${stroke}px), #000 calc(100% - ${stroke}px))`,
            mask: `radial-gradient(farthest-side, transparent calc(100% - ${stroke}px), #000 calc(100% - ${stroke}px))`,
          } as any,
        ]}
      />
      <Text
        style={{
          fontFamily: font.mono, fontSize: 32, fontWeight: '700',
          color: t.ink, letterSpacing: -1.4,
        }}
      >
        {value}
        <Text style={{ fontSize: 16, color: t.dim }}>%</Text>
      </Text>
    </View>
  );
}
