import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeProvider';
import useFavorites from '../../hooks/map/useFavorites';
import {
  CATEGORIES,
  CATEGORY_EMOJI_MAP,
  DEFAULT_LOCATION,
  ZOOM_RADIUS_MAP,
  LS_KEYS,
  DUMMY_REVIEWS,
} from '../../utils/mapConstants';
import KakaoMapView from '../../components/map/KakaoMapView';

/**
 * 카카오맵 컨테이너 — 비즈니스 로직 + 훅 조합
 * View에 props 전달
 */
const KakaoMapContainer = () => {
  const { isDark } = useTheme();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const currentLocationMarkerRef = useRef(null);
  const markersRef = useRef([]);
  const customOverlaysRef = useRef([]);

  // --- 상태 ---
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return localStorage.getItem(LS_KEYS.LAST_CATEGORY) || CATEGORIES[0].keyword;
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [mapReady, setMapReady] = useState(false);
  const [showResearch, setShowResearch] = useState(false);

  // 즐겨찾기
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [showFavorites, setShowFavorites] = useState(false);

  // --- 리뷰 로드 ---
  useEffect(() => {
    if (selectedPlace) {
      setReviews(DUMMY_REVIEWS);
    }
  }, [selectedPlace]);

  // --- 카카오맵 스크립트 로드 ---
  useEffect(() => {
    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

    const scriptSrc = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API}&autoload=false&libraries=services,clusterer,drawing`;

    loadScript(scriptSrc)
      .then(() => {
        if (!window.kakao) return;
        window.kakao.maps.load(() => {
          initializeMap();
        });
      })
      .catch((error) => {
        console.error('Kakao Map script load error:', error);
      });

    return () => {
      clearMarkers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 맵 초기화 ---
  const initializeMap = useCallback(() => {
    getUserCurrentLocation();
    setCurrentLocation(DEFAULT_LOCATION);
    loadMap(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
  }, []);

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });

        if (mapRef.current) {
          const latlng = new window.kakao.maps.LatLng(latitude, longitude);
          mapRef.current.setCenter(latlng);
          updateCurrentLocationMarker(mapRef.current, latlng);
          fetchLocations(mapRef.current, latitude, longitude, selectedCategory);
        }
        setIsLoadingLocation(false);
      },
      () => {
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const loadMap = (lat, lng) => {
    const mapOption = {
      center: new window.kakao.maps.LatLng(lat, lng),
      level: 3,
      draggable: true,
      scrollwheel: true,
      disableDoubleClickZoom: false,
      zoomable: true,
    };

    const map = new window.kakao.maps.Map(mapContainerRef.current, mapOption);
    mapRef.current = map;
    setMapReady(true);

    // 줌 변경
    window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
      const center = map.getCenter();
      const newLat = center.getLat();
      const newLng = center.getLng();
      setCurrentLocation({ latitude: newLat, longitude: newLng });
      clearMarkers();
      fetchLocations(map, newLat, newLng, selectedCategory);
    });

    // 클릭
    window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
      const latlng = mouseEvent.latLng;
      if (selectedPlace) {
        setSelectedPlace(null);
      }
      setCurrentLocation({ latitude: latlng.getLat(), longitude: latlng.getLng() });
      updateCurrentLocationMarker(map, latlng);
      clearMarkers();
      fetchLocations(map, latlng.getLat(), latlng.getLng(), selectedCategory);
    });

    // 드래그 → "이 지역 재검색" 버튼 표시 (네이버맵 스타일)
    window.kakao.maps.event.addListener(map, 'dragend', () => {
      const center = map.getCenter();
      const newLat = center.getLat();
      const newLng = center.getLng();

      if (currentLocation) {
        const latDiff = Math.abs(currentLocation.latitude - newLat);
        const lngDiff = Math.abs(currentLocation.longitude - newLng);
        if (latDiff > 0.005 || lngDiff > 0.005) {
          setShowResearch(true);
        }
      }
      setCurrentLocation({ latitude: newLat, longitude: newLng });
    });

    // 현재 위치 마커
    const currentLatLng = new window.kakao.maps.LatLng(lat, lng);
    updateCurrentLocationMarker(map, currentLatLng);

    // 초기 검색
    fetchLocations(map, lat, lng, selectedCategory);
  };

  // --- 현재 위치 마커 ---
  const updateCurrentLocationMarker = (map, latlng) => {
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.setPosition(latlng);
      return;
    }
    const markerImage = new window.kakao.maps.MarkerImage(
      'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_blue.png',
      new window.kakao.maps.Size(24, 35)
    );
    const marker = new window.kakao.maps.Marker({
      map,
      position: latlng,
      image: markerImage,
    });
    currentLocationMarkerRef.current = marker;
  };

  // --- 마커 관리 ---
  const clearMarkers = () => {
    customOverlaysRef.current.forEach(o => o.setMap(null));
    customOverlaysRef.current = [];
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
  };

  const createCustomMarker = (map, place) => {
    // 중복 방지
    if (customOverlaysRef.current.some(o => o.placeId === place.id)) return;

    const emoji = CATEGORY_EMOJI_MAP[
      Object.keys(CATEGORY_EMOJI_MAP).find(k => place.category_name?.includes(k))
    ] || '📍';

    const rating = (Math.random() * 2 + 3).toFixed(1);

    const content = document.createElement('div');
    content.style.cssText = `
      cursor: pointer; display: flex; flex-direction: column; align-items: center;
      transform: translateY(-20px);
    `;
    content.innerHTML = `
      <div style="
        width: 40px; height: 40px; border-radius: 50%;
        background: ${isDark ? '#252525' : '#fff'};
        border: 2px solid ${isDark ? '#4CAF50' : '#8B5E3C'};
        display: flex; align-items: center; justify-content: center;
        font-size: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: transform 0.2s;
      ">${emoji}</div>
      <div style="
        margin-top: 2px; padding: 1px 6px; border-radius: 8px;
        background: ${isDark ? '#4CAF50' : '#8B5E3C'}; color: #fff;
        font-size: 10px; font-weight: bold; white-space: nowrap;
      ">⭐ ${rating}</div>
    `;

    content.addEventListener('click', () => {
      setSelectedPlace({ ...place, rating: Number(rating) });
      map.panTo(new window.kakao.maps.LatLng(place.y, place.x));
    });

    content.addEventListener('mouseenter', () => {
      content.firstElementChild.style.transform = 'scale(1.15)';
    });
    content.addEventListener('mouseleave', () => {
      content.firstElementChild.style.transform = 'scale(1)';
    });

    const overlay = new window.kakao.maps.CustomOverlay({
      map,
      position: new window.kakao.maps.LatLng(place.y, place.x),
      content,
      yAnchor: 1,
    });
    overlay.placeId = place.id;
    customOverlaysRef.current.push(overlay);
  };

  // --- 장소 검색 ---
  const fetchLocations = (map, lat, lng, category) => {
    const places = new window.kakao.maps.services.Places();
    const level = map.getLevel();
    const radius = ZOOM_RADIUS_MAP[level] || 500;

    places.keywordSearch(
      category,
      (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setLocations(data);
          data.forEach(place => createCustomMarker(map, place));
        } else {
          setLocations([]);
        }
      },
      {
        location: new window.kakao.maps.LatLng(lat, lng),
        radius,
        sort: window.kakao.maps.services.SortBy.DISTANCE,
      }
    );
  };

  // --- 카테고리 변경 ---
  const handleCategoryChange = useCallback((keyword) => {
    setSelectedCategory(keyword);
    localStorage.setItem(LS_KEYS.LAST_CATEGORY, keyword);
    setSelectedPlace(null);
    setShowResearch(false);

    if (mapRef.current && currentLocation) {
      clearMarkers();
      fetchLocations(mapRef.current, currentLocation.latitude, currentLocation.longitude, keyword);
    }
  }, [currentLocation]);

  // --- 주소 검색 ---
  const handleSearch = useCallback((queryOverride) => {
    const query = queryOverride || searchQuery;
    if (!query.trim() || !mapRef.current) return;
    setIsSearching(true);

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(query, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
        const { y, x } = result[0];
        const latlng = new window.kakao.maps.LatLng(y, x);
        mapRef.current.setCenter(latlng);
        setCurrentLocation({ latitude: Number(y), longitude: Number(x) });
        updateCurrentLocationMarker(mapRef.current, latlng);
        clearMarkers();
        fetchLocations(mapRef.current, y, x, selectedCategory);
      } else {
        // 주소 검색 실패 시 키워드로 장소 검색
        const places = new window.kakao.maps.services.Places();
        places.keywordSearch(query, (data, status2) => {
          if (status2 === window.kakao.maps.services.Status.OK && data.length > 0) {
            const first = data[0];
            const latlng = new window.kakao.maps.LatLng(first.y, first.x);
            mapRef.current.setCenter(latlng);
            setCurrentLocation({ latitude: Number(first.y), longitude: Number(first.x) });
            updateCurrentLocationMarker(mapRef.current, latlng);
            clearMarkers();
            setLocations(data);
            data.forEach(place => createCustomMarker(mapRef.current, place));
          }
        });
      }
      setIsSearching(false);
    });
  }, [searchQuery, selectedCategory]);

  // --- 장소 클릭 ---
  const handlePlaceClick = useCallback((place) => {
    setSelectedPlace(place);
    if (mapRef.current) {
      mapRef.current.panTo(new window.kakao.maps.LatLng(place.y, place.x));
    }
  }, []);

  // --- 줌 ---
  const handleZoomIn = useCallback(() => {
    if (mapRef.current) mapRef.current.setLevel(mapRef.current.getLevel() - 1);
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) mapRef.current.setLevel(mapRef.current.getLevel() + 1);
  }, []);

  // --- 내 위치 ---
  const handleMyLocation = useCallback(() => {
    getUserCurrentLocation();
  }, []);

  // --- 이 지역 재검색 (네이버맵 스타일) ---
  const handleResearchArea = useCallback(() => {
    if (!mapRef.current) return;
    const center = mapRef.current.getCenter();
    const lat = center.getLat();
    const lng = center.getLng();
    setCurrentLocation({ latitude: lat, longitude: lng });
    clearMarkers();
    fetchLocations(mapRef.current, lat, lng, selectedCategory);
    setShowResearch(false);
  }, [selectedCategory]);

  return (
    <KakaoMapView
      mapContainerRef={mapContainerRef}
      locations={locations}
      selectedPlace={selectedPlace}
      onCloseDetail={() => { setSelectedPlace(null); }}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onSearch={handleSearch}
      isSearching={isSearching}
      onPlaceClick={handlePlaceClick}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      onMyLocation={handleMyLocation}
      isLoadingLocation={isLoadingLocation}
      reviews={reviews}
      favorites={favorites}
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
      showFavorites={showFavorites}
      onToggleShowFavorites={() => setShowFavorites(prev => !prev)}
      showResearch={showResearch}
      onResearchArea={handleResearchArea}
    />
  );
};

export default KakaoMapContainer;
