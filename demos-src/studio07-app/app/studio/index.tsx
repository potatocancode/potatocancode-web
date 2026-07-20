/** STUDIO 07 客戶端 —— 專案列表 */
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { PROJECTS, Project } from '../../src/data';
import { apps, font, radius, shadow, space } from '../../src/theme';
import { Card, Header, HomeButton, Label, StatusBar } from '../../src/ui';

const t = apps.studio;

const STATUS_COLOR: Record<Project['status'], string> = {
  進行中: '#2563EB',
  待回饋: '#F59E0B',
  已完成: '#22C55E',
};

export default function StudioList() {
  const router = useRouter();
  const needsYou = PROJECTS.filter((p) => p.unread > 0).length;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar t={t} />
      <Header t={t} title="我的專案" sub="霧谷咖啡 · 陳品瑜" right={<HomeButton t={t} />} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: space.xxl, gap: space.md }}
      >
        {needsYou > 0 && (
          <View
            style={{
              backgroundColor: '#FEF6E7', borderRadius: radius.md, padding: space.lg,
              flexDirection: 'row', alignItems: 'center', gap: space.md,
            }}
          >
            <Text style={{ fontSize: 20 }}>👋</Text>
            <Text style={{ flex: 1, fontFamily: font.family, fontSize: 13, color: '#8A5A08', lineHeight: 20 }}>
              有 <Text style={{ fontWeight: '800' }}>{needsYou}</Text> 個專案在等你確認，
              點進去看設計稿並留下意見。
            </Text>
          </View>
        )}

        {PROJECTS.map((p) => (
          <Card key={p.id} t={t} onPress={() => router.push(`/studio/${p.id}`)} style={shadow(1)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: STATUS_COLOR[p.status] }} />
              <Label t={t}>{p.type}</Label>
              <View style={{ flex: 1 }} />
              {p.unread > 0 && (
                <View
                  style={{
                    minWidth: 19, height: 19, borderRadius: 10, backgroundColor: '#EF4444',
                    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5,
                  }}
                >
                  <Text style={{ fontFamily: font.mono, fontSize: 10, fontWeight: '700', color: '#fff' }}>
                    {p.unread}
                  </Text>
                </View>
              )}
            </View>

            <Text
              style={{
                fontFamily: font.family, fontSize: font.size.lg, fontWeight: '800',
                color: t.ink, marginTop: 7, letterSpacing: -0.4,
              }}
            >
              {p.name}
            </Text>
            <Text style={{ fontFamily: font.family, fontSize: 12.5, color: t.dim, marginTop: 2 }}>
              負責人 {p.owner} · 預計 {p.due}
            </Text>

            <View style={{ marginTop: space.lg, gap: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: font.family, fontSize: 11.5, color: t.dim }}>{p.status}</Text>
                <Text style={{ fontFamily: font.mono, fontSize: 11.5, fontWeight: '700', color: t.ink }}>
                  {p.progress}%
                </Text>
              </View>
              <View style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(16,24,40,.07)', overflow: 'hidden' }}>
                <View
                  style={{
                    height: '100%', width: `${p.progress}%`, borderRadius: 3,
                    backgroundColor: STATUS_COLOR[p.status],
                  }}
                />
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
