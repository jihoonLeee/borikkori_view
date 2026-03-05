/**
 * 지도 관련 상수
 */

// 카테고리 정의 (이모지 + 라벨)
export const CATEGORIES = [
  { key: 'petShop', label: '애견샵', emoji: '🐾', keyword: '애견샵' },
  { key: 'animalHospital', label: '동물병원', emoji: '🏥', keyword: '동물병원' },
  { key: 'petCafe', label: '애견카페', emoji: '☕', keyword: '애견카페' },
  { key: 'dogPark', label: '공원', emoji: '🌳', keyword: '강아지 공원' },
  { key: 'dogHotel', label: '호텔', emoji: '🏨', keyword: '강아지 호텔' },
];

// 카테고리 키워드 → 이모지 매핑
export const CATEGORY_EMOJI_MAP = Object.fromEntries(
  CATEGORIES.map(c => [c.keyword, c.emoji])
);

// 기본 위치 (서울 시청)
export const DEFAULT_LOCATION = { latitude: 37.5665, longitude: 126.9780 };

// 줌 레벨별 검색 반경 (m)
export const ZOOM_RADIUS_MAP = {
  1: 2000, 2: 2000, 3: 1500, 4: 1000, 5: 800,
  6: 500, 7: 500, 8: 300, 9: 200, 10: 100,
};

// localStorage 키
export const LS_KEYS = {
  FAVORITES: 'map_favorites',
  RECENT_SEARCHES: 'map_recent_searches',
  LAST_CATEGORY: 'lastSelectedCategory',
};

// 더미 리뷰
export const DUMMY_REVIEWS = [
  { id: 1, userName: '강아지러버', rating: 5, content: '정말 좋은 곳이에요! 강아지와 함께 편안하게 시간을 보낼 수 있었습니다.', date: '2023-05-15' },
  { id: 2, userName: '멍멍이맘', rating: 4, content: '직원분들이 친절하고 시설도 깨끗해요.', date: '2023-06-20' },
  { id: 3, userName: '포메러브', rating: 3, content: '괜찮은 곳이지만 주차가 조금 불편해요.', date: '2023-07-10' },
];

// 길찾기 URL 생성
export function getDirectionsUrl(place, provider = 'kakao') {
  const { place_name, y, x } = place;
  if (provider === 'kakao') {
    return `https://map.kakao.com/link/to/${encodeURIComponent(place_name)},${y},${x}`;
  }
  // 네이버
  return `https://map.naver.com/v5/search/${encodeURIComponent(place_name)}`;
}

// 한국 행정구역 (검색 자동완성용)
export const KOREA_LOCATIONS = {
  서울: { 강남구: ['청담동', '삼성동', '역삼동'], 강서구: ['화곡동', '등촌동'], 종로구: ['종로1가', '종로2가'] },
  부산: { 해운대구: ['우동', '중동'], 남구: ['용호동', '감만동'], 동래구: ['명륜동', '온천동'] },
  대구: { 달서구: ['성당동', '두류동'], 중구: ['봉산동', '대신동'] },
};
