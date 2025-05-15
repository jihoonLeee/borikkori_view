import React, { useState, useEffect } from 'react';
import { 
  FormControl, 
  FormLabel, 
  Select, 
  Option, 
  Box, 
  Typography, 
  Tooltip
} from '@mui/joy';
import { 
  BOARD_CATEGORIES, 
  getOrderedMainCategories, 
  getSubCategories 
} from '../../constants/boardCategory';

const BoardCategorySelector = ({ selectedCategory, onCategoryChange }) => {
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const mainCategories = getOrderedMainCategories();

  // 선택된 카테고리 값이 외부에서 변경되는 경우 핸들링
  useEffect(() => {
    if (selectedCategory) {
      // 메인 카테고리인 경우
      if (BOARD_CATEGORIES[selectedCategory]) {
        setMainCategory(selectedCategory);
        setSubCategory('');
        // 해당 메인 카테고리의 하위 카테고리 가져오기
        setAvailableSubCategories(getSubCategories(selectedCategory));
      } 
      // 하위 카테고리인 경우
      else {
        // 하위 카테고리에서 부모 카테고리 찾기
        for (const mainCat of Object.values(BOARD_CATEGORIES)) {
          if (mainCat.subCategories) {
            for (const subCat of Object.values(mainCat.subCategories)) {
              if (subCat.key === selectedCategory) {
                setMainCategory(mainCat.key);
                setSubCategory(selectedCategory);
                setAvailableSubCategories(getSubCategories(mainCat.key));
                break;
              }
            }
          }
        }
      }
    }
  }, [selectedCategory]);

  // 메인 카테고리 변경 핸들러
  const handleMainCategoryChange = (event, newValue) => {
    setMainCategory(newValue);
    
    // 하위 카테고리 목록 업데이트
    const subCategories = getSubCategories(newValue);
    setAvailableSubCategories(subCategories);
    
    // 하위 카테고리 초기화
    setSubCategory('');
    
    // 부모 컴포넌트에 변경 알림
    onCategoryChange(newValue, '');
  };

  // 하위 카테고리 변경 핸들러
  const handleSubCategoryChange = (event, newValue) => {
    setSubCategory(newValue);
    
    // 부모 컴포넌트에 변경 알림
    onCategoryChange(mainCategory, newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%' }}>
      {/* 메인 카테고리 선택 */}
      <FormControl sx={{ minWidth: { xs: '100%', sm: '50%' } }}>
        <FormLabel>게시판 카테고리</FormLabel>
        <Select
          value={mainCategory}
          onChange={handleMainCategoryChange}
          placeholder="카테고리를 선택하세요"
          required
        >
          {mainCategories.map((category) => (
            <Option 
              key={category.key} 
              value={category.key}
            >
              <Tooltip title={category.description} placement="right">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Typography>{category.name}</Typography>
                </Box>
              </Tooltip>
            </Option>
          ))}
        </Select>
      </FormControl>

      {/* 하위 카테고리 선택 (있는 경우에만) */}
      {availableSubCategories.length > 0 && (
        <FormControl sx={{ minWidth: { xs: '100%', sm: '50%' } }}>
          <FormLabel>하위 카테고리</FormLabel>
          <Select
            value={subCategory}
            onChange={handleSubCategoryChange}
            placeholder="선택 (선택사항)"
          >
            <Option value="">선택 안함</Option>
            {availableSubCategories.map((subCat) => (
              <Option 
                key={subCat.key} 
                value={subCat.key}
              >
                <Tooltip title={subCat.description} placement="right">
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography>{subCat.name}</Typography>
                    {subCat.isNotice && (
                      <Typography sx={{ fontSize: '0.75rem', color: 'warning.main' }}>
                        공지
                      </Typography>
                    )}
                  </Box>
                </Tooltip>
              </Option>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

export default BoardCategorySelector; 