import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lime } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useMediaQuery from '@mui/material/useMediaQuery';

const theme = createTheme({
  palette: {
    primary: lime,
    secondary: {
      main: '#F43F5E',
      head: '#d5bbb9'
    },
  },
});

export default function DogBoard() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.secondary.head,
      color: theme.palette.common.black,
      textAlign: 'center',
      fontSize: isMobile ? '0.75rem' : '1rem', 
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: isMobile ? '0.75rem' : '1rem', 
      textAlign: 'center',
      padding: isMobile ? '4px' : '8px',
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/post', {
          params: { page: page, search: searchQuery },
          withCredentials: true,
        });
        setTotalPosts(response.data.totalCount || 0);
        setPosts(response.data.posts || []);
      } catch (error) {
        console.error('에러', error);
      }
    };

    fetchPosts();
  }, [page, searchQuery]);

  const handleSearch = () => {
    setPage(1); // 새로운 검색 시 페이지를 1로 리셋
  };

  const totalPages = Math.ceil(totalPosts / 10);

  return (
    <main className="flex flex-col items-center px-4 md:px-6 dark:bg-rose-900 min-h-screen">
      <section className="w-full max-w-6xl mt-8 bg-white dark:bg-rose-950 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-rose-900 dark:text-rose-50">정보 공유</h2>
            <ThemeProvider theme={theme}>
              <Button variant="contained" color="secondary" component={Link} to="/boardWrite">
                <span className="text-sm font-semibold leading-6 text-gray-900 no-underline">글쓰기</span>
              </Button>
            </ThemeProvider>
          </div>
          <hr className="my-4 border-rose-200 dark:border-rose-800" />
          <TableContainer component={Paper} style={{ overflowX: 'hidden' }}>
            <Table sx={{ minWidth: isMobile ? 0 : 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>제목</StyledTableCell>
                  <StyledTableCell>닉네임</StyledTableCell>
                  <StyledTableCell>날짜</StyledTableCell>
                  <StyledTableCell>조회수</StyledTableCell>
                  <StyledTableCell>따봉</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((post) => (
                  <StyledTableRow key={post.postId}>
                    <StyledTableCell component="th" scope="row">
                      <Link to={`/post/${post.postId}`}>
                        {post.title}
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell>{post.nickName}</StyledTableCell>
                    <StyledTableCell>{formatDate(post.regDate)}</StyledTableCell>
                    <StyledTableCell>{post.visitCnt}</StyledTableCell>
                    <StyledTableCell>{post.likeCnt}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="flex justify-between mt-4">
            <ThemeProvider theme={theme}>
              <div className="flex border rounded h-9">
                <input 
                  className="p-2 flex-grow w-28" 
                  type="text" 
                  placeholder="검색하세요" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  className="bg-blue-500 text-white p-2 rounded-r" 
                  color="secondary"
                  onClick={handleSearch}
                >
                  검색
                </Button>
              </div>
            </ThemeProvider>
          </div>
          <div className="flex justify-center mt-4">
            <Pagination 
              count={totalPages} 
              variant="outlined" 
              shape="rounded"
              page={page}
              onChange={(event, value) => setPage(value)} 
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function formatDate(dateString) {
  const inputDate = new Date(dateString);
  const today = new Date();

  let formattedDate;

  if (inputDate.getDate() === today.getDate() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear()) {
    formattedDate = `${String(inputDate.getHours()).padStart(2, '0')}:${String(inputDate.getMinutes()).padStart(2, '0')}`;
  } else {
    formattedDate = `${inputDate.getFullYear()}.${String(inputDate.getMonth() + 1).padStart(2, '0')}.${String(inputDate.getDate()).padStart(2, '0')}`;
  }
  return formattedDate;
}
