import React from 'react';

const KakaoMapView = ({
  isMobile,
  mapContainerRef,
  locations,
  selectedPlace,
  closeDetailSection,
  recenterMap,
  handleKeywordChange,
  categories,
  selectedCategory,
  handleLocationClick,
  // 지역 선택 UI props
  selectedProvince,
  selectedCity,
  selectedDistrict,
  setSelectedProvince,
  setSelectedCity,
  setSelectedDistrict,
  handleLocationSearch,
  koreaLocations,
    // 모바일 리스트/상세정보 토글 상태
  openList,
  toggleList,
}) => {
  // 모바일 레이아웃
  if (isMobile) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        {/* 지도 전체 영역 */}
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* 상단 고정 헤더: 카테고리 버튼 + 지역 선택 UI */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '10px',
          backgroundColor: 'rgba(255,255,255,0.95)',
          zIndex: 1100,
        }}>
          {/* 카테고리 버튼 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
            {Object.keys(categories).map((key) => (
              <button
                key={key}
                onClick={() => handleKeywordChange(categories[key])}
                style={{
                  padding: '6px 10px',
                  border: selectedCategory === categories[key] ? '2px solid #4caf50' : '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: selectedCategory === categories[key] ? '#4caf50' : '#fff',
                  color: selectedCategory === categories[key] ? '#fff' : '#000',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  '&:hover': { backgroundColor: selectedCategory === categories[key] ? '#357a38' : '#e8f5e9' }
                }}
              >
                {categories[key]}
              </button>
            ))}
          </div>
          {/* 지역 선택 UI (항상 보임) */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setSelectedCity('');
                setSelectedDistrict('');
              }}
              style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}
            >
              <option value="">시/도</option>
              {Object.keys(koreaLocations).map((province) => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedDistrict('');
              }}
              disabled={!selectedProvince}
              style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}
            >
              <option value="">시/군/구</option>
              {selectedProvince &&
                Object.keys(koreaLocations[selectedProvince]).map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
            </select>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedCity}
              style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}
            >
              <option value="">읍/면/동</option>
              {selectedProvince &&
                selectedCity &&
                koreaLocations[selectedProvince][selectedCity].map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
            </select>
            <button
              onClick={handleLocationSearch}
              disabled={!selectedProvince || !selectedCity || !selectedDistrict}
              style={{
                padding: '8px 12px',
                backgroundColor: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                opacity: (!selectedProvince || !selectedCity || !selectedDistrict) ? '0.5' : '1',
                '&:hover': { backgroundColor: '#357a38' }
              }}
            >
              검색
            </button>
          </div>
        </div>

        {/* 하단: 리스트 토글 버튼 */}
        <div style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          right: 10,
          zIndex: 1100,
          display: 'flex',
          justifyContent: 'center',
        }}>
          <button
            onClick={toggleList}
            style={{
              padding: '8px 12px',
              backgroundColor: '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              '&:hover': { backgroundColor: '#357a38' }
            }}
          >
            {openList ? '리스트 닫기' : '리스트 열기'}
          </button>
        </div>

        {/* 모바일: 리스트 오버레이 (바텀 시트) */}
        {openList && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            maxHeight: '70%',
            backgroundColor: '#fff',
            zIndex: 1200,
            overflowY: 'auto',
            borderTopLeftRadius: '15px',
            borderTopRightRadius: '15px',
            padding: '20px',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.2)',
          }}>
            {/* 리스트 헤더 (드래그 핸들 느낌) */}
            <div style={{
              width: '40px',
              height: '5px',
              backgroundColor: '#ccc',
              borderRadius: '5px',
              margin: '0 auto 10px',
            }} />
            {/* 장소 리스트 */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {locations.length > 0 ? (
                locations.map((place) => (
                  <li
                    key={place.id}
                    onClick={() => {
                      handleLocationClick(place);
                      // 상세정보 오버레이는 별도로 처리 (아래 참조)
                    }}
                    style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #eee' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={place.imageUrl || `${process.env.PUBLIC_URL}/images/borikkori_brown.png`}
                        alt={place.place_name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '10px' }}
                      />
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}>{place.place_name}</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>{place.address_name}</p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li style={{ padding: '10px' }}>근처에 해당 장소가 없습니다.</li>
              )}
            </ul>
          </div>
        )}

        {/* 모바일: 상세정보 오버레이 (선택 시, 리스트 위에 90% nav 형태) */}
        {selectedPlace && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '90%',
            height: '100%',
            backgroundColor: '#fff',
            zIndex: 1300,
            overflowY: 'auto',
            padding: '20px',
            boxShadow: '2px 0 5px rgba(0,0,0,0.3)',
          }}>
            <button
              onClick={closeDetailSection}
              style={{
                padding: '5px 10px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                marginBottom: '10px',
                cursor: 'pointer',
              }}
            >
              닫기
            </button>
            <h2 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedPlace.name}</h2>
            <img
              src={selectedPlace.image || `${process.env.PUBLIC_URL}/images/borikkori_brown.png`}
              alt={selectedPlace.name}
              style={{ width: '100%', maxWidth: '300px', margin: '10px 0' }}
            />
            <p><strong>주소:</strong> {selectedPlace.address}</p>
            <div>
              <h3 style={{ fontWeight: 'bold' }}>리뷰</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {selectedPlace.reviews && selectedPlace.reviews.length > 0 ? (
                  selectedPlace.reviews.map((review, index) => (
                    <li key={index} style={{ fontSize: '0.8rem' }}>{review}</li>
                  ))
                ) : (
                  <li style={{ fontSize: '0.8rem' }}>리뷰가 없습니다.</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 데스크톱 레이아웃: 두 컬럼 레이아웃 (왼쪽 35% 상세정보, 오른쪽 65% 메인 영역)
  return (
    <div style={{ display: 'flex', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* 왼쪽 영역 (35%) - 리스트와 상세정보 슬라이드 */}
      <div style={{ width: '35%', position: 'relative', overflowY: 'auto', borderRight: '1px solid #ccc', paddingRight: '10px' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {locations.length > 0 ? (
            locations.map((place) => (
              <li
                key={place.id}
                onClick={() => handleLocationClick(place)}
                style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #eee' }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={place.imageUrl || `${process.env.PUBLIC_URL}/images/borikkori_brown.png`}
                    alt={place.place_name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                  />
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}>{place.place_name}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>{place.address_name}</p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li style={{ padding: '10px' }}>근처에 해당 장소가 없습니다.</li>
          )}
        </ul>
        {selectedPlace && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            zIndex: 1000,
            transform: 'translateX(0)',
            transition: 'transform 0.3s ease-in-out',
            overflowY: 'auto',
            padding: '20px',
            boxShadow: '2px 0 5px rgba(0,0,0,0.3)',
          }}>
            <button
              onClick={closeDetailSection}
              style={{
                padding: '5px 10px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                marginBottom: '10px',
                cursor: 'pointer',
              }}
            >
              닫기
            </button>
            <h2 style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{selectedPlace.name}</h2>
            <img
              src={selectedPlace.image || `${process.env.PUBLIC_URL}/images/borikkori_brown.png`}
              alt={selectedPlace.name}
              style={{ width: '100%', margin: '10px 0' }}
            />
            <p><strong>주소:</strong> {selectedPlace.address}</p>
            <div>
              <h3 style={{ fontWeight: 'bold' }}>리뷰</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {selectedPlace.reviews && selectedPlace.reviews.length > 0 ? (
                  selectedPlace.reviews.map((review, index) => (
                    <li key={index} style={{ fontSize: '0.8rem' }}>{review}</li>
                  ))
                ) : (
                  <li style={{ fontSize: '0.8rem' }}>리뷰가 없습니다.</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
      {/* 오른쪽 영역 (65%) - 지도 및 상단 지역 선택/카테고리 UI */}
      <div style={{ width: '65%', paddingLeft: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
          {Object.keys(categories).map((key) => (
            <button
              key={key}
              onClick={() => handleKeywordChange(categories[key])}
              style={{
                padding: '8px 12px',
                border: selectedCategory === categories[key] ? '2px solid #4caf50' : '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: selectedCategory === categories[key] ? '#4caf50' : '#fff',
                color: selectedCategory === categories[key] ? '#fff' : '#000',
                cursor: 'pointer',
                '&:hover': { backgroundColor: selectedCategory === categories[key] ? '#357a38' : '#e8f5e9' }
              }}
            >
              {categories[key]}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', marginBottom: '20px' }}>
          <select
            value={selectedProvince}
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setSelectedCity('');
              setSelectedDistrict('');
            }}
            style={{ flex: 1, padding: '10px' }}
          >
            <option value="">시/도 선택</option>
            {Object.keys(koreaLocations).map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedDistrict('');
            }}
            disabled={!selectedProvince}
            style={{ flex: 1, padding: '10px' }}
          >
            <option value="">시/군/구 선택</option>
            {selectedProvince &&
              Object.keys(koreaLocations[selectedProvince]).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedCity}
            style={{ flex: 1, padding: '10px' }}
          >
            <option value="">읍/면/동 선택</option>
            {selectedProvince &&
              selectedCity &&
              koreaLocations[selectedProvince][selectedCity].map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
          </select>
          <button
            onClick={handleLocationSearch}
            disabled={!selectedProvince || !selectedCity || !selectedDistrict}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              opacity: (!selectedProvince || !selectedCity || !selectedDistrict) ? '0.5' : '1',
              '&:hover': { backgroundColor: '#357a38' }
            }}
          >
            검색
          </button>
        </div>
        <div ref={mapContainerRef} style={{ width: '100%', height: '500px' }} />
      </div>
    </div>
  );
};

export default KakaoMapView;
