/** 霧谷咖啡 —— 商品列表：分類篩選 + FlatList */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { BEANS, Bean } from '../../src/data';
import { apps, font, nt, radius, shadow, space } from '../../src/theme';
import { useCart } from '../../src/cart';
import { Chip, Header, HomeButton, StatusBar } from '../../src/ui';
import { BeanArt } from '../../src/BeanArt';

const t = apps.shop;
const FILTERS = ['全部', '淺焙', '中焙', '深焙'] as const;

export default function ShopList() {
  const router = useRouter();
  const cart = useCart();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('全部');

  const data = useMemo(
    () => (filter === '全部' ? BEANS : BEANS.filter((b) => b.roast === filter)),
    [filter],
  );

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar t={t} />
      <Header
        t={t}
        title="霧谷咖啡"
        sub={`${data.length} 支單品 · 當日現烘`}
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <HomeButton t={t} />
            <CartBadge count={cart.count} onPress={() => router.push('/shop/cart')} />
          </View>
        }
      />

      <View style={{ paddingHorizontal: space.lg, paddingBottom: space.md }}>
        <FlatList
          horizontal
          data={FILTERS as unknown as string[]}
          keyExtractor={(f) => f}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: space.sm }}
          renderItem={({ item }) => (
            <Chip t={t} label={item} active={filter === item} onPress={() => setFilter(item as any)} />
          )}
        />
      </View>

      <FlatList
        data={data}
        keyExtractor={(b) => b.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: space.xxl, gap: space.md }}
        renderItem={({ item }) => <BeanRow bean={item} onPress={() => router.push(`/shop/${item.id}`)} />}
        ListEmptyComponent={
          <Text style={{ fontFamily: font.family, color: t.dim, textAlign: 'center', marginTop: space.xxl }}>
            這個烘焙度目前沒有商品
          </Text>
        }
      />
    </View>
  );
}

function BeanRow({ bean, onPress }: { bean: Bean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${bean.name}，${nt(bean.price)}`}
      style={({ pressed }) => [
        {
          backgroundColor: t.surface, borderRadius: radius.lg, padding: space.md,
          flexDirection: 'row', gap: space.md, alignItems: 'center',
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        shadow(1),
      ]}
    >
      <BeanArt hue={bean.hue} size={78} />

      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text
            numberOfLines={1}
            style={{ fontFamily: font.family, fontSize: font.size.md, fontWeight: '800', color: t.ink, flexShrink: 1 }}
          >
            {bean.name}
          </Text>
          {bean.stock <= 12 && (
            <Text
              style={{
                fontFamily: font.family, fontSize: 10, fontWeight: '700', color: '#B4471F',
                backgroundColor: '#FCE9DF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
              }}
            >
              剩 {bean.stock}
            </Text>
          )}
        </View>
        <Text numberOfLines={1} style={{ fontFamily: font.family, fontSize: 12, color: t.dim, marginTop: 1 }}>
          {bean.origin} · {bean.roast}
        </Text>
        <View style={{ flexDirection: 'row', gap: 5, marginTop: 7, flexWrap: 'wrap' }}>
          {bean.notes.slice(0, 3).map((n) => (
            <Text
              key={n}
              style={{
                fontFamily: font.family, fontSize: 10.5, color: t.dim,
                backgroundColor: t.accentSoft, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5,
              }}
            >
              {n}
            </Text>
          ))}
        </View>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontFamily: font.mono, fontSize: font.size.md, fontWeight: '700', color: t.ink }}>
          {nt(bean.price)}
        </Text>
        <Text style={{ fontFamily: font.family, fontSize: 10.5, color: t.dim, marginTop: 2 }}>
          ★ {bean.rating}
        </Text>
      </View>
    </Pressable>
  );
}

function CartBadge({ count, onPress }: { count: number; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`購物車，${count} 件`}
      style={({ pressed }) => ({
        width: 40, height: 40, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center',
        backgroundColor: pressed ? t.accentSoft : 'transparent',
      })}
    >
      <Text style={{ fontSize: 19 }}>🛒</Text>
      {count > 0 && (
        <View
          style={{
            position: 'absolute', top: 2, right: 2, minWidth: 18, height: 18, borderRadius: 9,
            backgroundColor: t.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
          }}
        >
          <Text style={{ fontFamily: font.mono, fontSize: 10, fontWeight: '700', color: '#fff' }}>
            {count}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
