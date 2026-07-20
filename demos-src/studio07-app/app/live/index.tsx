/** 追蹤中 —— 訂單狀態機 + 外送動畫（深色介面） */
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Circle, Defs, Path, Stop, LinearGradient as SvgGradient } from 'react-native-svg';
import { COURIER, LIVE_STAGES } from '../../src/data';
import { apps, font, radius, space } from '../../src/theme';
import { Header, HomeButton, Label, StatusBar } from '../../src/ui';

const t = apps.live;
const STEP_MS = 4200;

export default function Live() {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [running, setRunning] = useState(true);

  // 進度條與外送車的位置共用同一個動畫值
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  // 狀態機：每 STEP_MS 前進一階，到最後一階停下
  useEffect(() => {
    if (!running || stage >= LIVE_STAGES.length - 1) return;
    const id = setTimeout(() => setStage((s) => s + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [stage, running]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: stage / (LIVE_STAGES.length - 1),
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [stage, progress]);

  // 「進行中」的呼吸燈
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1100, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1100, easing: Easing.in(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const done = stage >= LIVE_STAGES.length - 1;
  const current = LIVE_STAGES[stage];

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar t={t} />
      <Header
        t={t}
        title="訂單追蹤"
        sub="WG-26071901 · 霧谷咖啡"
        onBack={() => router.back()}
        right={<HomeButton t={t} />}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: space.xxl, gap: space.md }}
      >
        {/* 路線圖 */}
        <View
          style={{
            height: 190, borderRadius: radius.lg, backgroundColor: t.surface,
            borderWidth: 1, borderColor: '#252B36', overflow: 'hidden', justifyContent: 'center',
          }}
        >
          <RouteMap progress={progress} />
        </View>

        {/* 目前狀態 */}
        <View
          style={{
            backgroundColor: t.surface, borderRadius: radius.lg, padding: space.lg,
            borderWidth: 1, borderColor: '#252B36',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
            <View style={{ width: 46, height: 46, alignItems: 'center', justifyContent: 'center' }}>
              {!done && (
                <Animated.View
                  style={{
                    position: 'absolute', width: 46, height: 46, borderRadius: 23,
                    backgroundColor: t.accent,
                    opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0] }),
                    transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.5] }) }],
                  }}
                />
              )}
              <View
                style={{
                  width: 40, height: 40, borderRadius: 20,
                  backgroundColor: done ? '#22C55E' : t.accent,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 18 }}>{current.icon}</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: font.family, fontSize: 17, fontWeight: '800', color: t.ink }}>
                {current.label}
              </Text>
              <Text style={{ fontFamily: font.family, fontSize: 12.5, color: t.dim, marginTop: 2 }}>
                {current.detail}
              </Text>
            </View>
          </View>

          {!done && (
            <Text style={{ fontFamily: font.mono, fontSize: 11.5, color: t.accent, marginTop: space.lg }}>
              預計 {Math.max(1, (LIVE_STAGES.length - 1 - stage) * 4)} 分鐘後送達
            </Text>
          )}
        </View>

        {/* 階段清單 */}
        <View
          style={{
            backgroundColor: t.surface, borderRadius: radius.lg, padding: space.lg,
            borderWidth: 1, borderColor: '#252B36',
          }}
        >
          <Label t={t} style={{ marginBottom: space.lg }}>訂單歷程</Label>
          {LIVE_STAGES.map((s, i) => {
            const past = i < stage;
            const now = i === stage;
            return (
              <View key={s.key} style={{ flexDirection: 'row', gap: space.md }}>
                <View style={{ alignItems: 'center', width: 16 }}>
                  <View
                    style={{
                      width: 11, height: 11, borderRadius: 6, marginTop: 4,
                      backgroundColor: past || now ? t.accent : '#2B323D',
                    }}
                  />
                  {i < LIVE_STAGES.length - 1 && (
                    <View style={{ width: 2, flex: 1, minHeight: 26, backgroundColor: past ? t.accent : '#2B323D' }} />
                  )}
                </View>
                <View style={{ flex: 1, paddingBottom: i < LIVE_STAGES.length - 1 ? space.lg : 0 }}>
                  <Text
                    style={{
                      fontFamily: font.family, fontSize: 14,
                      fontWeight: now ? '800' : '500',
                      color: past || now ? t.ink : t.dim,
                    }}
                  >
                    {s.label}
                  </Text>
                  {(past || now) && (
                    <Text style={{ fontFamily: font.family, fontSize: 11.5, color: t.dim, marginTop: 2 }}>
                      {s.detail}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* 外送夥伴 */}
        {stage >= 3 && (
          <View
            style={{
              backgroundColor: t.surface, borderRadius: radius.lg, padding: space.lg,
              borderWidth: 1, borderColor: '#252B36',
              flexDirection: 'row', alignItems: 'center', gap: space.md,
            }}
          >
            <View
              style={{
                width: 46, height: 46, borderRadius: 23, backgroundColor: '#2B323D',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 20 }}>🛵</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: font.family, fontSize: 14.5, fontWeight: '700', color: t.ink }}>
                {COURIER.name}
              </Text>
              <Text style={{ fontFamily: font.mono, fontSize: 11.5, color: t.dim, marginTop: 2 }}>
                {COURIER.plate} · ★ {COURIER.rating} · {COURIER.trips} 趟
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="聯絡外送夥伴"
              style={({ pressed }) => ({
                width: 42, height: 42, borderRadius: 21, backgroundColor: t.accent,
                alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ fontSize: 17 }}>📞</Text>
            </Pressable>
          </View>
        )}

        {/* 這是模擬，說清楚比較誠實 */}
        <Pressable
          onPress={() => { setStage(0); setRunning(true); }}
          accessibilityRole="button"
          style={({ pressed }) => ({
            borderRadius: radius.md, borderWidth: 1.5, borderColor: '#2B323D',
            paddingVertical: 14, alignItems: 'center', opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ fontFamily: font.family, fontSize: 13.5, fontWeight: '600', color: t.dim }}>
            {done ? '再播一次' : '重新開始'}
          </Text>
        </Pressable>

        <Text style={{ fontFamily: font.family, fontSize: 11, color: '#5E6775', textAlign: 'center', lineHeight: 18 }}>
          狀態每 {STEP_MS / 1000} 秒自動前進一階，模擬伺服器推送。
        </Text>
      </ScrollView>
    </View>
  );
}

/** 路線圖：一條曲線 + 沿線移動的外送圖示 */
function RouteMap({ progress }: { progress: Animated.Value }) {
  const W = 330, H = 190;
  // 曲線的取樣點，用來讓圖示沿路徑移動
  const pts = Array.from({ length: 41 }, (_, i) => {
    const p = i / 40;
    const x = 26 + p * (W - 60);
    const y = 132 - Math.sin(p * Math.PI) * 66;
    return { x, y };
  });

  return (
    <View style={{ flex: 1 }}>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <SvgGradient id="route" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor={t.accent} stopOpacity="0.25" />
            <Stop offset="100%" stopColor={t.accent} stopOpacity="1" />
          </SvgGradient>
        </Defs>
        {/* 底層街廓 */}
        {[36, 74, 112, 150].map((y) => (
          <Path key={y} d={`M0 ${y} H${W}`} stroke="#232A35" strokeWidth="1" />
        ))}
        {[60, 130, 200, 270].map((x) => (
          <Path key={x} d={`M${x} 0 V${H}`} stroke="#232A35" strokeWidth="1" />
        ))}
        {/* 路線 */}
        <Path
          d={pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')}
          stroke="url(#route)" strokeWidth="3.5" fill="none" strokeLinecap="round"
          strokeDasharray="7 7"
        />
        {/* 起點：咖啡店 */}
        <Circle cx={pts[0].x} cy={pts[0].y} r="8" fill="#8B5E3C" stroke="#0F1115" strokeWidth="2.5" />
        {/* 終點：家 */}
        <Circle cx={pts[40].x} cy={pts[40].y} r="8" fill="#22C55E" stroke="#0F1115" strokeWidth="2.5" />
      </Svg>

      {/* 沿路徑移動的外送圖示 */}
      <Animated.View
        style={{
          position: 'absolute',
          left: progress.interpolate({
            inputRange: pts.map((_, i) => i / 40),
            outputRange: pts.map((p) => (p.x / W) * 100 + '%') as any,
          }),
          top: progress.interpolate({
            inputRange: pts.map((_, i) => i / 40),
            outputRange: pts.map((p) => p.y - 16),
          }),
          marginLeft: -16,
          width: 32, height: 32, borderRadius: 16,
          backgroundColor: t.accent, alignItems: 'center', justifyContent: 'center',
          borderWidth: 2.5, borderColor: '#0F1115',
        }}
      >
        <Text style={{ fontSize: 15 }}>🛵</Text>
      </Animated.View>
    </View>
  );
}
