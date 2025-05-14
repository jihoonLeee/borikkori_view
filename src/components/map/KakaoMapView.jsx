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
  searchQuery,
  setSearchQuery,
  handleSearch,
  isSearching,
  openList,
  toggleList,
  moveToCurrentLocation,
  isLoadingLocation,
  locationError,
  reviews,
  showReviewForm,
  newReview,
  handleReviewChange,
  handleRatingChange,
  handleReviewSubmit,
  setShowReviewForm
}) => {
  // 모바일 레이아웃
  if (isMobile) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        {/* 지도 전체 영역 */}
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* 상단 고정 헤더: 검색창 + 카테고리 버튼 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '10px',
          backgroundColor: 'rgba(255,255,255,0.95)',
          zIndex: 1100,
        }}>
          {/* 검색창 */}
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            marginBottom: '10px',
            position: 'relative'
          }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="지역을 검색하세요"
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              style={{
                padding: '8px 12px',
                backgroundColor: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: isSearching ? 'wait' : 'pointer',
                opacity: isSearching ? '0.7' : '1',
                fontSize: '0.9rem'
              }}
            >
              {isSearching ? '검색 중...' : '검색'}
            </button>
          </div>

          {/* 카테고리 버튼 */}
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            overflowX: 'auto',
            paddingBottom: '5px'
          }}>
            {Object.keys(categories).map((key) => (
              <button
                key={key}
                onClick={() => handleKeywordChange(categories[key])}
                style={{
                  padding: '6px 12px',
                  border: selectedCategory === categories[key] ? '2px solid #4caf50' : '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: selectedCategory === categories[key] ? '#4caf50' : '#fff',
                  color: selectedCategory === categories[key] ? '#fff' : '#000',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap'
                }}
              >
                {categories[key]}
              </button>
            ))}
          </div>
        </div>

        {/* 현재 위치 버튼 */}
        <div style={{
          position: 'absolute',
          top: 120,
          right: 10,
          zIndex: 1100,
        }}>
          <button
            onClick={moveToCurrentLocation}
            disabled={isLoadingLocation}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'white',
              color: '#4caf50',
              border: 'none',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              cursor: isLoadingLocation ? 'wait' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '14px',
              padding: 0
            }}
            title="현재 위치로 이동"
          >
            {isLoadingLocation ? 
              <span style={{fontSize: '10px', color: '#4caf50'}}>⟳</span> :
              <span style={{fontSize: '14px', color: '#4caf50'}}>📍</span>
            }
          </button>
          {locationError && (
            <div style={{
              position: 'absolute',
              top: '35px',
              right: 0,
              width: '180px',
              padding: '6px',
              backgroundColor: 'rgba(255,0,0,0.7)',
              color: 'white',
              borderRadius: '4px',
              fontSize: '10px'
            }}>
              {locationError}
            </div>
          )}
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
              padding: '8px 16px',
              backgroundColor: '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            {openList ? '리스트 닫기' : '리스트 열기'}
          </button>
        </div>

        {/* 모바일: 리스트 오버레이 (바텀 시트) */}
        {openList && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60vh', // 전체 높이의 60%만 차지
            backgroundColor: 'white',
            zIndex: 1200,
            borderTopLeftRadius: '15px',
            borderTopRightRadius: '15px',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            overflowY: 'auto',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{
              padding: '15px 10px',
              borderBottom: '1px solid #eee',
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              zIndex: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '1rem',
                fontWeight: '600'
              }}>
                주변 장소 ({locations.length})
              </h3>
              <div style={{ 
                width: '40px',
                height: '5px',
                backgroundColor: '#ddd',
                borderRadius: '2px',
                margin: '0 auto',
                position: 'absolute',
                top: '7px',
                left: 0,
                right: 0
              }} />
            </div>
            
            {/* 장소 리스트 */}
            <ul style={{ 
              listStyle: 'none', 
              padding: '0 10px 15px', 
              margin: 0 
            }}>
              {locations.length > 0 ? (
                locations.map((place) => (
                  <li 
                    key={place.id}
                    onClick={() => handleLocationClick(place)}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      marginTop: '10px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start'
                    }}>
                      <div style={{ 
                        minWidth: '50px', 
                        height: '50px',
                        borderRadius: '8px',
                        backgroundColor: '#f3f3f3',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: '12px',
                        overflow: 'hidden'
                      }}>
                        {place.category_name && (
                          <span style={{
                            fontSize: '24px',
                            color: '#4caf50'
                          }}>
                            {place.category_name.includes('동물병원') ? '🏥' : 
                            place.category_name.includes('애견카페') ? '☕' : 
                            place.category_name.includes('애견샵') ? '🛍️' : 
                            place.category_name.includes('공원') ? '🌳' : 
                            place.category_name.includes('호텔') ? '🏨' : '📍'}
                          </span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ 
                          margin: '0 0 4px 0', 
                          fontSize: '0.95rem',
                          fontWeight: '600'
                        }}>
                          {place.place_name}
                        </h4>
                        <p style={{ 
                          margin: 0, 
                          fontSize: '0.85rem', 
                          color: '#666',
                          lineHeight: '1.4'
                        }}>
                          {place.address_name}
                        </p>
                        {place.category_name && (
                          <span style={{
                            display: 'inline-block',
                            fontSize: '0.75rem',
                            color: '#4caf50',
                            backgroundColor: '#e8f5e9',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            marginTop: '4px'
                          }}>
                            {place.category_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li style={{ 
                  padding: '20px',
                  textAlign: 'center',
                  color: '#666',
                  backgroundColor: '#f8f8f8',
                  borderRadius: '8px',
                  marginTop: '10px'
                }}>
                  근처에 해당 장소가 없습니다.
                </li>
              )}
            </ul>
          </div>
        )}

        {/* 모바일: 상세정보 오버레이 */}
        {selectedPlace && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            zIndex: 1300,
            overflowY: 'auto',
            padding: '20px 15px 80px 15px',
          }}>
            <button
              onClick={closeDetailSection}
              style={{
                position: 'fixed',
                top: '10px',
                right: '10px',
                padding: '8px 12px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                zIndex: 1301
              }}
            >
              닫기
            </button>
            
            {/* 작은 지도 표시 영역 */}
            <div style={{ 
              marginTop: '40px', 
              marginBottom: '15px',
              position: 'relative',
              height: '150px',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              backgroundColor: '#f3f3f3'
            }}>
              <div 
                onClick={closeDetailSection}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 5,
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <span style={{
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  color: '#555',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}>
                  지도 크게 보기
                </span>
              </div>
              
              {/* 지도 이미지 대신 위치 정보 표시 */}
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 15px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: '#4caf50'
                }}>
                  <span role="img" aria-label="위치" style={{ marginRight: '5px' }}>📍</span>
                  위치 정보
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: '#555',
                  marginBottom: '5px',
                  wordBreak: 'break-all'
                }}>
                  {selectedPlace.address}
                </div>
                {selectedPlace.phone && (
                  <div style={{
                    fontSize: '0.85rem',
                    color: '#555'
                  }}>
                    <span style={{ fontWeight: '500' }}>연락처:</span> {selectedPlace.phone}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 style={{ 
                fontWeight: 'bold', 
                fontSize: '1.2rem',
                marginBottom: '15px',
                wordBreak: 'keep-all',
                lineHeight: '1.4'
              }}>
                {selectedPlace.name}
              </h2>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '15px'
              }}>
                <img
                  src={selectedPlace.image || `${process.env.PUBLIC_URL}/images/borikkori_brown.png`}
                  alt={selectedPlace.name}
                  style={{ 
                    width: '100%', 
                    maxWidth: '300px', 
                    height: 'auto',
                    borderRadius: '8px'
                  }}
                />
              </div>
              
              <div style={{ 
                marginTop: '15px',
                backgroundColor: '#f8f8f8',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <p style={{ 
                  marginBottom: '10px',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  wordBreak: 'break-all'
                }}>
                  <strong>주소:</strong> {selectedPlace.address}
                </p>
                {selectedPlace.phone && (
                  <p style={{ 
                    marginBottom: '10px',
                    fontSize: '0.95rem'
                  }}>
                    <strong>전화:</strong> {selectedPlace.phone}
                  </p>
                )}
                {selectedPlace.category_name && (
                  <p style={{ 
                    marginBottom: '10px',
                    fontSize: '0.95rem'
                  }}>
                    <strong>카테고리:</strong> {selectedPlace.category_name}
                  </p>
                )}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '5px'
                }}>
                  {selectedPlace.place_url && (
                    <a
                      href={selectedPlace.place_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        textAlign: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      카카오맵에서 보기
                    </a>
                  )}
                </div>
              </div>
              
              {/* 리뷰 섹션 */}
              <div style={{ marginTop: '10px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <h3 style={{ 
                    fontSize: '1.1rem',
                    margin: 0
                  }}>
                    리뷰 ({reviews.length})
                  </h3>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    {showReviewForm ? '취소' : '리뷰 작성하기'}
                  </button>
                </div>
                
                {/* 리뷰 작성 폼 */}
                {showReviewForm && (
                  <form 
                    onSubmit={handleReviewSubmit}
                    style={{
                      backgroundColor: '#f5f5f5',
                      padding: '15px',
                      borderRadius: '8px',
                      marginBottom: '20px'
                    }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <label 
                        htmlFor="userName" 
                        style={{ 
                          display: 'block', 
                          marginBottom: '5px',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                      >
                        닉네임
                      </label>
                      <input
                        type="text"
                        id="userName"
                        name="userName"
                        value={newReview.userName}
                        onChange={handleReviewChange}
                        required
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <label 
                        style={{ 
                          display: 'block', 
                          marginBottom: '5px',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                      >
                        별점
                      </label>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(star)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '1.5rem',
                              color: star <= newReview.rating ? '#ffbb00' : '#ddd',
                              padding: '0 2px'
                            }}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label 
                        htmlFor="content" 
                        style={{ 
                          display: 'block', 
                          marginBottom: '5px',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                      >
                        내용
                      </label>
                      <textarea
                        id="content"
                        name="content"
                        value={newReview.content}
                        onChange={handleReviewChange}
                        required
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        width: '100%'
                      }}
                    >
                      리뷰 등록하기
                    </button>
                  </form>
                )}
                
                {/* 리뷰 목록 */}
                <div>
                  {reviews.length > 0 ? (
                    <ul style={{ 
                      listStyle: 'none', 
                      padding: 0, 
                      margin: 0 
                    }}>
                      {reviews.map((review) => (
                        <li 
                          key={review.id}
                          style={{
                            padding: '15px',
                            borderBottom: '1px solid #eee',
                            marginBottom: '10px'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '8px'
                          }}>
                            <div style={{ fontWeight: '500' }}>
                              {review.userName}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#888' }}>
                              {review.date}
                            </div>
                          </div>
                          
                          <div style={{
                            color: '#ffbb00',
                            fontSize: '0.9rem',
                            marginBottom: '8px'
                          }}>
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </div>
                          
                          <p style={{ 
                            margin: 0,
                            fontSize: '0.95rem',
                            lineHeight: '1.5',
                            color: '#333'
                          }}>
                            {review.content}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: '#888',
                      backgroundColor: '#f8f8f8',
                      borderRadius: '8px'
                    }}>
                      아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 데스크톱 레이아웃
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* 지도 전체 영역 */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* 상단 고정 헤더: 검색창 + 카테고리 버튼 */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        padding: '15px',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1100,
      }}>
        {/* 검색창 */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '15px',
          maxWidth: '600px',
          margin: '0 auto 15px'
        }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="지역을 검색하세요"
            style={{
              flex: 1,
              padding: '10px 15px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: isSearching ? 'wait' : 'pointer',
              opacity: isSearching ? '0.7' : '1',
              fontSize: '1rem'
            }}
          >
            {isSearching ? '검색 중...' : '검색'}
          </button>
        </div>

        {/* 카테고리 버튼 */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {Object.keys(categories).map((key) => (
            <button
              key={key}
              onClick={() => handleKeywordChange(categories[key])}
              style={{
                padding: '8px 16px',
                border: selectedCategory === categories[key] ? '2px solid #4caf50' : '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: selectedCategory === categories[key] ? '#4caf50' : '#fff',
                color: selectedCategory === categories[key] ? '#fff' : '#000',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
            >
              {categories[key]}
            </button>
          ))}
        </div>
      </div>

      {/* 우측: 장소 리스트 */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        width: '300px',
        maxHeight: 'calc(100vh - 40px)',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflowY: 'auto',
        zIndex: 1100,
      }}>
        <div style={{ padding: '15px' }}>
          <h3 style={{ 
            margin: '0 0 15px 0',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            주변 장소
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {locations.length > 0 ? (
              locations.map((place) => (
                <li
                  key={place.id}
                  onClick={() => handleLocationClick(place)}
                  style={{
                    cursor: 'pointer',
                    padding: '12px',
                    borderBottom: '1px solid #eee',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={place.imageUrl || `${process.env.PUBLIC_URL}/images/borikkori_brown.png`}
                      alt={place.place_name}
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        marginRight: '12px' 
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        margin: '0 0 4px 0', 
                        fontSize: '0.95rem',
                        fontWeight: '600'
                      }}>
                        {place.place_name}
                      </h4>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.85rem', 
                        color: '#666',
                        lineHeight: '1.4'
                      }}>
                        {place.address_name}
                      </p>
                      {place.category_name && (
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.75rem',
                          color: '#4caf50',
                          backgroundColor: '#e8f5e9',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          marginTop: '4px'
                        }}>
                          {place.category_name}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li style={{ 
                padding: '20px',
                textAlign: 'center',
                color: '#666'
              }}>
                근처에 해당 장소가 없습니다.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* 데스크톱: 상세정보 패널 */}
      {selectedPlace && (
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          width: '400px',
          maxHeight: 'calc(100vh - 40px)',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
          overflowY: 'auto',
          zIndex: 1200,
        }}>
          <div style={{ 
            position: 'sticky',
            top: 0, 
            backgroundColor: 'white',
            padding: '15px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            zIndex: 10
          }}>
            <h2 style={{ 
              fontWeight: 'bold', 
              fontSize: '1.2rem',
              margin: 0,
              maxWidth: 'calc(100% - 70px)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {selectedPlace.name}
            </h2>
            <button
              onClick={closeDetailSection}
              style={{
                padding: '6px 12px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              닫기
            </button>
          </div>
          
          <div style={{ padding: '0 15px 20px 15px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '15px',
              marginTop: '15px'
            }}>
              <img
                src={selectedPlace.image || `${process.env.PUBLIC_URL}/images/borikkori_brown.png`}
                alt={selectedPlace.name}
                style={{ 
                  width: '100%', 
                  maxWidth: '300px', 
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                }}
              />
            </div>
            
            <div style={{ 
              marginTop: '15px',
              backgroundColor: '#f8f8f8',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p style={{ 
                marginBottom: '10px',
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}>
                <strong>주소:</strong> {selectedPlace.address}
              </p>
              {selectedPlace.phone && (
                <p style={{ 
                  marginBottom: '10px',
                  fontSize: '0.95rem'
                }}>
                  <strong>전화:</strong> {selectedPlace.phone}
                </p>
              )}
              {selectedPlace.category_name && (
                <p style={{ 
                  marginBottom: '10px',
                  fontSize: '0.95rem'
                }}>
                  <strong>카테고리:</strong> {selectedPlace.category_name}
                </p>
              )}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '5px'
              }}>
                {selectedPlace.place_url && (
                  <a
                    href={selectedPlace.place_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      textAlign: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    카카오맵에서 보기
                  </a>
                )}
              </div>
            </div>
            
            {/* 리뷰 섹션 */}
            <div style={{ marginTop: '10px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h3 style={{ 
                  fontSize: '1.1rem',
                  margin: 0
                }}>
                  리뷰 ({reviews.length})
                </h3>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  {showReviewForm ? '취소' : '리뷰 작성하기'}
                </button>
              </div>
              
              {/* 리뷰 작성 폼 */}
              {showReviewForm && (
                <form 
                  onSubmit={handleReviewSubmit}
                  style={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{ marginBottom: '12px' }}>
                    <label 
                      htmlFor="desktop-userName" 
                      style={{ 
                        display: 'block', 
                        marginBottom: '5px',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      닉네임
                    </label>
                    <input
                      type="text"
                      id="desktop-userName"
                      name="userName"
                      value={newReview.userName}
                      onChange={handleReviewChange}
                      required
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <label 
                      style={{ 
                        display: 'block', 
                        marginBottom: '5px',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      별점
                    </label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.5rem',
                            color: star <= newReview.rating ? '#ffbb00' : '#ddd',
                            padding: '0 2px'
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label 
                      htmlFor="desktop-content" 
                      style={{ 
                        display: 'block', 
                        marginBottom: '5px',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      내용
                    </label>
                    <textarea
                      id="desktop-content"
                      name="content"
                      value={newReview.content}
                      onChange={handleReviewChange}
                      required
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      width: '100%'
                    }}
                  >
                    리뷰 등록하기
                  </button>
                </form>
              )}
              
              {/* 리뷰 목록 */}
              <div>
                {reviews.length > 0 ? (
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0, 
                    margin: 0 
                  }}>
                    {reviews.map((review) => (
                      <li 
                        key={review.id}
                        style={{
                          padding: '15px',
                          borderBottom: '1px solid #eee',
                          marginBottom: '10px'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '8px'
                        }}>
                          <div style={{ fontWeight: '500' }}>
                            {review.userName}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#888' }}>
                            {review.date}
                          </div>
                        </div>
                        
                        <div style={{
                          color: '#ffbb00',
                          fontSize: '0.9rem',
                          marginBottom: '8px'
                        }}>
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                        
                        <p style={{ 
                          margin: 0,
                          fontSize: '0.95rem',
                          lineHeight: '1.5',
                          color: '#333'
                        }}>
                          {review.content}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#888',
                    backgroundColor: '#f8f8f8',
                    borderRadius: '8px'
                  }}>
                    아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KakaoMapView;
