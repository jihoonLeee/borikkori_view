import React, { useState, useRef } from 'react';
import { useMediaQuery } from '@mui/material';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import Sheet from '@mui/joy/Sheet';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import { Link, useParams } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DateFormat from '../../utils/DateFormat';
import ShareIcon from '@mui/icons-material/Share';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import ListIcon from '@mui/icons-material/List';
import { getCategoryByKey } from '../../constants/boardCategory';

function CommentCard({ comment, handleCommentLikeSubmit, handleCommentDelete }) {
  return (
    <Card variant="outlined" sx={{ mb: 2, p: { xs: 1, md: 2 }, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" mb={1}>
        {comment.parentCommentId && (
          <ArrowDropDownIcon fontSize="small" sx={{ mr: 1 }} />
        )}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: { xs: '0.75rem', md: 'inherit' } }}>
          {comment.name}
        </Typography>
        <Box flexGrow={1} />
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', md: 'inherit' } }}>
          {DateFormat(comment.regDate)}
        </Typography>
      </Box>
      <Typography variant="body2" mb={1} sx={{ fontSize: { xs: '0.7rem', md: 'inherit' } }}>
        {comment.status === "OPEN" ? comment.contents : '삭제된 댓글입니다.'}
      </Typography>
      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Button
          onClick={() => handleCommentDelete(comment.commentId)}
          size="sm"
          startDecorator={<DeleteIcon fontSize="small" />}
          variant="outlined"
          sx={{
            color: '#8B5E3C',
            borderColor: '#8B5E3C',
            '&:hover': { borderColor: '#6F4B30', color: '#6F4B30' },
            fontSize: { xs: '0.65rem', md: '0.75rem' },
            py: 0.5
          }}
        >
          삭제
        </Button>
        <Button
          onClick={() => handleCommentLikeSubmit(comment.commentId)}
          size="sm"
          startDecorator={<PetsIcon fontSize="small" />}
          variant="solid"
          sx={{
            bgcolor: '#8B5E3C',
            '&:hover': { bgcolor: '#6F4B30' },
            color: 'white',
            fontSize: { xs: '0.65rem', md: '0.75rem' },
            py: 0.5
          }}
        >
          {comment.likeCnt}
        </Button>
      </Box>
      {comment.children && comment.children.length > 0 && (
        <Box sx={{ ml: 3, mt: 1 }}>
          {comment.children.map(child => (
            <CommentCard
              key={child.commentId}
              comment={child}
              handleCommentLikeSubmit={handleCommentLikeSubmit}
              handleCommentDelete={handleCommentDelete}
            />
          ))}
        </Box>
      )}
    </Card>
  );
}

// 카테고리 정보 가져오는 헬퍼 함수
const getCategoryInfo = (categoryKey) => {
  if (!categoryKey) return { name: '미분류', color: '#999' };
  
  const categoryInfo = getCategoryByKey(categoryKey);
  if (!categoryInfo) return { name: '미분류', color: '#999' };
  
  // 카테고리 정보에 따른 색상 결정
  let color = '#4caf50'; // 기본 색상
  
  if (categoryInfo.isNotice) {
    color = '#f44336'; // 공지사항은 빨간색
  } else if (categoryKey.includes('FREE')) {
    color = '#2196f3'; // 자유 카테고리는 파란색
  } else if (categoryKey.includes('INFO')) {
    color = '#ff9800'; // 정보공유는 주황색
  } else if (categoryKey.includes('FUNNY')) {
    color = '#9c27b0'; // 웃긴은 보라색
  } else if (categoryKey.includes('BEGINNER')) {
    color = '#009688'; // 초보 애견인은 청록색
  }
  
  return {
    name: categoryInfo.name,
    color: color,
    isNotice: categoryInfo.isNotice
  };
};

