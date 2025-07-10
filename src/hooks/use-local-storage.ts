
'use client';

import { useState, useEffect, useCallback } from 'react';

// A custom event name to handle changes within the same tab
const LOCAL_STORAGE_CHANGE_EVENT = 'onLocalStorageChange';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // This useEffect runs once on mount on the client-side to read from localStorage
  useEffect(() => {
    // Prevent build errors during server-side rendering
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? (JSON.parse(item) as T) : initialValue);
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);


  const setValue: SetValue<T> = useCallback(
    (value) => {
      // Prevent build errors during server-side rendering
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting localStorage key “${key}” even though environment is not a client`
        );
        return;
      }

      try {
        const newValue = value instanceof Function ? value(storedValue) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);
        window.dispatchEvent(new Event(LOCAL_STORAGE_CHANGE_EVENT));
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [key, storedValue]
  );

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.storageArea === window.localStorage && e.key === key) {
        try {
            setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch (error) {
            console.warn(`Error parsing storage change for key “${key}”:`, error);
            setStoredValue(initialValue);
        }
      }
    };
    
    const handleInTabChange = () => {
        try {
            const item = window.localStorage.getItem(key);
            setStoredValue(item ? JSON.parse(item) : initialValue);
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error);
            setStoredValue(initialValue);
        }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleInTabChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleInTabChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
}

export { useLocalStorage };
