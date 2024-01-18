import { useParams ,Link} from 'react-router-dom';
import React, { useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import axios from 'axios'; 
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import Box from '@mui/joy/Box';
import DateFormat from '../../Modules/DateFormat';

export default function Post() {
  let { postId } = useParams();
  const [posts, setPosts] = useState([]);

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
  }, []);
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
              <Typography align="left">
              {posts.contents}
              </Typography>
            </Card>
        </section>
      </main>
  );
}