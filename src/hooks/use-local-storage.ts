
'use client';

import { useState, useEffect, useCallback } from 'react';

// A custom event name to handle changes within the same tab
const LOCAL_STORAGE_CHANGE_EVENT = 'onLocalStorageChange';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  // Function to read value from localStorage
  const readValue = useCallback((): T => {
    // Prevent build errors during server-side rendering
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue: SetValue<T> = useCallback(
    value => {
      // Prevent build errors during server-side rendering
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting localStorage key “${key}” even though environment is not a client`
        );
      }

      try {
        // Allow value to be a function so we have same API as useState
        const newValue = value instanceof Function ? value(storedValue) : value;
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(newValue));
        // Save state
        setStoredValue(newValue);
        // We dispatch a custom event so every useLocalStorage hook are notified
        window.dispatchEvent(new Event(LOCAL_STORAGE_CHANGE_EVENT));
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [key, storedValue]
  );
  
  // Read latest value from localstorage when the hook is mounted
  useEffect(() => {
    setStoredValue(readValue());
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    // The 'storage' event only works for changes made in other tabs, not the current one.
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        setStoredValue(readValue());
      }
    };

    // We need a custom event to sync changes within the same tab.
    const handleLocalStorageChangeEvent = () => {
      setStoredValue(readValue());
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleLocalStorageChangeEvent);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleLocalStorageChangeEvent);
    };
  }, [key, readValue]);

  return [storedValue, setValue];
}

export { useLocalStorage };
