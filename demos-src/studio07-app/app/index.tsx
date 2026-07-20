/** App 總覽：四個 App 的入口 */
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { apps, font, radius, shadow, space } from '../src/theme';
import { StatusBar } from '../src/ui';

const HUB_T = {
  ...apps.studio,
  bg: '#0B0F16',
  surface: '#141A24',
  ink: '#EDF1F7',
  dim: '#8892A4',
} as any;

const LIST = [apps.shop, apps.studio, apps.ledger, apps.live];

export default function Hub() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: HUB_T.bg }}>
      <StatusBar t={HUB_T} />

      <ScrollView
        contentContainerStyle={{ padding: space.xl, paddingTop: space.md, paddingBottom: space.xxl }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontFamily: font.mono, fontSize: 10.5, letterSpacing: 2.4,
            textTransform: 'uppercase', color: '#3B82F6', marginBottom: space.md,
          }}
        >
          STUDIO 07 · App Suite
        </Text>
        <Text
          style={{
            fontFamily: font.family, fontSize: 34, lineHeight: 38, fontWeight: '900',
            color: HUB_T.ink, letterSpacing: -1.4,
          }}
        >
          四個 App
        </Text>
        <Text
          style={{
            fontFamily: font.family, fontSize: 34, lineHeight: 38, fontWeight: '300',
            color: HUB_T.dim, letterSpacing: -1.4, marginBottom: space.md,
          }}
        >
          一套程式碼
        </Text>
        <Text
          style={{
            fontFamily: font.family, fontSize: 14, lineHeight: 23,
            color: HUB_T.dim, marginBottom: space.xl,
          }}
        >
          每個 App 證明一種不同的能力。點進去都能真的操作 ——
          加購物車、標註設計稿、記帳、追蹤外送。
        </Text>

        <View style={{ gap: space.md }}>
          {LIST.map((a, i) => (
            <Pressable
              key={a.key}
              onPress={() => router.push(`/${a.key}` as any)}
              accessibilityRole="button"
              accessibilityLabel={`開啟 ${a.name}`}
              style={({ pressed }) => [
                {
                  backgroundColor: HUB_T.surface,
                  borderRadius: radius.lg,
                  padding: space.lg,
                  borderWidth: 1,
                  borderColor: pressed ? a.accent : '#222A36',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: space.lg,
                  transform: [{ scale: pressed ? 0.985 : 1 }],
                },
                shadow(1),
              ]}
            >
              {/* 色塊代表該 App 的識別色 */}
              <View
                style={{
                  width: 52, height: 52, borderRadius: radius.md,
                  backgroundColor: a.accent, alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text style={{ fontFamily: font.mono, fontSize: 17, fontWeight: '700', color: '#fff' }}>
                  0{i + 1}
                </Text>
              </View>

              <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                  style={{
                    fontFamily: font.family, fontSize: font.size.lg, fontWeight: '800',
                    color: HUB_T.ink, letterSpacing: -0.4,
                  }}
                >
                  {a.name}
                </Text>
                <Text style={{ fontFamily: font.family, fontSize: 12.5, color: HUB_T.dim, marginTop: 1 }}>
                  {a.sub} · {a.tagline}
                </Text>
                <Text
                  style={{
                    fontFamily: font.mono, fontSize: 10, color: a.accent,
                    marginTop: 7, letterSpacing: 0.3,
                  }}
                >
                  {a.proves}
                </Text>
              </View>

              <Text style={{ fontSize: 20, color: HUB_T.dim }}>›</Text>
            </Pressable>
          ))}
        </View>

        <Text
          style={{
            fontFamily: font.family, fontSize: 11.5, lineHeight: 19,
            color: '#5B6577', marginTop: space.xl, textAlign: 'center',
          }}
        >
          React Native + Expo Router{'\n'}
          透過 react-native-web 匯出為靜態網頁
        </Text>
      </ScrollView>
    </View>
  );
}
