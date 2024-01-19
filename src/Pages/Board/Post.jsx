import { useParams ,Link} from 'react-router-dom';
import React, { useState, useEffect} from 'react';
import axios from 'axios'; 
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import DateFormat from '../../Modules/DateFormat';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import FormatBold from '@mui/icons-material/FormatBold';
import FormatItalic from '@mui/icons-material/FormatItalic';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Check from '@mui/icons-material/Check';
import Sheet from '@mui/joy/Sheet';

export default function Post() {
  let { postId } = useParams();
  const [posts, setPosts] = useState([]);
  const [italic, setItalic] = React.useState(false);
  const [fontWeight, setFontWeight] = React.useState('normal');
  const [anchorEl, setAnchorEl] = React.useState(null);

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
              <Typography align="left" mb={5}>
              {posts.contents}
              </Typography>

              <Sheet variant="outlined" color="neutral" sx={{ p: 1 }}>
                댓글 나오는 곳 // 댓글 1개이상부터 보임
              </Sheet>
              <Card variant="soft">
              <FormControl>
            <FormLabel>댓글 쓰기</FormLabel>
            <Textarea
              placeholder="Type something here…"
              minRows={3}
              endDecorator={
                <Box
                  sx={{
                    display: 'flex',
                    gap: 'var(--Textarea-paddingBlock)',
                    pt: 'var(--Textarea-paddingBlock)',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    flex: 'auto',
                  }}
                >
                  <IconButton
                    variant="plain"
                    color="neutral"
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                  >
                    <FormatBold />
                    <KeyboardArrowDown fontSize="md" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    size="sm"
                    placement="bottom-start"
                    sx={{ '--ListItemDecorator-size': '24px' }}
                  >
                    {['200', 'normal', 'bold'].map((weight) => (
                      <MenuItem
                        key={weight}
                        selected={fontWeight === weight}
                        onClick={() => {
                          setFontWeight(weight);
                          setAnchorEl(null);
                        }}
                        sx={{ fontWeight: weight }}
                      >
                        <ListItemDecorator>
                          {fontWeight === weight && <Check fontSize="sm" />}
                        </ListItemDecorator>
                        {weight === '200' ? 'lighter' : weight}
                      </MenuItem>
                    ))}
                  </Menu>
                  <IconButton
                    variant={italic ? 'soft' : 'plain'}
                    color={italic ? 'primary' : 'neutral'}
                    aria-pressed={italic}
                    onClick={() => setItalic((bool) => !bool)}
                  >
                    <FormatItalic />
                  </IconButton>
                  <Button sx={{ ml: 'auto' }}>작성</Button>
                </Box>
              }
              sx={{
                minWidth: 300,
                fontWeight,
                fontStyle: italic ? 'italic' : 'initial',
              }}
            />
            </FormControl>
            </Card>
            </Card>
          
        </section>
      
      </main>
  );
}