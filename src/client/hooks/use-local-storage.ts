import { useState, useEffect, useCallback } from "react";

const QUOTA_WARNING_THRESHOLD = 4.5 * 1024 * 1024; // 4.5MB warning

function getStorageUsage(): number {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      total += key.length + (localStorage.getItem(key)?.length || 0);
    }
  }
  return total * 2; // UTF-16
}

function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validate?: (value: unknown) => value is T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return initialValue;
      if (!isValidJSON(item)) {
        localStorage.removeItem(key);
        return initialValue;
      }
      const parsed = JSON.parse(item);
      if (validate && !validate(parsed)) {
        localStorage.removeItem(key);
        return initialValue;
      }
      return parsed;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        try {
          const serialized = JSON.stringify(nextValue);
          if (getStorageUsage() + serialized.length * 2 > QUOTA_WARNING_THRESHOLD) {
            console.warn(`[useLocalStorage] Storage nearing quota for key "${key}"`);
          }
          localStorage.setItem(key, serialized);
        } catch (e) {
          console.error(`[useLocalStorage] Failed to save key "${key}":`, e);
        }
        return nextValue;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    localStorage.removeItem(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          const newVal = e.newValue ? JSON.parse(e.newValue) : initialValue;
          setStoredValue(newVal);
        } catch {
          setStoredValue(initialValue);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
