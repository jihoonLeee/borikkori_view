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
}) => {
  return (
    <div className="container">
      {/* 모바일 상단 헤더 */}
      {isMobile && (
        <div style={{ padding: '10px', fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center' }}>
          위치 선택하기
        </div>
      )}
      <div className="content">
        <div className="list-section">
          <div className="category-buttons">
            {Object.keys(categories).map((key) => (
              <button
                key={key}
                onClick={() => handleKeywordChange(categories[key])}
                className={selectedCategory === categories[key] ? 'active' : ''}
              >
                {categories[key]}
              </button>
            ))}
          </div>
          <ul>
            {locations.length > 0 ? (
              locations.map((place) => (
                <li key={place.id} onClick={() => handleLocationClick(place)}>
                  <img
                    src={place.imageUrl || `${process.env.PUBLIC_URL}/images/borikkori_brown.png`}
                    alt={place.place_name}
                  />
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
        <div className="map-section" ref={mapContainerRef}>
          <button className="recenter-button" onClick={recenterMap}>
            <img
              src={`${process.env.PUBLIC_URL}/icons/borikkori_brown.png`}
              alt="현재 위치"
            />
          </button>
        </div>
        <div className={`detail-section ${selectedPlace ? 'open' : ''}`}>
          <button className="close-button" onClick={closeDetailSection}>
            닫기
          </button>
          {selectedPlace && (
            <div>
              <h2 style={{ fontWeight: 'bold' }}>{selectedPlace.name}</h2>
              <img
                src={selectedPlace.image || `${process.env.PUBLIC_URL}/images/borikkori_brown.png`}
                alt={selectedPlace.name}
              />
              <p>
                <strong>주소:</strong> {selectedPlace.address}
              </p>
              <div className="reviews">
                <h3 style={{ fontWeight: 'bold' }}>리뷰</h3>
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

export default KakaoMapView;