const PostView = ({
  posts,
  handleLikeSubmit,
  totalComments,
  comments,
  handleCommentLikeSubmit,
  content,
  setContent,
  handleCommentSubmit,
  handleCommentDelete,
  handleShare,
  prevPostId,
  nextPostId,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <main className="flex flex-col items-center bg-secondary min-h-screen" style={{ padding: isMobile ? '8px' : '20px' }}>
      <section className="w-full max-w-6xl mt-8 bg-white rounded-lg shadow-md overflow-hidden" style={{ margin: isMobile ? '8px' : '20px auto' }}>
        <div style={{ padding: isMobile ? '12px' : '24px' }}>
          {/* 헤더 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '10px' : '20px' }}>
            <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: '600', color: '#2C1810' }}>
              정보 공유
            </Typography>
            <Button
              component={Link}
              to="/board"
              startDecorator={<ListIcon />}
              variant="outlined"
              size={isMobile ? 'sm' : 'md'}
              sx={{
                color: '#8B5E3C',
                borderColor: '#8B5E3C',
                '&:hover': { borderColor: '#6F4B30', color: '#6F4B30' },
                fontSize: isMobile ? '0.65rem' : '0.875rem'
              }}
            >
              목록으로
            </Button>
          </div>
          {/* 게시글 내용 */}
          <Card variant="outlined" sx={{ p: isMobile ? 2 : 4, bgcolor: 'background.surface' }}>
            <Box display="flex" justifyContent="space-between" mb={isMobile ? 1 : 2}>
              <Box display="flex" alignItems="center" gap={1}>
                {posts.category && (
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: isMobile ? '0.7rem' : '0.8rem',
                      fontWeight: getCategoryInfo(posts.category).isNotice ? 'bold' : 'normal',
                      backgroundColor: `${getCategoryInfo(posts.category).color}20`,
                      color: getCategoryInfo(posts.category).color,
                    }}
                  >
                    {getCategoryInfo(posts.category).name}
                  </Box>
                )}
                <Typography
                  component="h3"
                  sx={{
                    fontSize: isMobile ? '1rem' : '1.25rem',
                    fontWeight: 'bold',
                    color: '#2C1810'
                  }}
                >
                  {posts.title}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: isMobile ? '0.65rem' : '0.875rem', color: 'text.secondary' }}>
                {DateFormat(posts.regDate)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={isMobile ? 1 : 3}>
              <Typography sx={{ fontSize: isMobile ? '0.65rem' : '0.875rem', color: 'text.secondary' }}>
                작성자 : {posts.name}
              </Typography>
              <Box display="flex" gap={isMobile ? 1 : 2}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Typography sx={{ fontSize: isMobile ? '0.55rem' : '0.75rem', color: 'text.secondary' }}>
                    조회수
                  </Typography>
                  <Typography sx={{ fontSize: isMobile ? '0.55rem' : '0.75rem', fontWeight: 'medium' }}>
                    {posts.visitCnt}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Typography sx={{ fontSize: isMobile ? '0.55rem' : '0.75rem', color: 'text.secondary' }}>
                    따봉
                  </Typography>
                  <Typography sx={{ fontSize: isMobile ? '0.55rem' : '0.75rem', fontWeight: 'medium' }}>
                    {posts.likeCnt}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ my: isMobile ? 1 : 3 }} />
            <Box display="flex" justifyContent="flex-end" mb={isMobile ? 1 : 2}>
              <Button
                onClick={handleShare}
                startDecorator={<ShareIcon sx={{ fontSize: isMobile ? '0.8rem' : '1rem' }} />}
                variant="outlined"
                size={isMobile ? 'sm' : 'md'}
                sx={{
                  color: '#8B5E3C',
                  borderColor: '#8B5E3C',
                  '&:hover': { borderColor: '#6F4B30', color: '#6F4B30' },
                  fontSize: isMobile ? '0.65rem' : '0.75rem',
                  py: isMobile ? 0.3 : 0.5,
                  px: isMobile ? 1 : 1.5,
                }}
              >
                공유
              </Button>
            </Box>
            <Typography
              component="div"
              sx={{
                mb: isMobile ? 2 : 4,
                '& img': { maxWidth: '100%', height: 'auto' },
                '& p': { mb: 2 },
                lineHeight: 1.6,
                fontSize: isMobile ? '0.65rem' : '0.875rem'
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: posts.contents }} />
            </Typography>
            <Box display="flex" flexDirection="column" gap={isMobile ? 1 : 2} mb={isMobile ? 2 : 3}
              sx={{ opacity: 0.8, transition: 'opacity 0.2s', '&:hover': { opacity: 1 } }}
            >
              <Box display="flex" justifyContent="center" gap={isMobile ? 0.5 : 1}>
                <Button
                  component={Link}
                  to={prevPostId ? `/post/${prevPostId}` : '#'}
                  disabled={!prevPostId}
                  startDecorator={<NavigateBeforeIcon sx={{ fontSize: isMobile ? '0.8rem' : '1rem' }} />}
                  variant="outlined"
                  size={isMobile ? 'sm' : 'md'}
                  sx={{
                    color: '#8B5E3C',
                    borderColor: '#8B5E3C',
                    '&:hover': { borderColor: '#6F4B30', color: '#6F4B30' },
                    fontSize: isMobile ? '0.65rem' : '0.75rem',
                    py: isMobile ? 0.3 : 0.5,
                    minHeight: '24px',
                    opacity: prevPostId ? 1 : 0.5
                  }}
                >
                  이전글
                </Button>
                <Button
                  component={Link}
                  to={nextPostId ? `/post/${nextPostId}` : '#'}
                  disabled={!nextPostId}
                  endDecorator={<NavigateNextIcon sx={{ fontSize: isMobile ? '0.8rem' : '1rem' }} />}
                  variant="outlined"
                  size={isMobile ? 'sm' : 'md'}
                  sx={{
                    color: '#8B5E3C',
                    borderColor: '#8B5E3C',
                    '&:hover': { borderColor: '#6F4B30', color: '#6F4B30' },
                    fontSize: isMobile ? '0.65rem' : '0.75rem',
                    py: isMobile ? 0.3 : 0.5,
                    minHeight: '24px',
                    opacity: nextPostId ? 1 : 0.5
                  }}
                >
                  다음글
                </Button>
              </Box>
            </Box>
            <Box display="flex" justifyContent="center" mb={isMobile ? 2 : 4}>
              <Button
                sx={{
                  px: isMobile ? 2 : 4,
                  bgcolor: '#4caf50',
                  '&:hover': { bgcolor: '#357a38' },
                  color: 'white',
                  transition: 'transform 0.5s',
                  '&:hover': { transform: 'scale(1.05)' },
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                }}
                startDecorator={<PetsIcon />}
                onClick={handleLikeSubmit}
              >
                따봉 {posts.likeCnt}
              </Button>
            </Box>
            {totalComments > 0 && (
              <Sheet
                variant="outlined"
                sx={{
                  p: isMobile ? 2 : 3,
                  mt: isMobile ? 2 : 4,
                  borderRadius: 'sm',
                  bgcolor: 'background.level1'
                }}
              >
                <Typography
                  level="h6"
                  sx={{
                    mb: isMobile ? 1 : 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'text.primary',
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                  }}
                >
                  댓글 <Typography component="span" sx={{ color: '#4caf50' }}>{totalComments}</Typography>
                </Typography>
                {comments.map((comment) => (
                  <CommentCard
                    key={comment.commentId}
                    comment={comment}
                    handleCommentLikeSubmit={handleCommentLikeSubmit}
                    handleCommentDelete={handleCommentDelete}
                  />
                ))}
              </Sheet>
            )}
            <Card
              variant="outlined"
              sx={{
                mt: isMobile ? 2 : 4,
                p: isMobile ? 2 : 3,
                bgcolor: 'background.level1'
              }}
            >
              <FormControl>
                <FormLabel sx={{ mb: 2, color: 'text.primary', fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                  댓글 작성
                </FormLabel>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography level="body2" sx={{ color: 'text.secondary', fontSize: isMobile ? '0.65rem' : 'inherit' }}>
                      {content.length}/500자
                    </Typography>
                    <IconButton
                      size="sm"
                      variant="plain"
                      sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      <PreviewIcon sx={{ fontSize: '1.25rem' }} />
                    </IconButton>
                  </Box>
                  {showPreview ? (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 'sm',
                        bgcolor: 'background.surface',
                        minHeight: '100px',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      {content || '내용이 없습니다.'}
                    </Box>
                  ) : (
                    <Textarea
                      placeholder="댓글을 입력해주세요..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      minRows={3}
                      maxLength={500}
                      sx={{
                        width: '100%',
                        mb: 2,
                        '&:hover': { borderColor: '#8B5E3C' },
                        '&:focus-within': { borderColor: '#8B5E3C', boxShadow: '0 0 0 3px rgba(139, 94, 60, 0.1)' }
                      }}
                    />
                  )}
                  <Button
                    sx={{
                      alignSelf: 'flex-end',
                      bgcolor: '#4caf50',
                      '&:hover': { bgcolor: '#357a38' },
                      color: 'white',
                      px: 3,
                      fontSize: isMobile ? '0.75rem' : 'inherit'
                    }}
                    onClick={handleCommentSubmit}
                  >
                    댓글 작성
                  </Button>
                </Box>
              </FormControl>
            </Card>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default PostView;
