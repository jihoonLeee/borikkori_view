import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import BoardList from '../../components/board/BoardList';

const BoardListContainer = () => {
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get('/post', {
          params: {
            page,
            search: searchQuery,
            category: categoryFilter,
          },
        });
        setPosts(response.data.data || []);
        setTotalPosts(response.data.totalCount || 0);
      } catch (error) {
        console.error('게시글을 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchPosts();
  }, [page, searchQuery, categoryFilter]);

  const handleSearch = () => {
    setPage(1);
  };

  const handleCategoryFilterChange = (category) => {
    setCategoryFilter(category);
    setPage(1);
  };

  return (
    <BoardList
      posts={posts}
      totalPosts={totalPosts}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      handleSearch={handleSearch}
      page={page}
      onPageChange={setPage}
      selectedCategoryFilter={categoryFilter}
      onCategoryFilterChange={handleCategoryFilterChange}
    />
  );
};

export default BoardListContainer;
