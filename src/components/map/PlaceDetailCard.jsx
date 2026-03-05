import React, { useState } from 'react';
import { getDirectionsUrl, DUMMY_REVIEWS, CATEGORY_EMOJI_MAP } from '../../utils/mapConstants';

/**
 * 장소 상세 카드 — 구글맵/카카오맵 스타일
 * 액션 버튼 아이콘 행 + 길찾기 + 리뷰
 */
export default function PlaceDetailCard({
  place,
  onClose,
  isFavorite,
  onToggleFavorite,
  reviews: propReviews,
}) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ userName: '', rating: 5, content: '' });
  const [reviews, setReviews] = useState(propReviews || DUMMY_REVIEWS);
  const [copied, setCopied] = useState(false);

  if (!place) return null;

  const emoji = CATEGORY_EMOJI_MAP[
    Object.keys(CATEGORY_EMOJI_MAP).find(k => place.category_name?.includes(k))
  ] || '📍';

  const categoryShort = place.category_name?.split(' > ').pop() || '';

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0';

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(place.address_name);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handleShare = async () => {
    const shareData = { title: place.place_name, text: `${place.place_name} - ${place.address_name}`, url: place.place_url || window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`); alert('링크가 복사되었습니다!'); }
    } catch {}
  };

  const handleSubmitReview = () => {
    if (!reviewForm.content.trim()) return;
    setReviews(prev => [{
      id: Date.now(), userName: reviewForm.userName || '익명',
      rating: reviewForm.rating, content: reviewForm.content,
      date: new Date().toISOString().split('T')[0],
    }, ...prev]);
    setReviewForm({ userName: '', rating: 5, content: '' });
    setShowReviewForm(false);
  };

  const Stars = ({ rating, interactive, onChange, size = 'text-base' }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} type="button" disabled={!interactive}
          onClick={() => interactive && onChange?.(s)}
          className={`${size} ${interactive ? 'cursor-pointer' : 'cursor-default'}
                      ${s <= rating ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-600'}`}>
          ★
        </button>
      ))}
    </div>
  );

  // 액션 버튼 (구글맵 스타일)
  const ActionButton = ({ icon, label, onClick, href, highlight }) => {
    const cls = `flex flex-col items-center gap-1.5 min-w-[3.5rem]`;
    const iconCls = `w-10 h-10 rounded-full flex items-center justify-center text-base transition-all
                     ${highlight
                       ? 'bg-primary dark:bg-accent text-white'
                       : 'bg-gray-100 dark:bg-dark-surface3 text-content-primary dark:text-white hover:bg-gray-200 dark:hover:bg-dark-border'
                     }`;
    const inner = (<><div className={iconCls}>{icon}</div><span className="text-[10px] text-content-secondary dark:text-gray-400">{label}</span></>);
    if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>;
    return <button onClick={onClick} className={cls}>{inner}</button>;
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-dark-surface2 overflow-hidden">
      {/* ── 헤더 ── */}
      <div className="relative p-4 pb-3">
        {/* 닫기 */}
        <button onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-gray-100/80 dark:bg-dark-surface3/80
                     hover:bg-gray-200 dark:hover:bg-dark-border transition-colors z-10">
          <svg className="w-4 h-4 text-content-secondary dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 장소명 + 카테고리 */}
        <div className="flex items-start gap-3 pr-10">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-accent/15
                          flex items-center justify-center text-2xl flex-shrink-0">
            {emoji}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-content-primary dark:text-white leading-tight">
              {place.place_name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {categoryShort && (
                <span className="text-[11px] px-2 py-0.5 rounded-full
                                 bg-primary/10 dark:bg-accent/15 text-primary dark:text-accent font-medium">
                  {categoryShort}
                </span>
              )}
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-xs font-bold text-content-primary dark:text-white">{avgRating}</span>
                <span className="text-[11px] text-content-disabled">({reviews.length})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 컨텐츠 (스크롤) ── */}
      <div className="flex-1 overflow-y-auto">
        {/* 액션 버튼 행 (구글맵 스타일) */}
        <div className="flex items-start justify-around px-4 py-3 border-y border-gray-100 dark:border-dark-border">
          <ActionButton icon="📞" label="전화" href={place.phone ? `tel:${place.phone}` : undefined}
                        onClick={!place.phone ? () => alert('전화번호가 없습니다') : undefined} />
          <ActionButton icon="🗺️" label="길찾기" href={getDirectionsUrl(place, 'kakao')} highlight />
          <ActionButton icon={isFavorite ? '❤️' : '🤍'} label={isFavorite ? '저장됨' : '저장'}
                        onClick={() => onToggleFavorite(place)} />
          <ActionButton icon="📤" label="공유" onClick={handleShare} />
        </div>

        {/* 정보 섹션 */}
        <div className="px-4 py-3 space-y-3">
          {/* 주소 */}
          <div className="flex items-start gap-3">
            <svg className="w-[18px] h-[18px] mt-0.5 text-content-secondary dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-content-primary dark:text-gray-300">{place.road_address_name || place.address_name}</p>
              {place.road_address_name && place.address_name !== place.road_address_name && (
                <p className="text-[11px] text-content-disabled dark:text-gray-500 mt-0.5">(지번) {place.address_name}</p>
              )}
              <button onClick={copyAddress}
                      className="text-[11px] text-primary dark:text-accent hover:underline mt-0.5 font-medium">
                {copied ? '✓ 복사됨' : '주소 복사'}
              </button>
            </div>
          </div>

          {/* 전화 */}
          {place.phone && (
            <div className="flex items-center gap-3">
              <svg className="w-[18px] h-[18px] text-content-secondary dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href={`tel:${place.phone}`} className="text-sm text-primary dark:text-accent hover:underline font-medium">
                {place.phone}
              </a>
            </div>
          )}

          {/* 거리 */}
          {place.distance && (
            <div className="flex items-center gap-3">
              <svg className="w-[18px] h-[18px] text-content-secondary dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-sm text-content-primary dark:text-gray-300">
                현재 위치에서 {Number(place.distance) >= 1000
                  ? `${(Number(place.distance) / 1000).toFixed(1)}km`
                  : `${place.distance}m`}
              </span>
            </div>
          )}

          {/* 길찾기 버튼들 */}
          <div className="flex gap-2 pt-1">
            <a href={getDirectionsUrl(place, 'kakao')} target="_blank" rel="noopener noreferrer"
               className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold
                          bg-primary dark:bg-accent text-white hover:opacity-90 transition-opacity">
              <span>🗺️</span> 카카오 길찾기
            </a>
            <a href={getDirectionsUrl(place, 'naver')} target="_blank" rel="noopener noreferrer"
               className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold
                          bg-gray-100 dark:bg-dark-surface3 text-content-primary dark:text-white
                          hover:bg-gray-200 dark:hover:bg-dark-border transition-colors">
              <span>🧭</span> 네이버 지도
            </a>
          </div>
        </div>

        {/* ── 리뷰 섹션 ── */}
        <div className="border-t border-gray-100 dark:border-dark-border mt-1">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-content-primary dark:text-white">리뷰</h3>
              <span className="text-xs text-content-disabled bg-gray-100 dark:bg-dark-surface3 px-1.5 py-0.5 rounded-full">
                {reviews.length}
              </span>
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-xs font-semibold text-primary dark:text-accent hover:underline">
              {showReviewForm ? '취소' : '+ 리뷰 작성'}
            </button>
          </div>

          {showReviewForm && (
            <div className="px-4 pb-3 space-y-2.5">
              <input type="text" placeholder="닉네임 (선택)"
                value={reviewForm.userName}
                onChange={(e) => setReviewForm(p => ({ ...p, userName: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl bg-gray-50 dark:bg-dark-surface3
                           border border-gray-200 dark:border-dark-border
                           text-content-primary dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-accent/30" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-content-secondary dark:text-gray-400">별점</span>
                <Stars rating={reviewForm.rating} interactive onChange={(s) => setReviewForm(p => ({ ...p, rating: s }))} />
              </div>
              <textarea placeholder="리뷰를 작성해주세요"
                value={reviewForm.content}
                onChange={(e) => setReviewForm(p => ({ ...p, content: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-xl bg-gray-50 dark:bg-dark-surface3
                           border border-gray-200 dark:border-dark-border
                           text-content-primary dark:text-white resize-none
                           focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-accent/30" />
              <button onClick={handleSubmitReview}
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-primary dark:bg-accent text-white
                           hover:opacity-90 transition-opacity">
                등록
              </button>
            </div>
          )}

          <div className="px-4 pb-4 space-y-2.5">
            {reviews.map(r => (
              <div key={r.id} className="p-3.5 rounded-2xl bg-gray-50 dark:bg-dark-surface3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 dark:bg-accent/15
                                    flex items-center justify-center text-[10px] font-bold
                                    text-primary dark:text-accent">
                      {r.userName.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-content-primary dark:text-white">{r.userName}</span>
                  </div>
                  <span className="text-[11px] text-content-disabled dark:text-gray-500">{r.date}</span>
                </div>
                <Stars rating={r.rating} size="text-xs" />
                <p className="mt-1.5 text-sm text-content-secondary dark:text-gray-300 leading-relaxed">{r.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
