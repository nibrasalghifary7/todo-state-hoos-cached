'use client';

import { useSyncExternalStore, useCallback} from 'react';

function subscibe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('localStorageChange', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('localStorageChange', callback);
  };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
    const getSnapshot = String => {
        try { 
            const item = window.localStorage.getItem(key);
            return item !== null ? item : JSON.stringify(initialValue);
        } catch {
            return JSON.stringify(initialValue);
        }
    };

    const getServerSnapshot = (): string => {
        return JSON.stringify(initialValue);
    };

    //mengambil state dari external store (localStorage) secara tersinkronasi
    const rawValue = useSyncExternalStore(subscibe, getSnapshot, getServerSnapshot);
    const storedValue: T = JSON.parse(rawValue);


    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            try {
                const item = window.localStorage.getItem(key);
                const current: T = item !== null ? JSON.parse(item) : initialValue;
                const nextValue = value instanceof Function ? value(current) : value;

                window.localStorage.setItem(key, JSON.stringify(nextValue));
                // memicu event agar useSyncExternalStore mengetahui perubahan pada localStorage
                window.dispatchEvent(new Event('local-storage-update'));
            } catch (error) {
                console.warn('Gagal menyimpan ke localStorage untuk key "${key}":', error);
            }
        },
        [key, initialValue]
    );

    return [storedValue, setValue] as const;
}