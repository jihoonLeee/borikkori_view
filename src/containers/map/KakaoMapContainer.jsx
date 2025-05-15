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

// 카테고리 정의
const categories = {
  petShop: '애견샵',
  animalHospital: '동물병원',
  petCafe: '애견카페',
  dogPark: '강아지 공원',
  dogHotel: '강아지 호텔'
};

// 카테고리별 아이콘 매핑
const categoryIcons = {
  '애견샵': 'marker/shop',
  '동물병원': 'marker/hospital',
  '애견카페': 'marker/cafe',
  '강아지 공원': 'marker/park',
  '강아지 호텔': 'marker/hotel'
};

// 더미 리뷰 데이터
const getDummyReviews = (placeName) => {
  // 실제 구현에서는 API 호출로 대체될 부분
  const reviews = [
    {
      id: 1,
      userName: '강아지러버',
      rating: 5,
      content: '정말 좋은 곳이에요! 강아지와 함께 편안하게 시간을 보낼 수 있었습니다.',
      date: '2023-05-15'
    },
    {
      id: 2,
      userName: '멍멍이맘',
      rating: 4,
      content: '직원분들이 친절하고 시설도 깨끗해요. 다음에 또 방문할 예정입니다.',
      date: '2023-06-20'
    },
    {
      id: 3,
      userName: '포메러브',
      rating: 3,
      content: '괜찮은 곳이지만 주차가 조금 불편해요.',
      date: '2023-07-10'
    }
  ];
  
  return reviews;
};

