import React, { useState, useEffect, useRef, useCallback } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import KakaoMapView from '../../components/map/KakaoMapView';

// 한국 행정구역 데이터
export const koreaLocations = {
  서울: {
    강남구: ['청담동', '삼성동', '역삼동'],
    강서구: ['화곡동', '등촌동', '목동'],
    종로구: ['종로1가', '종로2가', '종로3가']
  },
  부산: {
    해운대구: ['우동', 'Left', '중동'],
    남구: ['용호동', '감만동', '문현동'],
    동래구: ['명륜동', '온천동', '사직동']
  },
  대구: {
    달서구: ['성당동', '두류동', '월성동'],
    중구: ['봉산동', '대신동', '남산동']
  }
};

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

  // 지역 선택 상태
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // 지도 및 장소 관련 상태
  const [locations, setLocations] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categories.petShop);

  const isMobile = useMediaQuery('(max-width: 768px)');

  // 모바일: 오버레이(리스트) 열기 상태
  const [openList, setOpenList] = useState(false);
  const toggleList = () => setOpenList(prev => !prev);

  // 모바일 상세정보 오버레이 열릴 때 배경 스크롤 차단
  useEffect(() => {
    if (isMobile && selectedPlace) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobile, selectedPlace]);

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

  const initializeMap = useCallback(() => {
    const defaultLocation = { latitude: 37.5665, longitude: 126.9780 };
    setCurrentLocation(defaultLocation);
    loadMap(defaultLocation.latitude, defaultLocation.longitude);
  }, []);

  const loadMap = (lat, lng) => {
    const mapOption = {
      center: new window.kakao.maps.LatLng(lat, lng),
      level: 3,
      draggable: true,
      scrollwheel: false, // 지도 스크롤(마우스휠 줌) 비활성화
      disableDoubleClickZoom: false,
    };

    const map = new window.kakao.maps.Map(mapContainerRef.current, mapOption);
    mapRef.current = map;

    window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
      const latlng = mouseEvent.latLng;
      setCurrentLocation({ latitude: latlng.getLat(), longitude: latlng.getLng() });
      if (currentLocationMarker.current) {
        currentLocationMarker.current.setPosition(latlng);
      } else {
        const marker = new window.kakao.maps.Marker({
          map,
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

    fetchLocations(map, lat, lng, selectedCategory);
  };

  const fetchLocations = (map, lat, lng, keyword) => {
    clearMarkers();
    setLocations([]);
    const places = new window.kakao.maps.services.Places();
    const callback = (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setLocations(result);
        const newMarkers = result.map((place) => {
          const marker = new window.kakao.maps.Marker({
            map,
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
      } else {
        alert('검색 결과가 없습니다.');
      }
    };

    places.keywordSearch(keyword, callback, {
      location: new window.kakao.maps.LatLng(lat, lng),
      radius: 1000,
    });
  };

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  };

  const handleKeywordChange = (keyword) => {
    setSelectedCategory(keyword);
    if (currentLocation && mapRef.current) {
      fetchLocations(mapRef.current, currentLocation.latitude, currentLocation.longitude, keyword);
    }
  };

  const handleLocationSearch = () => {
    if (selectedProvince && selectedCity && selectedDistrict) {
      const fullAddress = `${selectedProvince} ${selectedCity} ${selectedDistrict}`;
      searchLocation(fullAddress);
    } else {
      alert('모든 지역을 선택해주세요.');
    }
  };

  const searchLocation = (address) => {
    if (!mapRef.current) return;
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        if (currentLocationMarker.current) {
          currentLocationMarker.current.setMap(null);
        }
        const marker = new window.kakao.maps.Marker({
          map: mapRef.current,
          position: coords,
        });
        currentLocationMarker.current = marker;
        setCurrentLocation({ latitude: result[0].y, longitude: result[0].x });
        mapRef.current.setCenter(coords);
        fetchLocations(mapRef.current, result[0].y, result[0].x, selectedCategory);
      } else {
        alert('주소를 찾을 수 없습니다.');
      }
    });
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
      // 지역 선택 UI props
      selectedProvince={selectedProvince}
      selectedCity={selectedCity}
      selectedDistrict={selectedDistrict}
      setSelectedProvince={setSelectedProvince}
      setSelectedCity={setSelectedCity}
      setSelectedDistrict={setSelectedDistrict}
      handleLocationSearch={handleLocationSearch}
      koreaLocations={koreaLocations}
      openList={openList}
      toggleList={toggleList}
    />
  );
};

export default KakaoMapContainer;
