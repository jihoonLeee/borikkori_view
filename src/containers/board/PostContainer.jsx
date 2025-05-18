import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postResponse = await axios.get(`/post/${postId}`, { withCredentials: true });
        setPosts(postResponse.data);
        const commentResponse = await axios.get('/comment', {
          params: { id: postId, page: page },
          withCredentials: true,
        });
        setTotalComments(commentResponse.data.totalCount);
        setComments(commentResponse.data.comments);

        // 이웃 게시글(이전글, 다음글) 데이터 가져오기
        const neighborResponse = await axios.get(`/post/${postId}/neighbors`, { withCredentials: true });
        const { prevPostId, nextPostId } = neighborResponse.data;
        setPrevPostId(prevPostId);
        setNextPostId(nextPostId);

      } catch (error) {
        console.error("에러", error);
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
      const response = await axios.post(`/post/reaction`, {
        postId : postId,
        reactionType: "LIKE"
      }, 
        { withCredentials: true });
      if (response.status === 200) {
        alert('따봉을 눌렀습니다!');
        setPosts(prevPosts => ({
          ...prevPosts,
          likeCnt: response.data.likeCnt,
        }));
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
      const response = await axios.post(`/comment/like`, {
        commentId : commentId,
        reactionTyep : "LIKE"
      }, { withCredentials: true });
      if (response.status === 200) {
        alert('댓글에 따봉을 눌렀습니다!');
        // Option: 전체 댓글 재조회 로직 추가 가능
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
      const response = await axios.post(
        '/comment',
        { postId: postId, email: userInfo.email, contents: content },
        { withCredentials: true }
      );
      if (response.status === 201) {
        setContent('');
        // Option: 전체 댓글 재조회 로직 추가 가능
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
