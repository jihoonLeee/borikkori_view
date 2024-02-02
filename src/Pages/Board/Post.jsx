import { useParams ,Link} from 'react-router-dom';
import React, { useState, useEffect,useContext} from 'react';
import axios from 'axios'; 
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import DateFormat from '../../Modules/DateFormat';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Sheet from '@mui/joy/Sheet';
import PetsIcon from '@mui/icons-material/Pets';
import { AuthContext } from '../../Modules/AuthProvider';
import Grid from '@mui/material/Grid';

export default function Post() {
  let { postId } = useParams();
  const [posts, setPosts] = useState([]);
  const [italic, setItalic] = useState(false);
  const [fontWeight, setFontWeight] = useState('normal');
  const { userInfo } = useContext(AuthContext);
  const [page, setPage] = useState(1); 
  const [totalComments, setTotalComments] = useState(0);
  const [content, setContent] = useState('');
  const [comments, setComments] = useState([]);
  const likeSubmit = async () => {
    if(userInfo==null){
      alert('로그인을 해주세요!');
    }else{
      try {
        const response = await axios.post('/posts/like', {
          postId: postId,
          email: userInfo.email,
        },
        {withCredentials: true}
        );
        if (response.status === 200) {
          alert('따봉을 눌렀습니다!');
          setPosts(response.data);
        }
      } catch (error) {
        console.error('이미 따봉을 눌렀습니다.', error);
        alert('이미 따봉을 눌렀습니다.');
      }
    }
  }
  const commentLikeSubmit = async () => {
    if(userInfo==null){
      alert('로그인을 해주세요!');
    }else{
      try {
        const response = await axios.post('/comment/like', {
          commentId: "",
          email: userInfo.email,
        },
        {withCredentials: true}
        );
        if (response.status === 200) {
          alert('따봉을 눌렀습니다!');
          setPosts(response.data);
        }
      } catch (error) {
        console.error('이미 따봉을 눌렀습니다.', error);
        alert('이미 따봉을 눌렀습니다.');
      }
    }
  }
  
  const totalPage = () => {
    let pages = totalComments/10;
    return Math.ceil(pages);
  }
  useEffect(() => {
    axios.get('/posts/post', {
      params: {
        id: postId 
      },
      withCredentials: true
    }) 
    .then(response => {
      setPosts(response.data);
    })
    .catch(error => {
      console.error("에러", error);
    });

    axios.get('/comments/list', {
      params: {
        id : postId,
        page: page
      },
      withCredentials: true
    }) 
    .then(response => {
      setTotalComments(response.data.totalCount);
      setComments(response.data.comments);
    })
    .catch(error => {
      console.error('에러', error);
    })
  }, [page]);


  const commentSubmit = async () => {
    if(userInfo==null){
      alert('로그인을 해주세요!');
    }else{
      try {
        const response = await axios.post('/comments/write', {
          postId: postId,
          email: userInfo.email,
          comment : content
        },
        {withCredentials: true}
        );
        if (response.status === 201) {
          window.location.reload();        
        }
      } catch (error) {
        console.error('댓글 쓰기 실패!', error);
        alert('댓글 쓰기 실패!');
      }
    }
  }
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
                  <Typography fontSize="sm" >
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
              {posts.contents}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Button
                  sx={{ width: 130 }}
                  startDecorator={<PetsIcon />}
                  color="danger"
                  onClick={likeSubmit}
                  variant="soft"
                >
                  따봉   {posts.likeCnt}
                </Button>
              </Box>
           
              {totalComments > 0 &&  
              <Sheet variant="outlined" color="neutral" sx={{ p: 1 }}>
              <Typography variant="h2" align="left" mb={1} style={{fontWeight: "bold"}}>
                  댓글 {totalComments} 개
              </Typography>
              { comments.map((comment, index) => (
                <div key={index}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={2} container alignItems="flex-start">
                        {comment.nickName}
                    </Grid>
                    <Grid item xs={8} container alignItems="flex-start">
                        {comment.status === "OPEN" && comment.content}
                    </Grid>
                    <Grid item xs={2}>
                        <Grid container direction="column">
                            <Grid item>
                                {DateFormat(comment.regDate)}
                            </Grid>
                            <Grid item>
                            <Button
                              onClick={commentLikeSubmit}
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
                alignItems: 'stretch', 
              }}
            >
              <Textarea
                placeholder="댓글을 입력해주세요.."
                onChange={e => setContent(e.target.value)}
                minRows={3}
                sx={{
                  display: 'flex',
                  flex:'auto',
                  minWidth: 300,
                  fontWeight,
                  mr:1,
                  fontStyle: italic ? 'italic' : 'initial',
                }}
              />
              <Button sx={{ ml: 'auto'}} onClick={commentSubmit}>작성</Button>
            </Box>
            </FormControl>
            </Card>
            </Card>
          
        </section>
      
      </main>
  );
}
