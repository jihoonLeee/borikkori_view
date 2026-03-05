import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sanitizeHtml } from '../../utils/sanitize';
import DateFormat from '../../utils/DateFormat';
import { getCategoryInfo } from '../../utils/categoryUtils';

/* ── 댓글 카드 ────────────────────────────────────────────────── */
function CommentCard({ comment, handleCommentLikeSubmit, handleCommentDelete }) {
  const isDeleted = comment.status !== 'OPEN';
  const isReply   = !!comment.parentCommentId;

  return (
    <div className={`${isReply ? 'ml-6 border-l-2 border-surface-3 dark:border-dark-border pl-4' : ''}`}>
      <div className="py-4 border-b border-surface-3 dark:border-dark-border last:border-0">
        {/* 메타 정보 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {isReply && (
              <svg className="w-3 h-3 text-content-disabled" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            )}
            <span className="text-sm font-semibold text-content-primary dark:text-white">
              {comment.name}
            </span>
          </div>
          <span className="text-xs text-content-secondary dark:text-gray-400">
            {DateFormat(comment.regDate)}
          </span>
        </div>

        {/* 내용 */}
        <p className={`text-sm leading-relaxed mb-3 ${isDeleted ? 'text-content-disabled dark:text-gray-500 italic' : 'text-content-primary dark:text-white'}`}>
          {isDeleted ? '삭제된 댓글입니다.' : comment.contents}
        </p>

        {/* 액션 버튼 */}
        {!isDeleted && (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleCommentDelete(comment.commentId)}
              className="text-xs font-medium text-content-secondary dark:text-gray-400
                         hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              삭제
            </button>
            <button
              onClick={() => handleCommentLikeSubmit(comment.commentId)}
              className="flex items-center gap-1 text-xs font-semibold
                         px-3 py-1 rounded-full
                         bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light
                         hover:bg-primary/20 dark:hover:bg-primary/30
                         transition-colors duration-150"
            >
              🐾 {comment.likeCount}
            </button>
          </div>
        )}
      </div>

      {/* 대댓글 */}
      {comment.children?.length > 0 && (
        <div>
          {comment.children.map((child) => (
            <CommentCard
              key={child.commentId}
              comment={child}
              handleCommentLikeSubmit={handleCommentLikeSubmit}
              handleCommentDelete={handleCommentDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── PostView 메인 컴포넌트 ──────────────────────────────────── */
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
  const categoryKey = posts.category?.categoryType;
  const catInfo     = categoryKey ? getCategoryInfo(categoryKey) : null;

  return (
    <main className="min-h-screen bg-secondary dark:bg-dark-surface transition-colors px-4 py-8">
      <div className="max-w-3xl mx-auto">

        {/* ── 상단: 목록 버튼 ────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-bold text-content-primary dark:text-white">
            게시글
          </h1>
          <Link to="/board" className="btn btn-secondary text-sm">
            ☰ 목록으로
          </Link>
        </div>

        {/* ── 게시글 본문 ───────────────────────────── */}
        <article className="bg-surface dark:bg-dark-surface2
                            rounded-2xl shadow-card border border-surface-3 dark:border-dark-border
                            p-6 md:p-8 mb-4">

          {/* 카테고리 + 제목 */}
          <div className="mb-4">
            {catInfo && (
              <span
                className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
                style={{ color: catInfo.color, backgroundColor: `${catInfo.color}18` }}
              >
                {catInfo.name}
              </span>
            )}
            <h2 className="text-xl md:text-2xl font-bold text-content-primary dark:text-white leading-tight">
              {posts.title}
            </h2>
          </div>

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6
                          pb-4 border-b border-surface-3 dark:border-dark-border">
            <div className="flex items-center gap-3 text-sm text-content-secondary dark:text-gray-400">
              <span className="font-medium">{posts.name}</span>
              <span>·</span>
              <span>{DateFormat(posts.regDate)}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-content-secondary dark:text-gray-400">
              <span>조회 {posts.visitCount}</span>
              <span>·</span>
              <span>따봉 {posts.likeCount}</span>
              {/* 공유 버튼 */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-xs text-content-secondary dark:text-gray-400
                           hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                </svg>
                공유
              </button>
            </div>
          </div>

          {/* 본문 HTML */}
          <div
            className="prose prose-sm max-w-none text-content-primary dark:text-white
                       [&_img]:max-w-full [&_img]:rounded-lg [&_p]:mb-4 [&_p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(posts.contents) }}
          />

          {/* 따봉 버튼 */}
          <div className="flex justify-center mt-8 mb-4">
            <button
              onClick={handleLikeSubmit}
              className="flex items-center gap-2 px-8 py-3 rounded-full
                         bg-accent/10 text-accent hover:bg-accent/20
                         dark:bg-accent/20 dark:hover:bg-accent/30
                         font-bold text-lg transition-all duration-150
                         hover:scale-105 active:scale-95"
            >
              🐾 따봉 {posts.likeCount}
            </button>
          </div>

          {/* 이전글 / 다음글 */}
          <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-surface-3 dark:border-dark-border">
            <Link
              to={prevPostId ? `/post/${prevPostId}` : '#'}
              className={`btn btn-secondary text-sm ${!prevPostId ? 'opacity-40 pointer-events-none' : ''}`}
            >
              ← 이전글
            </Link>
            <Link
              to={nextPostId ? `/post/${nextPostId}` : '#'}
              className={`btn btn-secondary text-sm ${!nextPostId ? 'opacity-40 pointer-events-none' : ''}`}
            >
              다음글 →
            </Link>
          </div>
        </article>

        {/* ── 댓글 목록 ─────────────────────────────── */}
        {totalComments > 0 && (
          <section className="bg-surface dark:bg-dark-surface2
                              rounded-2xl shadow-card border border-surface-3 dark:border-dark-border
                              p-6 mb-4">
            <h3 className="text-base font-bold text-content-primary dark:text-white mb-4">
              댓글{' '}
              <span className="text-accent font-bold">{totalComments}</span>
            </h3>
            {comments.map((comment) => (
              <CommentCard
                key={comment.commentId}
                comment={comment}
                handleCommentLikeSubmit={handleCommentLikeSubmit}
                handleCommentDelete={handleCommentDelete}
              />
            ))}
          </section>
        )}

        {/* ── 댓글 작성 ─────────────────────────────── */}
        <section className="bg-surface dark:bg-dark-surface2
                            rounded-2xl shadow-card border border-surface-3 dark:border-dark-border
                            p-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-base font-bold text-content-primary dark:text-white">
              댓글 작성
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-content-secondary dark:text-gray-400">
                {content.length}/500자
              </span>
              <button
                onClick={() => setShowPreview((v) => !v)}
                className="text-xs font-medium text-primary dark:text-primary-light
                           hover:underline transition-colors"
              >
                {showPreview ? '편집' : '미리보기'}
              </button>
            </div>
          </div>

          {showPreview ? (
            <div className="min-h-[100px] px-4 py-3 rounded-xl
                            bg-surface-2 dark:bg-dark-surface3
                            border border-surface-3 dark:border-dark-border
                            text-sm text-content-primary dark:text-white leading-relaxed whitespace-pre-wrap">
              {content || <span className="text-content-disabled italic">내용이 없습니다.</span>}
            </div>
          ) : (
            <textarea
              rows={4}
              maxLength={500}
              placeholder="댓글을 입력해주세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input resize-none mb-4"
            />
          )}

          <div className="flex justify-end mt-3">
            <button onClick={handleCommentSubmit} className="btn btn-accent">
              댓글 작성
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PostView;
