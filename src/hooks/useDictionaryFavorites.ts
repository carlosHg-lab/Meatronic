import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@maetronic/dictionaryFavorites';

export function useDictionaryFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const hasInteracted = useRef(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_KEY);
        if (!active || !stored || hasInteracted.current) return;
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(
            new Set(
              parsed.filter(
                (value): value is string => typeof value === 'string'
              )
            )
          );
        }
      } catch (error) {
        console.error('No se pudieron cargar los favoritos:', error);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const toggleFavorite = useCallback((key: string) => {
    hasInteracted.current = true;
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(next))).catch(
        (error) => {
          console.error('No se pudieron guardar los favoritos:', error);
        }
      );
      return next;
    });
  }, []);

  return { favorites, toggleFavorite };
}
