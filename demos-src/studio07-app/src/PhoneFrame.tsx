/**
 * 手機外框
 *
 * 這個 App 會被放在作品集網站上，多數人用桌機看。全螢幕攤開的手機介面
 * 在 27 吋螢幕上看起來像壞掉的網頁，所以寬螢幕時把它塞進一支手機裡；
 * 真的用手機看的時候（<= 820px）就整個攤開，不要有多餘的框。
 */
import { ReactNode, useEffect, useState } from 'react';
import { Platform, Text, useWindowDimensions, View } from 'react-native';
import { font, space } from './theme';

const PHONE_W = 390;
const PHONE_H = 844;

export function PhoneFrame({ children }: { children: ReactNode }) {
  const { width, height } = useWindowDimensions();

  // 靜態匯出時沒有 window，伺服器產生的 HTML 一律是「沒有外框」的版本。
  // 若第一次在瀏覽器渲染就直接套外框，兩邊結構不同會觸發 hydration 失敗
  // （React #418）。所以先渲染成和伺服器一樣，掛載完成後再切換。
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const framed = mounted && Platform.OS === 'web' && width > 820;

  if (!framed) return <View style={{ flex: 1 }}>{children}</View>;

  // 視窗不夠高時等比例縮小，不要讓手機被切掉
  const scale = Math.min(1, (height - 80) / PHONE_H);

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: '#0B0F16',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 56,
          padding: space.xl,
        },
        // 背景網格與暈染：RN 型別沒有 backgroundImage，但 web 上有效
        {
          backgroundImage:
            'radial-gradient(circle at 50% 0%, rgba(59,130,246,.14), transparent 62%),' +
            'linear-gradient(#141b27 1px, transparent 1px),' +
            'linear-gradient(90deg, #141b27 1px, transparent 1px)',
          backgroundSize: 'auto, 54px 54px, 54px 54px',
        } as any,
      ]}
    >
      {width > 1180 && <SideNote />}

      <View
        style={{
          width: PHONE_W,
          height: PHONE_H,
          transform: `scale(${scale})`,
          transformOrigin: 'center',
        }}
      >
        {/* 機身 */}
        <View
          style={{
            flex: 1,
            borderRadius: 54,
            padding: 11,
            backgroundColor: '#1B2230',
            boxShadow:
              '0 0 0 1.5px #2C3648, 0 40px 80px -24px rgba(0,0,0,.85), inset 0 0 0 1px rgba(255,255,255,.05)',
          }}
        >
          {/* 螢幕 */}
          <View
            style={{
              flex: 1,
              borderRadius: 44,
              overflow: 'hidden',
              backgroundColor: '#fff',
              position: 'relative',
            }}
          >
            {children}

            {/* 瀏海 */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute', top: 9, left: '50%', width: 116, height: 30,
                marginLeft: -58, borderRadius: 999, backgroundColor: '#0B0F16', zIndex: 90,
              }}
            />
            {/* 底部 home indicator */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute', bottom: 7, left: '50%', width: 128, height: 4.5,
                marginLeft: -64, borderRadius: 999, backgroundColor: 'rgba(0,0,0,.28)', zIndex: 90,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function SideNote() {
  return (
    <View style={{ maxWidth: 340, gap: space.lg }}>
      <Text
        style={{
          fontFamily: font.mono, fontSize: 11, letterSpacing: 2.6,
          textTransform: 'uppercase', color: '#3B82F6',
        }}
      >
        React Native · Expo
      </Text>
      <Text
        style={{
          fontFamily: font.family, fontSize: 40, lineHeight: 44, fontWeight: '900',
          color: '#EDF1F7', letterSpacing: -1.6,
        }}
      >
        4 個 App{'\n'}
        <Text style={{ fontWeight: '300', color: '#7D879B' }}>同一套程式碼</Text>
      </Text>
      <Text style={{ fontFamily: font.family, fontSize: 14.5, lineHeight: 25, color: '#7D879B' }}>
        右邊這支手機裡跑的不是網頁模擬，是真的 React Native ——
        同一份原始碼可以直接編譯成 iOS 與 Android App，這裡透過
        react-native-web 匯出成靜態網頁讓你直接操作。
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.xs }}>
        {['Expo Router', 'react-native-web', 'AsyncStorage', 'Animated', 'SVG'].map((t) => (
          <Text
            key={t}
            style={{
              fontFamily: font.mono, fontSize: 10.5, letterSpacing: 1, color: '#7D879B',
              borderWidth: 1, borderColor: '#212B3B', borderRadius: 999,
              paddingVertical: 7, paddingHorizontal: 13,
            }}
          >
            {t}
          </Text>
        ))}
      </View>
      <Text style={{ fontFamily: font.family, fontSize: 12.5, color: '#5B6577', marginTop: space.sm }}>
        用手機開這個網址，外框會自動收起來變成全螢幕。
      </Text>
    </View>
  );
}
