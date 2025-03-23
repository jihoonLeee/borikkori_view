import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BoardList from '../../components/board/BoardList';

const BoardListContainer = () => {
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/post', {
          params: { page, search: searchQuery },
          withCredentials: true,
        });
        var postList = response.data.data;
        setTotalPosts(response.data.totalCount || 0);
        setPosts(postList || []);
      } catch (error) {
        console.error('에러', error);
      }
    };

    fetchPosts();
  }, [page, searchQuery]);

  const handleSearch = () => {
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
    />
  );
};

export default BoardListContainer;
