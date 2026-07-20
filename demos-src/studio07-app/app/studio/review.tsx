/** 審稿：在設計稿上點一下留下標註 */
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  GestureResponderEvent, Pressable, ScrollView, Text, TextInput, View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Pin, REVIEW_PINS } from '../../src/data';
import { apps, font, radius, shadow, space } from '../../src/theme';
import { Button, Card, Header, Label, StatusBar } from '../../src/ui';

const t = apps.studio;
const ART_H = 300;

export default function Review() {
  const router = useRouter();
  const [pins, setPins] = useState<Pin[]>(REVIEW_PINS);
  const [draft, setDraft] = useState<{ x: number; y: number } | null>(null);
  const [text, setText] = useState('');
  const [artW, setArtW] = useState(0);
  const artRef = useRef<View>(null);

  /**
   * 把點擊位置換算成 0–1 的相對座標。
   *
   * 不要用 nativeEvent.locationX/locationY —— 在 react-native-web 上這兩個值
   * 常常是 0，標註會全部擠在左上角（實測點 (0.70,0.65) 會變成 (0.04,0.04)）。
   * 改用 pageX/pageY 減去元件在視窗中的位置，web 與原生的行為才一致。
   */
  const onArtPress = (e: GestureResponderEvent) => {
    const { pageX, pageY } = e.nativeEvent;
    artRef.current?.measureInWindow((wx, wy, w, h) => {
      if (!w || !h) return;
      const clamp = (v: number) => Math.min(0.97, Math.max(0.03, v));
      setDraft({ x: clamp((pageX - wx) / w), y: clamp((pageY - wy) / h) });
    });
  };

  const addPin = () => {
    if (!draft || !text.trim()) return;
    setPins((p) => [
      ...p,
      { id: 'k' + Date.now(), x: draft.x, y: draft.y, by: '你', text: text.trim(), resolved: false },
    ]);
    setDraft(null);
    setText('');
  };

  const toggle = (id: string) =>
    setPins((p) => p.map((k) => (k.id === id ? { ...k, resolved: !k.resolved } : k)));

  const open = pins.filter((p) => !p.resolved).length;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar t={t} />
      <Header
        t={t}
        title="審稿"
        sub={`霧谷咖啡 品牌識別 v3 · ${open} 則待處理`}
        onBack={() => router.back()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: space.xxl, gap: space.md }}
      >
        <Text style={{ fontFamily: font.family, fontSize: 12.5, color: t.dim, lineHeight: 20 }}>
          在稿子上點一下就能留下意見。點既有的標註可以標記為已處理。
        </Text>

        {/* 設計稿 + 標註層 */}
        <View
          onLayout={(e) => setArtW(e.nativeEvent.layout.width)}
          style={[{ borderRadius: radius.lg, overflow: 'hidden' }, shadow(2)]}
        >
          <Pressable
            ref={artRef}
            onPress={onArtPress}
            accessibilityLabel="設計稿，點擊以新增標註"
            style={{ height: ART_H, backgroundColor: '#F3EFE9' }}
          >
            <Artwork />
          </Pressable>

          {pins.map((p, i) => (
            <PinDot
              key={p.id}
              n={i + 1}
              pin={p}
              left={p.x * artW}
              top={p.y * ART_H}
              onPress={() => toggle(p.id)}
            />
          ))}

          {draft && (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute', left: draft.x * artW - 13, top: draft.y * ART_H - 13,
                width: 26, height: 26, borderRadius: 13, borderWidth: 2.5, borderColor: '#F59E0B',
                backgroundColor: 'rgba(245,158,11,.28)',
              }}
            />
          )}
        </View>

        {draft && (
          <Card t={t} style={shadow(1)}>
            <Label t={t}>新增標註</Label>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="這裡想說什麼？"
              placeholderTextColor="rgba(107,118,136,.6)"
              multiline
              autoFocus
              accessibilityLabel="標註內容"
              style={[
                {
                  marginTop: space.md, minHeight: 68, borderRadius: radius.md,
                  borderWidth: 1.5, borderColor: 'rgba(16,24,40,.12)',
                  padding: space.md, fontFamily: font.family, fontSize: 14,
                  color: t.ink, textAlignVertical: 'top',
                },
                { outlineStyle: 'none' } as any,
              ]}
            />
            <View style={{ flexDirection: 'row', gap: space.sm, marginTop: space.md }}>
              <Button
                t={t}
                label="取消"
                variant="soft"
                onPress={() => { setDraft(null); setText(''); }}
                style={{ flex: 1 }}
              />
              <Button t={t} label="送出" onPress={addPin} disabled={!text.trim()} style={{ flex: 1.4 }} />
            </View>
          </Card>
        )}

        <Label t={t} style={{ marginTop: space.sm }}>意見 {pins.length} 則</Label>

        {pins.map((p, i) => (
          <Card key={p.id} t={t} onPress={() => toggle(p.id)} style={shadow(1)}>
            <View style={{ flexDirection: 'row', gap: space.md, alignItems: 'flex-start' }}>
              <View
                style={{
                  width: 24, height: 24, borderRadius: 12,
                  backgroundColor: p.resolved ? '#22C55E' : t.accent,
                  alignItems: 'center', justifyContent: 'center', marginTop: 1,
                }}
              >
                <Text style={{ fontFamily: font.mono, fontSize: 11, fontWeight: '700', color: '#fff' }}>
                  {p.resolved ? '✓' : i + 1}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: font.family, fontSize: 13.5, lineHeight: 21,
                    color: p.resolved ? t.dim : t.ink,
                    textDecorationLine: p.resolved ? 'line-through' : 'none',
                  }}
                >
                  {p.text}
                </Text>
                <Text style={{ fontFamily: font.family, fontSize: 11, color: t.dim, marginTop: 5 }}>
                  {p.by} · {p.resolved ? '已處理' : '待處理'}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

function PinDot({
  n, pin, left, top, onPress,
}: {
  n: number; pin: Pin; left: number; top: number; onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`標註 ${n}：${pin.text}`}
      style={{
        position: 'absolute', left: left - 14, top: top - 14,
        width: 28, height: 28, borderRadius: 14,
        backgroundColor: pin.resolved ? '#22C55E' : t.accent,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2.5, borderColor: '#fff',
      }}
    >
      <Text style={{ fontFamily: font.mono, fontSize: 11.5, fontWeight: '700', color: '#fff' }}>
        {pin.resolved ? '✓' : n}
      </Text>
    </Pressable>
  );
}

/** 假的設計稿：霧谷咖啡的品牌識別提案 */
function Artwork() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 340 300">
      <Rect width="340" height="300" fill="#F3EFE9" />
      {/* 山谷與霧的標誌 */}
      <Circle cx="170" cy="112" r="52" fill="none" stroke="#8B5E3C" strokeWidth="3" />
      <Path d="M132 132 L156 96 L172 118 L190 82 L212 132 Z" fill="#8B5E3C" />
      <Path d="M126 140 H214" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round" />
      <Path d="M138 150 H202" stroke="#C4A88F" strokeWidth="3" strokeLinecap="round" />
      {/* 字標 */}
      <Rect x="112" y="192" width="116" height="13" rx="2" fill="#241A14" />
      <Rect x="134" y="216" width="72" height="7" rx="2" fill="#B7A695" />
      {/* 色票 */}
      <Rect x="112" y="248" width="26" height="26" rx="5" fill="#8B5E3C" />
      <Rect x="145" y="248" width="26" height="26" rx="5" fill="#C4A88F" />
      <Rect x="178" y="248" width="26" height="26" rx="5" fill="#F3EAE1" />
      <Rect x="211" y="248" width="26" height="26" rx="5" fill="#241A14" />
    </Svg>
  );
}
