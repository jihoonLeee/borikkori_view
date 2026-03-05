import { getCategoryByKey } from '../constants/boardCategory';

const CATEGORY_COLORS = {
  NOTICE: '#f44336',
  FREE: '#2196f3',
  INFO: '#ff9800',
  FUNNY: '#9c27b0',
  BEGINNER: '#009688',
  DEFAULT: '#4caf50',
};

/**
 * 카테고리 키로 표시 정보(이름, 색상, 공지 여부)를 반환합니다.
 * @param {string} categoryKey
 * @returns {{ name: string, color: string, isNotice: boolean }}
 */
export const getCategoryInfo = (categoryKey) => {
  if (!categoryKey) return { name: '미분류', color: '#999', isNotice: false };

  const categoryInfo = getCategoryByKey(categoryKey);
  if (!categoryInfo) return { name: '미분류', color: '#999', isNotice: false };

  let color = CATEGORY_COLORS.DEFAULT;

  if (categoryInfo.isNotice) {
    color = CATEGORY_COLORS.NOTICE;
  } else if (categoryKey.includes('FREE')) {
    color = CATEGORY_COLORS.FREE;
  } else if (categoryKey.includes('INFO')) {
    color = CATEGORY_COLORS.INFO;
  } else if (categoryKey.includes('FUNNY')) {
    color = CATEGORY_COLORS.FUNNY;
  } else if (categoryKey.includes('BEGINNER')) {
    color = CATEGORY_COLORS.BEGINNER;
  }

  return {
    name: categoryInfo.name,
    color,
    isNotice: !!categoryInfo.isNotice,
  };
};
