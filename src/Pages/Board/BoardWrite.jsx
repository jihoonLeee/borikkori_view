import React, { useState,useContext, useEffect } from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import FormatBold from '@mui/icons-material/FormatBold';
import FormatItalic from '@mui/icons-material/FormatItalic';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Check from '@mui/icons-material/Check';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../Modules/AuthProvider';
import axios from 'axios';

export default function BoardWrite() {
  const [italic, setItalic] = useState(false);
  const [fontWeight, setFontWeight] = useState('normal');
  const [anchorEl, setAnchorEl] = useState(null);
  const { userInfo,authenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      const response = await axios.post('/posts/write', {
        title: document.getElementsByName('Primary')[0].value,
        contents: document.getElementsByName('Secondary')[0].value,
        email:userInfo.email,
      },
      {withCredentials: true}
      );
      if (response.status === 201) {
        alert('글이 성공적으로 등록되었습니다.');
        navigate("/mainBoard");
        window.location.reload();
      }
    } catch (error) {
      console.error('글 등록에 실패했습니다.', error);
      alert('글 등록에 실패했습니다.');
    }
  }

  useEffect(() => {
    if (!authenticated) {
      alert("로그인 해주세요.");
      navigate('/login');
    }
  }, [authenticated, navigate]);

  return (
    <main className="flex flex-col items-center px-4 md:px-6 dark:bg-rose-900 min-h-screen">
      <section className="w-full max-w-3xl mt-8 bg-white dark:bg-rose-950 rounded-lg shadow-md overflow-hidden">
        <h2 className="text-2xl font-semibold text-rose-900 dark:text-rose-50">정보 공유 게시판 글 쓰기</h2>
        <FormControl>
          <Box
            sx={{
                py: 2,
                display: 'grid',
                gap: 2,
                alignItems: 'center',
                flexWrap: 'wrap',
            }}
          >
            <Textarea
              name="Primary"
              placeholder="제목을 입력해주세요."
              variant="outlined"
            />
          </Box>
        </FormControl>

        <FormControl>
          <Textarea
            name="Secondary"
            placeholder="내용을 작성해주세요..."
            minRows={20}
            endDecorator={ <Box
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
              <Button sx={{ ml: 'auto' }} onClick={handleSubmit}>글쓰기</Button>
              </Box>}
            sx={{
              minWidth: 300,
              fontWeight,
              fontStyle: italic ? 'italic' : 'initial',
            }}
          />
        </FormControl>
      </section>
    </main>
  );
}