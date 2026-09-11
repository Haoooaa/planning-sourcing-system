import { useSyncExternalStore } from 'react';
import { getStore, subscribe } from './store';

export function useDemoStore() {
  return useSyncExternalStore(subscribe, getStore, getStore);
}
