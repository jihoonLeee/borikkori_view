import React, { useEffect, useRef, useState } from 'react';
import '../../styles/KakaoMap.css'; // Importing CSS for styling

const categories = {
  petShop: '애견샵',
  animalHospital: '동물병원',
  petCafe: '애견카페'
};

const KakaoMap = () => {
  const mapContainer = useRef(null); // Reference for map container
  const [locations, setLocations] = useState([]); // State for locations within 1km
  const [selectedPlace, setSelectedPlace] = useState(null); // State for selected place info
  const [currentLocation, setCurrentLocation] = useState(null); // State for current location
  const [selectedCategory, setSelectedCategory] = useState(categories.petShop); // State for selected category
  const [isDetailOpen, setIsDetailOpen] = useState(false); // State for detail section visibility
  const mapRef = useRef(null); // Store the map instance
  const currentLocationMarker = useRef(null); // Reference for the current location marker
  const markersRef = useRef([]); // Reference for markers

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
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
    };

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
    const defaultLocation = { latitude: 37.476559, longitude: 126.981633 }; // 사당역 좌표
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          loadMap(latitude, longitude);
        },
        (error) => {
          console.error('위치 정보를 사용할 수 없습니다:', error);
          alert('현재 위치를 불러올 수 없어 기본 위치(사당역)로 설정합니다.');
          setCurrentLocation(defaultLocation);
          loadMap(defaultLocation.latitude, defaultLocation.longitude);
        }
      );
    } else {
      console.error('Geolocation을 지원하지 않는 브라우저입니다.');
      alert('Geolocation을 지원하지 않아 기본 위치(사당역)로 설정합니다.');
      setCurrentLocation(defaultLocation);
      loadMap(defaultLocation.latitude, defaultLocation.longitude);
    }
  };
  
  const loadMap = (latitude, longitude) => {
    const mapOption = {
      center: new window.kakao.maps.LatLng(latitude, longitude),
      level: 3,
    };
    const map = new window.kakao.maps.Map(mapContainer.current, mapOption);
    mapRef.current = map;
  
    if (isMobile()) {
      const marker = new window.kakao.maps.Marker({
        map: map,
        position: new window.kakao.maps.LatLng(latitude, longitude),
        title: "현재 위치",
        image: new window.kakao.maps.MarkerImage(
          "http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
          new window.kakao.maps.Size(24, 35),
          { offset: new window.kakao.maps.Point(12, 35) }
        ),
      });
  
      currentLocationMarker.current = marker;
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  
    fetchLocations(map, latitude, longitude, selectedCategory);
  };
  
  

  const handleOrientation = (event) => {
    const { alpha } = event;
    const rotation = 360 - alpha;
    if (currentLocationMarker.current) {
      const markerElement = document.querySelector('.current-location-marker');
      if (markerElement) {
        markerElement.style.transform = `rotate(${rotation}deg)`;
      }
    }
  };

  const isMobile = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  const fetchLocations = (map, latitude, longitude, keyword) => {
    clearMarkers(); // Clear existing markers
    setLocations([]); // Clear existing locations

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
              position: {
                lat: place.y,
                lng: place.x,
              },
            });
            setIsDetailOpen(true);
          });

          return marker;
        });

        markersRef.current = newMarkers; // Store new markers
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
    if (currentLocation) {
      fetchLocations(mapRef.current, currentLocation.latitude, currentLocation.longitude, keyword);
    }
  };

  const handleLocationClick = (place) => {
    setSelectedPlace({
      name: place.place_name,
      address: place.address_name,
      image: place.image_url,
      reviews: place.reviews,
      position: {
        lat: place.y,
        lng: place.x,
      },
    });
    mapRef.current.setCenter(new window.kakao.maps.LatLng(place.y, place.x));
    setIsDetailOpen(true);
  };

  const closeDetailSection = () => {
    setIsDetailOpen(false);
  };

  const recenterMap = () => {
    if (currentLocation) {
      const moveLatLon = new window.kakao.maps.LatLng(currentLocation.latitude, currentLocation.longitude);
      mapRef.current.setCenter(moveLatLon);
      if (currentLocationMarker.current) {
        currentLocationMarker.current.setPosition(moveLatLon);
      }
    }
  };

  return (
    <div className={`container ${isDetailOpen ? 'detail-open' : ''}`}>
      <div className="content">
        <div className="list-section">
          <div className="category-buttons">
            <button onClick={() => handleKeywordChange(categories.petShop)} className={selectedCategory === categories.petShop ? 'active' : ''}>애견샵</button>
            <button onClick={() => handleKeywordChange(categories.animalHospital)} className={selectedCategory === categories.animalHospital ? 'active' : ''}>동물병원</button>
            <button onClick={() => handleKeywordChange(categories.petCafe)} className={selectedCategory === categories.petCafe ? 'active' : ''}>애견카페</button>
          </div>
          <ul>
            {locations.length > 0 ? (
              locations.map((place) => (
                <li key={place.id} onClick={() => handleLocationClick(place)}>
                  <img src={place.imageUrl || `${process.env.PUBLIC_URL}/images/borikkori_brown.png`} alt={place.place_name} />
                  <div className="place-item">
                    <div className="place-info">
                      <h4>{place.place_name}</h4>
                      <p>{place.address_name}</p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li>근처에 해당 장소가 없습니다.</li>
            )}
          </ul>
        </div>
        <div className="map-section" ref={mapContainer}>
          <button className="recenter-button" onClick={recenterMap}>
            <img src={`${process.env.PUBLIC_URL}/icons/borikkori_brown.png`} alt="현재 위치" />
          </button>
        </div>
        <div className={`detail-section ${isDetailOpen ? 'open' : ''}`}>
          <button className="close-button" onClick={closeDetailSection}>닫기</button>
          {selectedPlace && (
            <div>
              <h2>{selectedPlace.name}</h2>
              <img src={selectedPlace.image || `${process.env.PUBLIC_URL}/images/borikkori_brown.png`} alt={selectedPlace.name} />
              <p><strong>주소:</strong> {selectedPlace.address}</p>
              <div className="reviews">
                <h3>리뷰</h3>
                <ul>
                  {selectedPlace.reviews && selectedPlace.reviews.length > 0 ? (
                    selectedPlace.reviews.map((review, index) => (
                      <li key={index}>{review}</li>
                    ))
                  ) : (
                    <li>리뷰가 없습니다.</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KakaoMap;
