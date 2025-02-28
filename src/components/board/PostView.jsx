import React from 'react';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import Sheet from '@mui/joy/Sheet';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DateFormat from '../../utils/DateFormat';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';

function CommentCard({ comment, handleCommentLikeSubmit }) {
  return (
    <Card variant="outlined" sx={{ mb: 3, p: 2, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" mb={1}>
        {comment.parentCommentId && (
          <ArrowDropDownIcon fontSize="small" sx={{ mr: 1 }} />
        )}
        <Typography variant="subtitle1" fontWeight="bold">
          {comment.nickName}
        </Typography>
        <Box flexGrow={1} />
        <Typography variant="caption" color="text.secondary">
          {DateFormat(comment.regDate)}
        </Typography>
      </Box>
      <Typography variant="body2" mb={2}>
        {comment.status === "OPEN" ? comment.contents : '삭제된 댓글입니다.'}
      </Typography>
      <Box display="flex" justifyContent="flex-end">
        <Button
          onClick={() => handleCommentLikeSubmit(comment.commentId)}
          size="small"
          color="danger"
          variant="soft"
          startDecorator={<PetsIcon fontSize="small" />}
        >
          {comment.likeCnt}
        </Button>
      </Box>
      {comment.children && comment.children.length > 0 && (
        <Box sx={{ ml: 4, mt: 2 }}>
          {comment.children.map(child => (
            <CommentCard
              key={child.commentId}
              comment={child}
              handleCommentLikeSubmit={handleCommentLikeSubmit}
            />
          ))}
        </Box>
      )}
    </Card>
  );
}

const PostView = ({
  posts,
  handleLikeSubmit,
  totalComments,
  comments,
  handleCommentLikeSubmit,
  content,
  setContent,
  handleCommentSubmit,
}) => {
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
            <Typography fontSize="sm">{posts.nickName}</Typography>
            <Box display="flex" justifyContent="space-between" width="auto" ml={2}>
              <Typography fontSize="sm" mr={0.5}>조회수</Typography>
              <Typography level="h2" fontSize="sm" mr={2}>
                {posts.visitCnt}
              </Typography>
              <Typography fontSize="sm" mr={0.5}>따봉</Typography>
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
          {totalComments > 0 && (
            <Sheet variant="outlined" color="neutral" sx={{ p: 3, mt: 4 }}>
              <Typography variant="h3" component="h2" align="left" fontWeight="bold" mb={3}>
                댓글 {totalComments} 개
              </Typography>
              {comments.map((comment) => (
                <CommentCard
                  key={comment.commentId}
                  comment={comment}
                  handleCommentLikeSubmit={handleCommentLikeSubmit}
                />
              ))}
            </Sheet>
          )}
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
                  onChange={(e) => setContent(e.target.value)}
                  value={content}
                  minRows={3}
                  sx={{
                    minWidth: '100%',
                    fontWeight: 'normal',
                    fontStyle: 'initial',
                    mb: 2,
                  }}
                />
                <Button sx={{ alignSelf: 'flex-end' }} onClick={handleCommentSubmit} className="bg-accent">
                  작성
                </Button>
              </Box>
            </FormControl>
          </Card>
        </Card>
      </section>
    </main>
  );
};

export default PostView;