const KakaoMapContainer = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const currentLocationMarker = useRef(null);
  const markersRef = useRef([]);
  const customOverlaysRef = useRef([]);

  // 지역 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 지도 및 장소 관련 상태
  const [locations, setLocations] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const savedCategory = localStorage.getItem('lastSelectedCategory');
    return savedCategory || categories.petShop;
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  
  // 리뷰 관련 상태
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ userName: '', rating: 5, content: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

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

  // 장소가 선택되면 리뷰 데이터 가져오기
  useEffect(() => {
    if (selectedPlace) {
      // 실제 구현에서는 API 요청으로 리뷰를 가져옵니다
      const placeReviews = getDummyReviews(selectedPlace.name);
      setReviews(placeReviews);
    }
  }, [selectedPlace]);

  // 카카오맵 스크립트 로드
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
    const defaultLocation = { latitude: 37.5665, longitude: 126.9780 }; // 서울 시청
    
    // 사용자의 현재 위치를 먼저 확인합니다
    getUserCurrentLocation();
    
    // 기본적으로 서울 시청으로 시작하지만, 위치 정보가 얻어지면 업데이트됩니다
    setCurrentLocation(defaultLocation);
    loadMap(defaultLocation.latitude, defaultLocation.longitude);
  }, []);

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("현재 브라우저에서 위치 정보를 지원하지 않습니다");
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        
        // 현재 위치로 지도 이동 및 마커 표시
        if (mapRef.current) {
          const latlng = new window.kakao.maps.LatLng(latitude, longitude);
          mapRef.current.setCenter(latlng);
          updateCurrentLocationMarker(mapRef.current, latlng);
          // 선택된 카테고리 유지하여 검색
          fetchLocations(mapRef.current, latitude, longitude, selectedCategory);
        }
        
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("현재 위치를 가져오는데 실패했습니다:", error);
        setLocationError("현재 위치를 가져오는데 실패했습니다. 권한을 확인해주세요.");
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
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

    // 지도 확대/축소 컨트롤 추가
    const zoomControl = new window.kakao.maps.ZoomControl();
    map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

    // 지도 확대/축소 완료 이벤트
    window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
      // 줌 레벨이 변경되었을 때 현재 위치를 업데이트
      const center = map.getCenter();
      const newLat = center.getLat();
      const newLng = center.getLng();
      
      // 새 위치 설정
      setCurrentLocation({
        latitude: newLat,
        longitude: newLng
      });
      
      // 확대/축소 시 현재 보이는 영역에서 검색
      clearMarkers();
      fetchLocations(map, newLat, newLng, selectedCategory);
    });

    // 지도 클릭 이벤트 - 현재 위치 마커만 업데이트, 장소 마커는 생성하지 않음
    window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
      const latlng = mouseEvent.latLng;
      
      // 선택된 장소가 있으면 닫기
      if (selectedPlace) {
        setSelectedPlace(null);
        setShowReviewForm(false);
      }
      
      // 현재 위치 상태만 업데이트
      setCurrentLocation({ 
        latitude: latlng.getLat(), 
        longitude: latlng.getLng() 
      });
      
      // 현재 위치 마커만 이동
      updateCurrentLocationMarker(map, latlng);
      
      // 클릭한 위치에서 새로 검색
      clearMarkers();
      fetchLocations(map, latlng.getLat(), latlng.getLng(), selectedCategory);
    });

    // 지도 이동 완료 이벤트 - 위치만 업데이트하고 자동 검색은 하지 않음
    window.kakao.maps.event.addListener(map, 'dragend', () => {
      const center = map.getCenter();
      const newLat = center.getLat();
      const newLng = center.getLng();
      
      // 현재 위치가 크게 변경된 경우에만 마커를 갱신
      if (currentLocation) {
        const latDiff = Math.abs(currentLocation.latitude - newLat);
        const lngDiff = Math.abs(currentLocation.longitude - newLng);
        
        // 위치가 일정 거리 이상 이동한 경우 갱신
        if (latDiff > 0.01 || lngDiff > 0.01) {
          clearMarkers();
          // 위치 변경 후 주변 검색 실행
          fetchLocations(map, newLat, newLng, selectedCategory);
        }
      }
      
      setCurrentLocation({ 
        latitude: newLat, 
        longitude: newLng 
      });
    });

    // 현재 위치에 마커 표시
    const currentLatLng = new window.kakao.maps.LatLng(lat, lng);
    updateCurrentLocationMarker(map, currentLatLng);
    
    // 모바일 환경을 위한 설정
    if (isMobile) {
      // 커스텀 줌 컨트롤 컨테이너 생성
      const zoomControlContainer = document.createElement('div');
      zoomControlContainer.className = 'custom-zoom-control';
      zoomControlContainer.style.position = 'absolute';
      zoomControlContainer.style.bottom = '80px';
      zoomControlContainer.style.right = '10px';
      zoomControlContainer.style.zIndex = '2';
      zoomControlContainer.style.display = 'flex';
      zoomControlContainer.style.flexDirection = 'column';
      zoomControlContainer.style.padding = '5px';
      
      // 줌 인 버튼
      const zoomInBtn = document.createElement('button');
      zoomInBtn.innerHTML = '+';
      zoomInBtn.style.width = '40px';
      zoomInBtn.style.height = '40px';
      zoomInBtn.style.backgroundColor = 'white';
      zoomInBtn.style.border = '1px solid #ccc';
      zoomInBtn.style.borderRadius = '50%';
      zoomInBtn.style.fontSize = '20px';
      zoomInBtn.style.fontWeight = 'bold';
      zoomInBtn.style.margin = '5px';
      zoomInBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
      
      // 줌 아웃 버튼
      const zoomOutBtn = document.createElement('button');
      zoomOutBtn.innerHTML = '-';
      zoomOutBtn.style.width = '40px';
      zoomOutBtn.style.height = '40px';
      zoomOutBtn.style.backgroundColor = 'white';
      zoomOutBtn.style.border = '1px solid #ccc';
      zoomOutBtn.style.borderRadius = '50%';
      zoomOutBtn.style.fontSize = '20px';
      zoomOutBtn.style.fontWeight = 'bold';
      zoomOutBtn.style.margin = '5px';
      zoomOutBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
      
      // 내 위치 버튼
      const myLocationBtn = document.createElement('button');
      myLocationBtn.innerHTML = '📍';
      myLocationBtn.style.width = '40px';
      myLocationBtn.style.height = '40px';
      myLocationBtn.style.backgroundColor = 'white';
      myLocationBtn.style.border = '1px solid #ccc';
      myLocationBtn.style.borderRadius = '50%';
      myLocationBtn.style.fontSize = '20px';
      myLocationBtn.style.margin = '5px';
      myLocationBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
      
      // 버튼 이벤트 추가
      zoomInBtn.addEventListener('click', () => {
        const currentLevel = map.getLevel();
        map.setLevel(currentLevel - 1, {animate: true});
      });
      
      zoomOutBtn.addEventListener('click', () => {
        const currentLevel = map.getLevel();
        map.setLevel(currentLevel + 1, {animate: true});
      });
      
      myLocationBtn.addEventListener('click', () => {
        getUserCurrentLocation();
      });
      
      // 버튼을 컨테이너에 추가
      zoomControlContainer.appendChild(zoomInBtn);
      zoomControlContainer.appendChild(zoomOutBtn);
      zoomControlContainer.appendChild(myLocationBtn);
      
      // 컨테이너를 지도에 추가
      mapContainerRef.current.appendChild(zoomControlContainer);
      
      // 모바일 터치 이벤트 개선
      const mapContainer = mapContainerRef.current;
      let isDragging = false;
      let lastTouchX, lastTouchY;
      let touchStartTime = 0;
      let initialDistance = 0;
      
      // 터치 시작 이벤트
      mapContainer.addEventListener('touchstart', (e) => {
        // 두 손가락 터치(핀치 줌)
        if (e.touches.length === 2) {
          const touch1 = e.touches[0];
          const touch2 = e.touches[1];
          initialDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
          );
        } 
        // 한 손가락 터치(드래그)
        else if (e.touches.length === 1) {
          touchStartTime = Date.now();
          isDragging = true;
          lastTouchX = e.touches[0].clientX;
          lastTouchY = e.touches[0].clientY;
        }
      });
      
      // 터치 이동 이벤트
      mapContainer.addEventListener('touchmove', (e) => {
        // 상세 정보 화면이 열려있는 경우는 스크롤만 허용
        if (selectedPlace) return;
        
        // 핀치 줌(두 손가락)
        if (e.touches.length === 2) {
          const touch1 = e.touches[0];
          const touch2 = e.touches[1];
          const currentDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
          );
          
          if (initialDistance > 0) {
            if (currentDistance > initialDistance * 1.1) {
              // 줌 인 (더 부드럽게)
              const zoomFactor = Math.min(0.5, (currentDistance - initialDistance) / initialDistance);
              const currentLevel = map.getLevel();
              const newLevel = Math.max(1, currentLevel - zoomFactor * 2);
              map.setLevel(newLevel);
              initialDistance = currentDistance;
            } else if (currentDistance < initialDistance * 0.9) {
              // 줌 아웃 (더 부드럽게)
              const zoomFactor = Math.min(0.5, (initialDistance - currentDistance) / initialDistance);
              const currentLevel = map.getLevel();
              const newLevel = Math.min(14, currentLevel + zoomFactor * 2);
              map.setLevel(newLevel);
              initialDistance = currentDistance;
            }
          }
          
          e.preventDefault();
        } 
        // 드래그(한 손가락)
        else if (isDragging && e.touches.length === 1) {
          const currentX = e.touches[0].clientX;
          const currentY = e.touches[0].clientY;
          
          // 터치 이동 거리
          const deltaX = lastTouchX - currentX;
          const deltaY = lastTouchY - currentY;
          
          // 일정 거리 이상 이동 시에만 지도 이동 (작은 움직임 무시)
          if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
            // 더 빠른 이동 속도 적용
            const currentTime = Date.now();
            const timeElapsed = currentTime - touchStartTime;
            // 빠른 움직임은 더 빠른 이동 속도
            const speedFactor = timeElapsed < 250 ? 0.0004 : 0.0002;
            
            const currentCenter = map.getCenter();
            const newLat = currentCenter.getLat() + (deltaY * speedFactor);
            const newLng = currentCenter.getLng() - (deltaX * speedFactor);
            map.setCenter(new window.kakao.maps.LatLng(newLat, newLng));
            
            // 위치 업데이트
            lastTouchX = currentX;
            lastTouchY = currentY;
          }
          
          e.preventDefault();
        }
      }, { passive: false });
      
      // 터치 종료 이벤트
      mapContainer.addEventListener('touchend', () => {
        if (isDragging || initialDistance > 0) {
          // 터치 종료 시 현재 위치 업데이트
          const center = map.getCenter();
          setCurrentLocation({
            latitude: center.getLat(),
            longitude: center.getLng()
          });
          
          // 드래그 후 주변 검색 실행
          fetchLocations(
            map,
            center.getLat(),
            center.getLng(),
            selectedCategory
          );
        }
        
        // 상태 초기화
        isDragging = false;
        initialDistance = 0;
      });
    }
  };

  // 현재 위치 마커 업데이트 - 검색된 장소와 구분되는 현재 위치 표시용 마커
  const updateCurrentLocationMarker = (map, latlng) => {
      if (currentLocationMarker.current) {
        currentLocationMarker.current.setPosition(latlng);
      } else {
        const marker = new window.kakao.maps.Marker({
          map,
          position: latlng,
        title: "현재 위치",
          image: new window.kakao.maps.MarkerImage(
            "http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_blue.png",
            new window.kakao.maps.Size(24, 35),
            { offset: new window.kakao.maps.Point(12, 35) }
          ),
        });
        currentLocationMarker.current = marker;
      }
  };

  // 커스텀 오버레이를 사용한 예쁜 마커 생성 함수
  const createCustomMarker = (map, place) => {
    try {
      // 유효한 장소 데이터인지 확인
      if (!place || !place.y || !place.x) {
        console.error('유효하지 않은 장소 데이터:', place);
        return null;
      }
      
      // 이미 존재하는 오버레이인지 확인하여 중복 생성 방지
      const isDuplicate = customOverlaysRef.current.some(overlay => {
        if (overlay && overlay.getPosition) {
          const pos = overlay.getPosition();
          // 같은 위치의 오버레이가 이미 있는 경우
          return pos && 
            Math.abs(pos.getLat() - place.y) < 0.0001 && 
            Math.abs(pos.getLng() - place.x) < 0.0001;
        }
        return false;
      });
      
      if (isDuplicate) {
        console.log('중복된 마커가 감지되어 생성이 취소되었습니다:', place.place_name);
        return null;
      }
      
      // 평균 별점 계산 (실제로는 DB에서 가져올 값)
      const rating = Math.random() * 2 + 3; // 3~5점 사이 랜덤값
      const ratingStr = rating.toFixed(1);
      
      // 장소 카테고리에 맞는 아이콘 결정
      let iconType = 'marker/default'; // 기본값
      
      // 카테고리 이름에서 적절한 아이콘 찾기
      if (place.category_name) {
        for (const [category, icon] of Object.entries(categoryIcons)) {
          if (place.category_name.includes(category)) {
            iconType = icon;
            break;
          }
        }
      }
      
      // 커스텀 오버레이 내용 생성
      const content = document.createElement('div');
      content.className = 'custom-marker';
      content.style.position = 'relative';
      content.style.width = '60px';
      content.style.height = '60px';
      content.style.display = 'flex';
      content.style.flexDirection = 'column';
      content.style.alignItems = 'center';
      content.style.cursor = 'pointer';
      
      // 마커 본체 (원형)
      const markerBody = document.createElement('div');
      markerBody.style.width = '40px';
      markerBody.style.height = '40px';
      markerBody.style.backgroundImage = `url(${process.env.PUBLIC_URL}/images/${iconType}.png)`;
      markerBody.style.backgroundSize = 'cover';
      markerBody.style.backgroundPosition = 'center';
      markerBody.style.backgroundRepeat = 'no-repeat';
      markerBody.style.backgroundColor = '#fff';
      markerBody.style.borderRadius = '50%';
      markerBody.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      markerBody.style.border = '2px solid #fff';
      markerBody.style.transition = 'transform 0.2s ease';
      content.appendChild(markerBody);
      
      // 별점 표시
      const ratingDiv = document.createElement('div');
      ratingDiv.style.marginTop = '2px';
      ratingDiv.style.padding = '1px 5px';
      ratingDiv.style.backgroundColor = '#4caf50';
      ratingDiv.style.color = 'white';
      ratingDiv.style.fontSize = '10px';
      ratingDiv.style.fontWeight = 'bold';
      ratingDiv.style.borderRadius = '10px';
      ratingDiv.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
      ratingDiv.innerHTML = `★ ${ratingStr}`;
      content.appendChild(ratingDiv);
      
      // 커스텀 오버레이 생성
      const position = new window.kakao.maps.LatLng(place.y, place.x);
      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: position,
        content: content,
        yAnchor: 1.0,
        zIndex: 1
      });
      
      // 클릭 이벤트
      content.onclick = function() {
        // 카테고리에서 맞는 이름 찾기
        let categoryKey = '';
        Object.entries(categories).forEach(([key, value]) => {
          if (place.category_name && place.category_name.includes(value)) {
            categoryKey = key;
          }
        });
        
        setSelectedPlace({
          id: place.id,
          name: place.place_name,
          address: place.address_name,
          image: place.image_url,
          position: { lat: place.y, lng: place.x },
          phone: place.phone,
          category_name: place.category_name,
          place_url: place.place_url,
          rating: ratingStr,
          category_key: categoryKey,
          icon_type: iconType
        });
        mapRef.current.setCenter(position);
      };
      
      // 마우스 오버/아웃 효과
      content.onmouseover = function() {
        markerBody.style.transform = 'scale(1.1)';
      };
      
      content.onmouseout = function() {
        markerBody.style.transform = 'scale(1)';
      };
      
      // 오버레이를 맵에 추가
      customOverlay.setMap(map);
      console.log(`마커 생성됨: ${place.place_name} (${place.category_name || '분류 없음'})`);
      return customOverlay;
    } catch (error) {
      console.error('마커 생성 중 오류 발생:', error);
      return null;
    }
  };

  const clearMarkers = () => {
    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    
    // 커스텀 오버레이 제거
    customOverlaysRef.current.forEach((overlay) => {
      if (overlay && typeof overlay.setMap === 'function') {
        overlay.setMap(null);
      }
    });
    customOverlaysRef.current = [];
    
    console.log('모든 마커와 오버레이가 초기화되었습니다.');
  };

  const fetchLocations = (map, lat, lng, keyword) => {
    try {
      // 먼저 기존 마커들을 모두 제거
    clearMarkers();
    setLocations([]);
      
      if (!keyword) {
        console.warn('검색 키워드가 없어 검색을 중단합니다.');
        return;
      }
      
      console.log(`"${keyword}" 키워드로 위치(${lat.toFixed(6)}, ${lng.toFixed(6)}) 주변 검색 시작`);
      
    const places = new window.kakao.maps.services.Places();
      
      // 현재 맵 영역(바운드) 가져오기
      const bounds = map.getBounds();
      const swLatLng = bounds.getSouthWest();
      const neLatLng = bounds.getNorthEast();
      
      // 맵 중앙에서 현재 보이는 영역 내에서 검색 거리 계산
      const latDiff = Math.abs(neLatLng.getLat() - swLatLng.getLat());
      const lngDiff = Math.abs(neLatLng.getLng() - swLatLng.getLng());
      
      // 현재 맵 줌 레벨에 맞게 검색 반경 조정 (미터 단위)
      // 줌 레벨이 작을수록(더 확대됨) 검색 반경도 작게
      const zoomLevel = map.getLevel();
      const searchRadius = Math.min(2000, 500 * zoomLevel);
      
      console.log(`검색 반경: ${searchRadius}m, 줌 레벨: ${zoomLevel}`);
      
    const callback = (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
          console.log(`검색 결과: ${result.length}개 장소 발견`);
          
          // 현재 맵 영역 안에 있는 장소만 필터링
          const filteredResults = result.filter(place => {
            const placePos = new window.kakao.maps.LatLng(place.y, place.x);
            return bounds.contain(placePos);
          });
          
          console.log(`지도 영역 내 필터링 결과: ${filteredResults.length}개 장소`);
          setLocations(filteredResults);
          
          // 모든 기존 오버레이 제거 확인
          if (customOverlaysRef.current.length > 0) {
            console.warn('이전 마커가 남아있어 모두 제거합니다.');
            clearMarkers();
          }
          
          // 커스텀 마커 생성
          const newOverlays = filteredResults.map((place) => {
            return createCustomMarker(map, place);
          }).filter(overlay => overlay !== null); // null 값 제거
          
          customOverlaysRef.current = newOverlays;
          console.log(`${newOverlays.length}개의 새 마커가 생성되었습니다.`);
      } else {
          console.error('검색 결과가 없습니다:', status);
          setLocations([]);
      }
    };

    places.keywordSearch(keyword, callback, {
      location: new window.kakao.maps.LatLng(lat, lng),
        radius: searchRadius,
        sort: window.kakao.maps.services.SortBy.DISTANCE
      });
    } catch (error) {
      console.error('위치 검색 중 오류 발생:', error);
      setLocations([]);
    }
  };

  const handleKeywordChange = (keyword) => {
    if (keyword === selectedCategory) return; // 같은 카테고리면 무시
    
    setSelectedCategory(keyword);
    // 선택한 카테고리를 localStorage에 저장
    localStorage.setItem('lastSelectedCategory', keyword);
    
    if (currentLocation && mapRef.current) {
      // 카테고리 변경 시 마커 초기화 후 주변 검색 실행
      clearMarkers();
      fetchLocations(mapRef.current, currentLocation.latitude, currentLocation.longitude, keyword);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    setIsSearching(true);
    // 기존 마커 초기화
    clearMarkers();
    
    const geocoder = new window.kakao.maps.services.Geocoder();
    
    geocoder.addressSearch(searchQuery, (result, status) => {
      setIsSearching(false);
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        
        // 기존 현재 위치 마커 업데이트
        if (currentLocationMarker.current) {
          currentLocationMarker.current.setPosition(coords);
        } else {
        const marker = new window.kakao.maps.Marker({
          map: mapRef.current,
          position: coords,
            title: "검색 위치",
            image: new window.kakao.maps.MarkerImage(
              "http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_blue.png",
              new window.kakao.maps.Size(24, 35),
              { offset: new window.kakao.maps.Point(12, 35) }
            ),
        });
        currentLocationMarker.current = marker;
        }
        
        setCurrentLocation({ latitude: result[0].y, longitude: result[0].x });
        mapRef.current.setCenter(coords);
        
        // 검색 시에는 주변 검색 실행
        fetchLocations(mapRef.current, result[0].y, result[0].x, selectedCategory);
      } else {
        alert('주소를 찾을 수 없습니다.');
      }
    });
  };

  // 마커 클릭 시 상세 정보 표시
  const handleLocationClick = (place) => {
    if (!place || !place.y || !place.x) {
      console.error('유효하지 않은 장소 데이터:', place);
      return;
    }
    
    const clickedPlace = {
      id: place.id,
      name: place.place_name,
      address: place.address_name,
      image: place.image_url,
      position: { lat: place.y, lng: place.x },
      phone: place.phone,
      category_name: place.category_name,
      place_url: place.place_url,
      rating: "4.5" // 예시 값, 실제 구현에서는 DB에서 가져와야 함
    };
    
    setSelectedPlace(clickedPlace);
    
    // 지도 중심 이동
    if (mapRef.current) {
    mapRef.current.setCenter(new window.kakao.maps.LatLng(place.y, place.x));
    }
  };

  // 선택된 장소 정보 패널 닫기
  const closeDetailSection = () => {
    setSelectedPlace(null);
    setShowReviewForm(false);
    
    // 모바일에서 닫을 때 바운스 효과 추가
    if (isMobile && mapRef.current) {
      const currentCenter = mapRef.current.getCenter();
      // 살짝 줌 아웃했다가 다시 원래 레벨로 돌아오는 애니메이션
      const currentLevel = mapRef.current.getLevel();
      mapRef.current.setLevel(currentLevel + 1, {animate: true});
      setTimeout(() => {
        mapRef.current.setLevel(currentLevel, {animate: true});
      }, 100);
    }
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

  // 현재 위치로 이동하는 함수
  const moveToCurrentLocation = () => {
    // 기존 마커 초기화
    clearMarkers();
    
    getUserCurrentLocation();
    // 현재 위치로 이동 시에는 주변 검색 실행
    if (currentLocation && mapRef.current) {
      fetchLocations(mapRef.current, currentLocation.latitude, currentLocation.longitude, selectedCategory);
    }
  };
  
  // 리뷰 입력 핸들러
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 별점 변경 핸들러
  const handleRatingChange = (rating) => {
    setNewReview(prev => ({
      ...prev,
      rating
    }));
  };
  
  // 리뷰 제출 핸들러
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    // 필수 입력값 검증
    if (!newReview.userName.trim() || !newReview.content.trim()) {
      alert('이름과 리뷰 내용을 입력해주세요.');
      return;
    }
    
    // 새 리뷰 객체 생성
    const reviewToAdd = {
      id: Date.now(), // 임시 ID 생성
      userName: newReview.userName,
      rating: newReview.rating,
      content: newReview.content,
      date: new Date().toISOString().split('T')[0], // 현재 날짜
      place_id: selectedPlace.id // 장소 ID 연결
    };
    
    // TODO: 실제 구현에서는 리뷰 데이터를 서버에 저장하는 API 호출 필요
    // saveReviewToDatabase(reviewToAdd).then(() => {
    //   // 성공적으로 저장 후 리뷰 목록 갱신
    // });
    
    // 임시로 리뷰 목록에 추가
    setReviews(prev => [reviewToAdd, ...prev]);
    
    // 입력 폼 초기화
    setNewReview({ userName: '', rating: 5, content: '' });
    setShowReviewForm(false);
  };

  // 컴포넌트 마운트 시 기본 카테고리로 초기 로드
  useEffect(() => {
    if (currentLocation && mapRef.current && selectedCategory) {
      console.log('위치 또는 카테고리가 변경되어 주변 검색을 시작합니다.');
      // 이전 마커 제거 후 새로운 검색 실행
      clearMarkers();
      fetchLocations(mapRef.current, currentLocation.latitude, currentLocation.longitude, selectedCategory);
    }
  }, [currentLocation, selectedCategory]);

  // 지도가 로드될 때 이벤트 핸들러
  useEffect(() => {
    // 컴포넌트 언마운트 시 모든 마커와 오버레이 제거
    return () => {
      if (markersRef.current.length > 0 || customOverlaysRef.current.length > 0) {
        console.log('컴포넌트 언마운트: 모든 마커와 오버레이를 제거합니다.');
        clearMarkers();
      }
    };
  }, []);

  // 모바일/데스크톱 변경 시 마커 재생성
  useEffect(() => {
    if (mapRef.current && currentLocation) {
      console.log('화면 크기 변경으로 마커를 초기화합니다.');
      clearMarkers();
      fetchLocations(
        mapRef.current, 
        currentLocation.latitude, 
        currentLocation.longitude, 
        selectedCategory
      );
    }
  }, [isMobile]);

  // 디버깅: 선택된 장소 정보 확인
  useEffect(() => {
    if (selectedPlace) {
      console.log('Selected Place:', selectedPlace);
      if (!selectedPlace.position || !selectedPlace.position.lat || !selectedPlace.position.lng) {
        console.warn('위치 정보가 없거나 잘못되었습니다:', selectedPlace);
      }
    }
  }, [selectedPlace]);

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
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      handleSearch={handleSearch}
      isSearching={isSearching}
      openList={openList}
      toggleList={toggleList}
      moveToCurrentLocation={moveToCurrentLocation}
      isLoadingLocation={isLoadingLocation}
      locationError={locationError}
      // 리뷰 관련 props
      reviews={reviews}
      newReview={newReview}
      handleReviewChange={handleReviewChange}
      handleRatingChange={handleRatingChange}
      handleReviewSubmit={handleReviewSubmit}
      showReviewForm={showReviewForm}
      setShowReviewForm={setShowReviewForm}
    />
  );
};

export default KakaoMapContainer;
