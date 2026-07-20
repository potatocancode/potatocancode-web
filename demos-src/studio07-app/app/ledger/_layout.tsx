/**
 * 記帳的資料層
 * 用 AsyncStorage 持久化 —— 在原生是裝置儲存，在 web 會落到 localStorage。
 * 重新整理、關掉分頁再回來，資料都還在，這是這個 App 要證明的事。
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import {
  createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { CategoryKey, Entry, seedEntries } from '../../src/data';

const KEY = 'studio07.ledger.v1';

type Ctx = {
  entries: Entry[];
  ready: boolean;
  add: (amount: number, cat: CategoryKey, note: string) => void;
  remove: (id: string) => void;
  reset: () => void;
};

const LedgerContext = createContext<Ctx | null>(null);

function Provider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [ready, setReady] = useState(false);

  // 開啟時讀本機；沒有資料就寫入一份示範資料
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setEntries(JSON.parse(raw));
        else {
          const seed = seedEntries();
          setEntries(seed);
          await AsyncStorage.setItem(KEY, JSON.stringify(seed));
        }
      } catch {
        // 讀不到就用示範資料，不要讓整個畫面卡住
        setEntries(seedEntries());
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const persist = useCallback((next: Entry[]) => {
    setEntries(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      entries,
      ready,
      add: (amount, cat, note) =>
        persist([{ id: 'e' + Date.now(), amount, cat, note, ts: Date.now() }, ...entries]),
      remove: (id) => persist(entries.filter((e) => e.id !== id)),
      reset: () => persist(seedEntries()),
    }),
    [entries, ready, persist],
  );

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
}

export function useLedger() {
  const c = useContext(LedgerContext);
  if (!c) throw new Error('useLedger 必須在 LedgerProvider 之內使用');
  return c;
}

export default function LedgerLayout() {
  return (
    <Provider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </Provider>
  );
}
