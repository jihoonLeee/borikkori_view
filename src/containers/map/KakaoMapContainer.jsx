import React, { useState, useEffect, useRef } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import KakaoMapView from '../../components/map/KakaoMapView';

const categories = {
  petShop: '애견샵',
  animalHospital: '동물병원',
  petCafe: '애견카페'
};

const KakaoMapContainer = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const currentLocationMarker = useRef(null);
  const markersRef = useRef([]);
  
  const [locations, setLocations] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categories.petShop);
  
  const isMobile = useMediaQuery('(max-width: 768px)');

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
        document.head.append(script);
      });

    const KAKAO_APP_KEY = process.env.REACT_APP_KAKAO_MAP_API;
    const scriptSrc = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services,clusterer,drawing`;

    loadScript(scriptSrc)
      .then(() => {
        if (!window.kakao) {
          console.error('Kakao script not loaded');
          return;
        }
        window.kakao.maps.load(() => {
          initializeMap();
        });
      })
      .catch((error) => {
        console.error('Kakao Map script load error:', error);
      });
  }, []);

  const initializeMap = () => {
    const defaultLocation = { latitude: 37.476559, longitude: 126.981633 };
    setCurrentLocation(defaultLocation);
    loadMap(defaultLocation.latitude, defaultLocation.longitude);
  };

  const loadMap = (latitude, longitude) => {
    const mapOption = {
      center: new window.kakao.maps.LatLng(latitude, longitude),
      level: 3,
    };
    const map = new window.kakao.maps.Map(mapContainerRef.current, mapOption);
    mapRef.current = map;

    // 지도 클릭 시: 선택된 위치 업데이트 및 카테고리 검색 실행
    window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
      const latlng = mouseEvent.latLng;
      setCurrentLocation({ latitude: latlng.getLat(), longitude: latlng.getLng() });
      if (currentLocationMarker.current) {
        currentLocationMarker.current.setPosition(latlng);
      } else {
        const marker = new window.kakao.maps.Marker({
          map: map,
          position: latlng,
          title: "선택된 위치",
          image: new window.kakao.maps.MarkerImage(
            "http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_blue.png",
            new window.kakao.maps.Size(24, 35),
            { offset: new window.kakao.maps.Point(12, 35) }
          ),
        });
        currentLocationMarker.current = marker;
      }
      fetchLocations(map, latlng.getLat(), latlng.getLng(), selectedCategory);
    });

    // 초기 검색 실행 (기본 위치 기준)
    fetchLocations(map, latitude, longitude, selectedCategory);
  };

  const fetchLocations = (map, latitude, longitude, keyword) => {
    clearMarkers();
    setLocations([]);
    const places = new window.kakao.maps.services.Places();
    const callback = (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setLocations(result);
        const newMarkers = result.map((place) => {
          const marker = new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(place.y, place.x),
          });
          window.kakao.maps.event.addListener(marker, 'click', () => {
            setSelectedPlace({
              name: place.place_name,
              address: place.address_name,
              image: place.image_url,
              reviews: place.reviews,
              position: { lat: place.y, lng: place.x },
            });
          });
          return marker;
        });
        markersRef.current = newMarkers;
      }
    };
    places.keywordSearch(keyword, callback, {
      location: new window.kakao.maps.LatLng(latitude, longitude),
      radius: 1000,
    });
  };

  const clearMarkers = () => {
    if (markersRef.current) {
      markersRef.current.forEach((marker) => marker.setMap(null));
    }
    markersRef.current = [];
  };

  const handleKeywordChange = (keyword) => {
    setSelectedCategory(keyword);
    if (currentLocation && mapRef.current) {
      fetchLocations(mapRef.current, currentLocation.latitude, currentLocation.longitude, keyword);
    }
  };

  const handleLocationClick = (place) => {
    setSelectedPlace({
      name: place.place_name,
      address: place.address_name,
      image: place.image_url,
      reviews: place.reviews,
      position: { lat: place.y, lng: place.x },
    });
    mapRef.current.setCenter(new window.kakao.maps.LatLng(place.y, place.x));
  };

  const closeDetailSection = () => {
    setSelectedPlace(null);
  };

  const recenterMap = () => {
    if (currentLocation && mapRef.current) {
      const moveLatLon = new window.kakao.maps.LatLng(
        currentLocation.latitude,
        currentLocation.longitude
      );
      mapRef.current.setCenter(moveLatLon);
      if (currentLocationMarker.current) {
        currentLocationMarker.current.setPosition(moveLatLon);
      }
    }
  };

  return (
    <KakaoMapView
      isMobile={isMobile}
      mapContainerRef={mapContainerRef}
      locations={locations}
      selectedPlace={selectedPlace}
      closeDetailSection={closeDetailSection}
      recenterMap={recenterMap}
      handleKeywordChange={handleKeywordChange}
      categories={categories}
      selectedCategory={selectedCategory}
      handleLocationClick={handleLocationClick}
    />
  );
};

export default KakaoMapContainer;
