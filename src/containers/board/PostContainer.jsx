import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import PostView from '../../components/board/PostView';
import { AuthContext } from '../../contexts/AuthProvider';

const PostContainer = () => {
  const { postId } = useParams();
  const { userInfo } = useContext(AuthContext);
  const [posts, setPosts] = useState({});
  const [content, setContent] = useState('');
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [page, setPage] = useState(1);
  const [prevPostId, setPrevPostId] = useState(null);
  const [nextPostId, setNextPostId] = useState(null);

  const fetchComments = useCallback(async () => {
    const response = await axiosInstance.get('/comment', {
      params: { id: postId, page },
    });
    setComments(response.data.comments);
    setTotalComments(response.data.totalCount);
  }, [postId, page]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const [postResponse, commentResponse, neighborResponse] = await Promise.all([
          axiosInstance.get(`/post/${postId}`),
          axiosInstance.get('/comment', { params: { id: postId, page } }),
          axiosInstance.get(`/post/${postId}/neighbors`),
        ]);
        setPosts(postResponse.data);
        setComments(commentResponse.data.comments);
        setTotalComments(commentResponse.data.totalCount);
        setPrevPostId(neighborResponse.data.prevPostId);
        setNextPostId(neighborResponse.data.nextPostId);
      } catch (error) {
        console.error('게시글 로딩 오류:', error);
      }
    };

    fetchPostData();
  }, [page, postId]);

  const handleLikeSubmit = async () => {
    if (!userInfo) {
      alert('로그인을 해주세요!');
      return;
    }
    try {
      const response = await axiosInstance.post('/post/reaction', {
        postId,
        reactionType: 'LIKE',
      });
      if (response.status === 200) {
        alert('따봉을 눌렀습니다!');
        setPosts((prev) => ({ ...prev, likeCount: response.data.likeCount }));
      }
    } catch (error) {
      console.error('따봉 처리 중 오류 발생', error);
      alert('이미 따봉을 눌렀습니다.');
    }
  };

  const handleCommentLikeSubmit = async (commentId) => {
    if (!userInfo) {
      alert('로그인을 해주세요!');
      return;
    }
    try {
      const response = await axiosInstance.post('/comment/like', {
        commentId,
        reactionType: 'LIKE',
      });
      if (response.status === 200) {
        alert('댓글에 따봉을 눌렀습니다!');
        await fetchComments();
      }
    } catch (error) {
      console.error('댓글 따봉 처리 중 오류 발생', error);
      alert('이미 따봉을 눌렀습니다.');
    }
  };

  const handleCommentSubmit = async () => {
    if (!userInfo) {
      alert('로그인을 해주세요!');
      return;
    }
    try {
      const response = await axiosInstance.post('/comment', {
        postId,
        email: userInfo.email,
        contents: content,
      });
      if (response.status === 201) {
        setContent('');
        await fetchComments();
      }
    } catch (error) {
      console.error('댓글 쓰기 실패!', error);
      alert('댓글 쓰기 실패!');
    }
  };

  return (
    <PostView
      posts={posts}
      handleLikeSubmit={handleLikeSubmit}
      totalComments={totalComments}
      comments={comments}
      handleCommentLikeSubmit={handleCommentLikeSubmit}
      content={content}
      setContent={setContent}
      handleCommentSubmit={handleCommentSubmit}
      prevPostId={prevPostId}
      nextPostId={nextPostId}
    />
  );
};

export default PostContainer;
