import React from 'react';
import Button from '@mui/material/Button';
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
import useMediaQuery from '@mui/material/useMediaQuery';
import DateFormat from '../../utils/DateFormat';

const StyledTableCell = styled(TableCell)(() => ({
  // 헤더 셀에만 bold 적용
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'var(--tw-bg-secondary)', // Tailwind의 secondary (크림색)
    color: 'black',
    textAlign: 'center',
    fontSize: '1rem',
    fontWeight: 'bold',
    padding: '8px',
    wordBreak: 'break-word',
  },
  // 바디 셀은 일반 글씨체 유지
  [`&.${tableCellClasses.body}`]: {
    fontSize: '1rem',
    textAlign: 'center',
    padding: '8px',
    wordBreak: 'break-word',
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f9f9f9',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const BoardList = ({
  posts,
  searchQuery,
  setSearchQuery,
  handleSearch,
  totalPosts,
  page,
  onPageChange,
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const totalPages = Math.ceil(totalPosts / 10);

  if (isMobile) {
    return (
      <main className="board-container flex flex-col items-center bg-secondary min-h-screen px-2">
        <div className="w-full max-w-md mt-8">
          {/* 헤더 영역 */}
          <div className="flex flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary">정보 공유</h2>
            <Button
              variant="contained"
              component={Link}
              to="/boardWrite"
              size="small"
              sx={{
                bgcolor: '#F08080',
                '&:hover': { bgcolor: '#F08080' },
              }}
              className="text-sm font-semibold"
            >
              글쓰기
            </Button>
          </div>
          {/* 게시글 카드 목록 */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.postId} className="p-4 bg-white rounded-lg shadow-md">
                <Link to={`/post/${post.postId}`} className="block">
                  <h3 className="text-lg font-bold text-primary break-words">
                    {post.title}
                  </h3>
                </Link>
                <div className="mt-2 text-xs text-gray-500">
                  <span>{DateFormat(post.regDate)}</span>
                  <span className="mx-1">·</span>
                  <span>{post.nickName}</span>
                  <span className="mx-1">·</span>
                  <span>조회수 {post.visitCnt}</span>
                  <span className="mx-1">·</span>
                  <span>따봉 {post.likeCnt}</span>
                </div>
              </div>
            ))}
          </div>
          {/* 검색 영역 */}
          <div className="board-search mt-4 w-full max-w-md">
            <div className="flex flex-row items-center gap-2">
              <input
                className="border border-gray-300 rounded text-sm p-2 w-full"
                type="text"
                placeholder="검색하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                size="small"
                sx={{
                  bgcolor: '#F08080',
                  '&:hover': { bgcolor: '#F08080' },
                }}
                className="text-sm"
              >
                검색
              </Button>
            </div>
          </div>
          {/* 페이지네이션 */}
          <div className="mt-4 flex justify-center">
            <Pagination
              count={totalPages}
              variant="outlined"
              shape="rounded"
              page={page}
              onChange={(event, value) => onPageChange(value)}
              size="small"
            />
          </div>
        </div>
      </main>
    );
  } else {
    return (
      <main className="board-container flex flex-col items-center bg-secondary min-h-screen px-4 md:px-6">
        <section className="board-section w-full max-w-6xl mt-8 bg-white dark:bg-rose-950 rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            {/* 헤더 영역 */}
            <div className="board-header flex flex-row justify-between items-center w-full mb-4">
              <h2 className="board-title text-xl sm:text-2xl font-bold text-primary dark:text-rose-50">
                정보 공유
              </h2>
              <Button
                variant="contained"
                component={Link}
                to="/boardWrite"
                size="medium"
                sx={{
                  bgcolor: '#F08080',
                  '&:hover': { bgcolor: '#F08080' },
                }}
              >
                글쓰기
              </Button>
            </div>

            <hr className="board-divider my-4 border-gray-300 dark:border-gray-700" />

            {/* 테이블 영역 */}
            <TableContainer component={Paper} className="board-table-container" style={{ overflowX: 'hidden' }}>
              <Table className="w-full table-fixed" sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell style={{ width: '70%' }}>제목</StyledTableCell>
                    <StyledTableCell style={{ width: '9%' }}>닉네임</StyledTableCell>
                    <StyledTableCell style={{ width: '9%' }}>날짜</StyledTableCell>
                    <StyledTableCell style={{ width: '6%' }}>조회수</StyledTableCell>
                    <StyledTableCell style={{ width: '6%' }}>따봉</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {posts.map((post) => (
                    <StyledTableRow key={post.postId}>
                      <StyledTableCell component="th" scope="row">
                        <Link to={`/post/${post.postId}`} className="hover:text-accent break-words">
                          {post.title}
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell>{post.nickName}</StyledTableCell>
                      <StyledTableCell>{DateFormat(post.regDate)}</StyledTableCell>
                      <StyledTableCell>{post.visitCnt}</StyledTableCell>
                      <StyledTableCell>{post.likeCnt}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* 검색 영역 */}
            <div className="board-search mt-4 w-full max-w-lg flex flex-row items-center gap-2">
              <input
                className="search-input border border-gray-300 rounded text-sm p-2 w-full"
                type="text"
                placeholder="검색하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                size="medium"
                sx={{
                  bgcolor: '#F08080',
                  '&:hover': { bgcolor: '#F08080' },
                }}
              >
                검색
              </Button>
            </div>

            {/* 페이지네이션 */}
            <div className="board-pagination flex justify-center mt-4">
              <Pagination
                count={totalPages}
                variant="outlined"
                shape="rounded"
                page={page}
                onChange={(event, value) => onPageChange(value)}
                size="medium"
              />
            </div>
          </div>
        </section>
      </main>
    );
  }
};

export default BoardList;
