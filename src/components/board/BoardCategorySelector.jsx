import React, { useState, useEffect } from 'react';
import {
  BOARD_CATEGORIES,
  getOrderedMainCategories,
  getSubCategories,
} from '../../constants/boardCategory';

/**
 * 카테고리 선택 컴포넌트 (MUI Joy 제거, 순수 Tailwind)
 * - 메인 카테고리 선택 시 해당 하위 카테고리 드롭다운 표시
 */
const BoardCategorySelector = ({ selectedCategory, onCategoryChange }) => {
  const [mainCategory, setMainCategory]           = useState('');
  const [subCategory, setSubCategory]             = useState('');
  const [availableSubs, setAvailableSubs]         = useState([]);
  const mainCategories = getOrderedMainCategories();

  /* 외부에서 selectedCategory 변경 시 동기화 */
  useEffect(() => {
    if (!selectedCategory) return;
    if (BOARD_CATEGORIES[selectedCategory]) {
      setMainCategory(selectedCategory);
      setSubCategory('');
      setAvailableSubs(getSubCategories(selectedCategory));
    } else {
      for (const mainCat of Object.values(BOARD_CATEGORIES)) {
        if (mainCat.subCategories) {
          for (const subCat of Object.values(mainCat.subCategories)) {
            if (subCat.key === selectedCategory) {
              setMainCategory(mainCat.key);
              setSubCategory(selectedCategory);
              setAvailableSubs(getSubCategories(mainCat.key));
              break;
            }
          }
        }
      }
    }
  }, [selectedCategory]);

  const handleMainChange = (e) => {
    const val = e.target.value;
    setMainCategory(val);
    const subs = getSubCategories(val);
    setAvailableSubs(subs);
    setSubCategory('');
    onCategoryChange(val, '');
  };

  const handleSubChange = (e) => {
    const val = e.target.value;
    setSubCategory(val);
    onCategoryChange(mainCategory, val);
  };

  const selectClass =
    'w-full px-3 py-2.5 rounded-xl text-sm ' +
    'bg-surface dark:bg-dark-surface3 ' +
    'border border-surface-3 dark:border-dark-border ' +
    'text-content-primary dark:text-white ' +
    'focus:outline-none focus:ring-2 focus:ring-primary/40 ' +
    'transition duration-150 cursor-pointer';

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      {/* 메인 카테고리 */}
      <div className="flex-1 flex flex-col gap-1">
        <label className="text-sm font-medium text-content-primary dark:text-white">
          게시판 카테고리 <span className="text-red-500">*</span>
        </label>
        <select value={mainCategory} onChange={handleMainChange} className={selectClass} required>
          <option value="" disabled>카테고리를 선택하세요</option>
          {mainCategories.map((cat) => (
            <option key={cat.key} value={cat.key} title={cat.description}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* 하위 카테고리 (있을 때만) */}
      {availableSubs.length > 0 && (
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-sm font-medium text-content-primary dark:text-white">
            하위 카테고리
            <span className="ml-1 text-xs text-content-disabled dark:text-gray-500">(선택사항)</span>
          </label>
          <select value={subCategory} onChange={handleSubChange} className={selectClass}>
            <option value="">선택 안함</option>
            {availableSubs.map((sub) => (
              <option key={sub.key} value={sub.key} title={sub.description}>
                {sub.name}{sub.isNotice ? ' 📢' : ''}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default BoardCategorySelector;
