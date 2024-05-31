import React, { useEffect, useRef, useState } from 'react';

const KakaoMap = () => {
  const mapContainer = useRef(null); // 지도 표시할 div
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

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

    const KAKAO_APP_KEY = '36eefc537926bdf4380db8d92ac78ac3'; // 여기에 실제 카카오 앱 키를 입력하세요.
    const scriptSrc = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services,clusterer,drawing`;

    loadScript(scriptSrc)
      .then(() => {
        if (!window.kakao) {
          console.error('Kakao script not loaded');
          return;
        }

        window.kakao.maps.load(() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
              const { latitude, longitude } = position.coords;
              setCurrentLocation({ latitude, longitude });
              const mapOption = {
                center: new window.kakao.maps.LatLng(latitude, longitude), // 현재 위치를 중심으로 지도 설정
                level: 3 // 지도의 확대 레벨
              };
              const map = new window.kakao.maps.Map(mapContainer.current, mapOption); // 지도를 생성합니다

              // 마커를 현재 위치에 생성합니다
              const marker = new window.kakao.maps.Marker({
                map: map,
                position: new window.kakao.maps.LatLng(latitude, longitude)
              });

              // 지도 클릭 이벤트 등록
              window.kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
                const latlng = mouseEvent.latLng;

                // 마커 위치를 클릭한 위치로 옮깁니다
                marker.setPosition(latlng);

                // 좌표를 통해 장소 검색
                searchDetailAddrFromCoords(latlng, function (result, status) {
                  if (status === window.kakao.maps.services.Status.OK) {
                    const detailAddr = !!result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name;

                    setSelectedPlace({
                      address: detailAddr,
                      latitude: latlng.getLat(),
                      longitude: latlng.getLng()
                    });
                  }
                });
              });

              // 좌표로 행정동 주소 정보를 요청합니다
              function searchDetailAddrFromCoords(coords, callback) {
                const geocoder = new window.kakao.maps.services.Geocoder();
                geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
              }
            }, error => {
              console.error('Geolocation error:', error);
              alert('현재 위치를 불러올 수 없습니다.');
            });
          } else {
            console.error('Geolocation not supported');
            alert('Geolocation을 지원하지 않는 브라우저입니다.');
          }
        });
      })
      .catch(error => {
        console.error('Kakao Map script load error:', error);
      });
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '30%', padding: '20px', boxSizing: 'border-box' }}>
        {selectedPlace ? (
          <div>
            <h3>선택한 장소 정보</h3>
            <p><strong>주소:</strong> {selectedPlace.address}</p>
            <p><strong>위도:</strong> {selectedPlace.latitude}</p>
            <p><strong>경도:</strong> {selectedPlace.longitude}</p>
          </div>
        ) : (
          <p>지도의 장소를 클릭하여 정보를 확인하세요.</p>
        )}
      </div>
      <div id="map" ref={mapContainer} style={{ width: '70%', height: '500px' }} />
    </div>
  );
};

export default KakaoMap;
