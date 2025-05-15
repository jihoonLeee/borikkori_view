// 게시판 카테고리 정의
export const BOARD_CATEGORIES = {
  NOTICE: {
    key: "NOTICE",
    name: "공지", 
    description: "커뮤니티 공지사항을 전달합니다.", 
    order: 5,
    isNotice: true
  },
  FREE: {
    key: "FREE",
    name: "자유", 
    description: "자유로운 주제로 소통하는 공간입니다.", 
    order: 2,
    subCategories: {
      NOTICE: {
        key: "FREE_NOTICE",
        name: "공지",
        description: "자유게시판 공지사항",
        order: 0,
        isNotice: true
      }
    }
  },
  INFO: {
    key: "INFO",
    name: "정보공유", 
    description: "반려견 관련 유용한 정보와 팁을 공유합니다.", 
    order: 3,
    subCategories: {
      NOTICE: {
        key: "INFO_NOTICE",
        name: "공지", 
        description: "정보공유 게시판 공지사항",
        order: 0,
        isNotice: true
      }
    }
  },
  FUNNY: {
    key: "FUNNY",
    name: "웃긴", 
    description: "반려견의 웃긴 에피소드와 재미있는 이야기를 나눕니다.", 
    order: 4,
    subCategories: {
      NOTICE: {
        key: "FUNNY_NOTICE",
        name: "공지", 
        description: "웃긴 게시판 공지사항",
        order: 0,
        isNotice: true
      }
    }
  },
  BEGINNER: {
    key: "BEGINNER",
    name: "초보 애견인", 
    description: "반려견 초보자들을 위한 질문과 조언을 공유합니다.", 
    order: 1,
    subCategories: {
      NOTICE: {
        key: "BEGINNER_NOTICE",
        name: "공지", 
        description: "초보 애견인 게시판 공지사항",
        order: 0,
        isNotice: true
      }
    }
  }
};

// 모든 하위 카테고리를 포함한 전체 카테고리 목록을 배열로 반환
export const getAllCategories = () => {
  const allCategories = [];
  
  // 메인 카테고리 추가
  Object.values(BOARD_CATEGORIES).forEach(category => {
    allCategories.push({
      ...category,
      isMain: true
    });
    
    // 하위 카테고리가 있는 경우 추가
    if (category.subCategories) {
      Object.values(category.subCategories).forEach(subCategory => {
        allCategories.push({
          ...subCategory,
          parentKey: category.key,
          isMain: false
        });
      });
    }
  });
  
  // order 기준으로 정렬
  return allCategories.sort((a, b) => b.order - a.order);
};

// 각 메인 카테고리별로 정렬된 목록 반환
export const getOrderedMainCategories = () => {
  return Object.values(BOARD_CATEGORIES)
    .sort((a, b) => b.order - a.order);
};

// 특정 메인 카테고리의 하위 카테고리 목록 반환
export const getSubCategories = (mainCategoryKey) => {
  const mainCategory = BOARD_CATEGORIES[mainCategoryKey];
  if (!mainCategory || !mainCategory.subCategories) {
    return [];
  }
  
  return Object.values(mainCategory.subCategories)
    .sort((a, b) => b.order - a.order);
};

// 카테고리 키로 카테고리 정보 가져오기
export const getCategoryByKey = (categoryKey) => {
  // 메인 카테고리인지 확인
  if (BOARD_CATEGORIES[categoryKey]) {
    return BOARD_CATEGORIES[categoryKey];
  }
  
  // 하위 카테고리인지 확인
  for (const mainCategory of Object.values(BOARD_CATEGORIES)) {
    if (mainCategory.subCategories) {
      for (const subKey in mainCategory.subCategories) {
        const subCategory = mainCategory.subCategories[subKey];
        if (subCategory.key === categoryKey) {
          return {
            ...subCategory,
            parentKey: mainCategory.key
          };
        }
      }
    }
  }
  
  return null;
}; 