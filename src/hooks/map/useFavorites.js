import { useState, useCallback } from 'react';
import { LS_KEYS } from '../../utils/mapConstants';

/**
 * 지도 즐겨찾기 관리 훅 (localStorage 기반)
 */
export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEYS.FAVORITES) || '[]');
    } catch {
      return [];
    }
  });

  const saveFavorites = useCallback((next) => {
    setFavorites(next);
    localStorage.setItem(LS_KEYS.FAVORITES, JSON.stringify(next));
  }, []);

  const isFavorite = useCallback((placeId) => {
    return favorites.some(f => f.id === placeId);
  }, [favorites]);

  const addFavorite = useCallback((place) => {
    if (isFavorite(place.id)) return;
    const item = {
      id: place.id,
      place_name: place.place_name,
      address_name: place.address_name,
      phone: place.phone,
      x: place.x,
      y: place.y,
      category_name: place.category_name,
      place_url: place.place_url,
    };
    saveFavorites([item, ...favorites]);
  }, [favorites, isFavorite, saveFavorites]);

  const removeFavorite = useCallback((placeId) => {
    saveFavorites(favorites.filter(f => f.id !== placeId));
  }, [favorites, saveFavorites]);

  const toggleFavorite = useCallback((place) => {
    if (isFavorite(place.id)) {
      removeFavorite(place.id);
    } else {
      addFavorite(place);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite };
}
