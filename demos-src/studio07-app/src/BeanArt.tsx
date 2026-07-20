/**
 * 咖啡豆插圖（SVG）
 * 沒有商品照，與其放灰色佔位圖，不如畫一個會隨品項換色的向量插圖 ——
 * 檔案小、任意縮放不糊，也讓「沒有照片」看起來是刻意的設計決定。
 */
import Svg, { Defs, Ellipse, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { View } from 'react-native';
import { radius } from './theme';

export function BeanArt({ hue, size = 78 }: { hue: string; size?: number }) {
  const id = 'g' + hue.replace('#', '');
  return (
    <View
      style={{
        width: size, height: size, borderRadius: radius.md, overflow: 'hidden',
        alignItems: 'center', justifyContent: 'center', backgroundColor: hue + '1F',
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={hue} stopOpacity="0.16" />
            <Stop offset="100%" stopColor={hue} stopOpacity="0.03" />
          </LinearGradient>
        </Defs>
        <Rect width="100" height="100" fill={`url(#${id})`} />
        {/* 豆身 */}
        <Ellipse cx="50" cy="50" rx="26" ry="34" fill={hue} transform="rotate(-24 50 50)" />
        {/* 中央那道溝 */}
        <Path
          d="M50 20 C 40 34, 40 66, 50 80"
          stroke="rgba(255,255,255,.55)"
          strokeWidth="3.4"
          strokeLinecap="round"
          fill="none"
          transform="rotate(-24 50 50)"
        />
        {/* 高光 */}
        <Ellipse cx="40" cy="36" rx="7" ry="10" fill="rgba(255,255,255,.22)" transform="rotate(-24 50 50)" />
      </Svg>
    </View>
  );
}
