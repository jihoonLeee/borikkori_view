import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import DateFormat from '../../modules/DateFormat';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import Sheet from '@mui/joy/Sheet';
import PetsIcon from '@mui/icons-material/Pets';
import { AuthContext } from '../../modules/AuthProvider';
import Grid from '@mui/material/Grid';

export default function Post() {
  const { postId } = useParams();
  const { userInfo } = useContext(AuthContext);
  const [posts, setPosts] = useState({});
  const [content, setContent] = useState('');
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [page, setPage] = useState(1);

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
      const response = await axios.post(`/post/${postId}/like`, {}, { withCredentials: true });
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
      const response = await axios.post(`/comment/${commentId}/like`, {}, { withCredentials: true });
      if (response.status === 200) {
        alert('댓글에 따봉을 눌렀습니다!');
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === commentId ? { ...comment, likeCnt: response.data.likeCnt } : comment
          )
        );
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
      const response = await axios.post('/comment', {
        postId: postId,
        email: userInfo.email,
        contents: content,
      }, { withCredentials: true });

      if (response.status === 201) {
        setComments(prevComments => [...prevComments, response.data]);
        setTotalComments(prevTotal => prevTotal + 1);
        setContent(''); // Clear the textarea after successful submission
      }
    } catch (error) {
      console.error('댓글 쓰기 실패!', error);
      alert('댓글 쓰기 실패!');
    }
  };

  return (
    <main className="flex flex-col items-center px-4 md:px-6 dark:bg-rose-900 min-h-screen">
      <section className="w-full max-w-6xl mt-8 bg-white dark:bg-rose-950 rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-rose-900 dark:text-rose-50">정보 공유</h2>
        </div>
        <hr className="my-4 border-rose-200 dark:border-rose-800" />

        <Card variant="outlined">
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography level="h3" fontSize="xl">
              {posts.title}
            </Typography>
            <Box display="flex" justifyContent="space-between" width="auto" ml={2}>
              <Typography fontSize="sm" mr={0.5}>
                {DateFormat(posts.regDate)}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography fontSize="sm">
              {posts.nickName}
            </Typography>
            <Box display="flex" justifyContent="space-between" width="auto" ml={2}>
              <Typography fontSize="sm" mr={0.5}>
                조회수
              </Typography>
              <Typography level="h2" fontSize="sm" mr={2}>
                {posts.visitCnt}
              </Typography>
              <Typography fontSize="sm" mr={0.5}>
                따봉
              </Typography>
              <Typography level="h2" fontSize="sm">
                {posts.likeCnt}
              </Typography>
            </Box>
          </Box>
          <hr className="my-4 border-rose-900 dark:border-rose-200" />
          <Typography align="left" mb={5}>
            <div dangerouslySetInnerHTML={{ __html: posts.contents }} />
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              sx={{ width: 130 }}
              startDecorator={<PetsIcon />}
              color="danger"
              onClick={handleLikeSubmit}
              variant="soft"
            >
              따봉 {posts.likeCnt}
            </Button>
          </Box>

          {totalComments > 0 &&
            <Sheet variant="outlined" color="neutral" sx={{ p: 1 }}>
              <Typography variant="h2" align="left" mb={1} fontWeight="bold">
                댓글 {totalComments} 개
              </Typography>
              {comments.map((comment, index) => (
                <div key={index}>
                  <Grid container justifyContent="space-between">
                    <Grid item xs={2} container alignItems="flex-start">
                      {comment.nickName}
                    </Grid>
                    <Grid item xs={8} container alignItems="flex-start">
                      {comment.status === "OPEN" && comment.contents}
                    </Grid>
                    <Grid item xs={2}>
                      <Grid container direction="column">
                        <Grid item>
                          {DateFormat(comment.regDate)}
                        </Grid>
                        <Grid item>
                          <Button
                            onClick={() => handleCommentLikeSubmit(comment.id)}
                            color='none'
                            variant="soft"
                          >
                            <PetsIcon />
                          </Button>  {comment.likeCnt}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <hr className="my-4 border-gray-100" />
                </div>
              ))}
            </Sheet>}
          <Card variant="soft">
            <FormControl>
              <FormLabel>댓글 쓰기</FormLabel>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  width: '100%',
                }}
              >
                <Textarea
                  placeholder="댓글을 입력해주세요.."
                  onChange={e => setContent(e.target.value)}
                  value={content}
                  minRows={3}
                  sx={{
                    minWidth: '100%',
                    fontWeight: 'normal',
                    fontStyle: 'initial',
                    mb: 2,
                  }}
                />
                <Button sx={{ alignSelf: 'flex-end' }} onClick={handleCommentSubmit}>작성</Button>
              </Box>
            </FormControl>
          </Card>
        </Card>
      </section>
    </main>
  );
}
