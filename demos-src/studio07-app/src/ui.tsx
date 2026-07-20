/** 四個 App 共用的小元件 */
import { ReactNode } from 'react';
import {
  Platform, Pressable, StyleProp, Text, TextStyle, View, ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AppTheme, font, radius, space } from './theme';

/** 狀態列（時間 / 訊號 / 電池）—— 手機介面沒有它就少了味道 */
export function StatusBar({ t, time = '9:41' }: { t: AppTheme; time?: string }) {
  const fg = 'dark' in t && t.dark ? t.ink : t.ink;
  return (
    <View
      style={{
        height: 52, paddingTop: 14, paddingHorizontal: 26,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      }}
    >
      <Text style={{ fontFamily: font.family, fontSize: 14, fontWeight: '700', color: fg }}>
        {time}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        {[4, 7, 10, 13].map((h, i) => (
          <View key={i} style={{ width: 3, height: h, borderRadius: 1, backgroundColor: fg }} />
        ))}
        <View
          style={{
            marginLeft: 5, width: 24, height: 12, borderRadius: 3.5,
            borderWidth: 1.4, borderColor: fg, padding: 1.6, justifyContent: 'center',
          }}
        >
          <View style={{ flex: 1, borderRadius: 1.5, backgroundColor: fg, width: '76%' }} />
        </View>
      </View>
    </View>
  );
}

/** 標題列，左邊可放返回 */
export function Header({
  t, title, sub, onBack, right,
}: {
  t: AppTheme; title: string; sub?: string; onBack?: () => void; right?: ReactNode;
}) {
  return (
    <View
      style={{
        paddingHorizontal: space.lg, paddingBottom: space.md,
        flexDirection: 'row', alignItems: 'center', gap: space.md,
      }}
    >
      {onBack && (
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="返回"
          style={({ pressed }) => ({
            width: 36, height: 36, borderRadius: radius.pill,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: pressed ? t.accentSoft : 'transparent',
          })}
        >
          <Text style={{ fontSize: 22, color: t.ink, lineHeight: 24 }}>‹</Text>
        </Pressable>
      )}
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: font.family, fontSize: font.size.xl, fontWeight: '800',
            color: t.ink, letterSpacing: -0.6,
          }}
        >
          {title}
        </Text>
        {!!sub && (
          <Text style={{ fontFamily: font.family, fontSize: font.size.sm, color: t.dim, marginTop: 1 }}>
            {sub}
          </Text>
        )}
      </View>
      {right}
    </View>
  );
}

/** 觸控回饋按鈕：min 44x44，符合觸控目標尺寸 */
export function Button({
  t, label, onPress, variant = 'solid', style, disabled,
}: {
  t: AppTheme; label: string; onPress?: () => void;
  variant?: 'solid' | 'soft' | 'ghost'; style?: StyleProp<ViewStyle>; disabled?: boolean;
}) {
  const bg = variant === 'solid' ? t.accent : variant === 'soft' ? t.accentSoft : 'transparent';
  const fg = variant === 'solid' ? '#fff' : t.accent;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        {
          minHeight: 48, paddingHorizontal: space.xl, borderRadius: radius.md,
          alignItems: 'center', justifyContent: 'center', backgroundColor: bg,
          opacity: disabled ? 0.4 : pressed ? 0.82 : 1,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
          borderWidth: variant === 'ghost' ? 1.5 : 0, borderColor: t.accent,
        },
        style,
      ]}
    >
      <Text style={{ fontFamily: font.family, fontSize: font.size.md, fontWeight: '700', color: fg }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Card({
  t, children, style, onPress,
}: {
  t: AppTheme; children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void;
}) {
  const inner = (
    <View
      style={[
        {
          backgroundColor: t.surface, borderRadius: radius.lg, padding: space.lg,
          borderWidth: Platform.OS === 'web' ? 1 : 0,
          borderColor: 'dark' in t && t.dark ? '#252B36' : 'rgba(16,24,40,.06)',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
  if (!onPress) return inner;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] })}
    >
      {inner}
    </Pressable>
  );
}

export function Chip({
  t, label, active, onPress,
}: {
  t: AppTheme; label: string; active?: boolean; onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      style={({ pressed }) => ({
        minHeight: 36, paddingHorizontal: space.lg, borderRadius: radius.pill,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: active ? t.accent : t.accentSoft,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text
        style={{
          fontFamily: font.family, fontSize: font.size.sm, fontWeight: '600',
          color: active ? '#fff' : t.accent,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** 回到四個 App 的總覽 */
export function HomeButton({ t }: { t: AppTheme }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.replace('/')}
      accessibilityRole="button"
      accessibilityLabel="回到 App 總覽"
      style={({ pressed }) => ({
        width: 36, height: 36, borderRadius: radius.pill,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: pressed ? t.accentSoft : 'transparent',
      })}
    >
      <Text style={{ fontSize: 17, color: t.dim }}>⌂</Text>
    </Pressable>
  );
}

export function Label({ t, children, style }: { t: AppTheme; children: ReactNode; style?: StyleProp<TextStyle> }) {
  return (
    <Text
      style={[
        {
          fontFamily: font.mono, fontSize: font.size.xs, letterSpacing: 1.4,
          textTransform: 'uppercase', color: t.dim,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
