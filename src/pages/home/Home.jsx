import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
    <div className="space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`card bg-white p-6 ${className}`}>
    {children}
  </div>
);

export default function DogHouse() {
  const [mbtiResults, setMbtiResults] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [mbtiResponse, latestResponse, popularResponse] = await Promise.all([
          axios.get('/mbti', { withCredentials: true }),
          axios.get('/post/latest', { withCredentials: true }),
          axios.get('/post/popular', { withCredentials: true })
        ]);

        setMbtiResults(Array.isArray(mbtiResponse.data) ? mbtiResponse.data : []);
        setLatestPosts(Array.isArray(latestResponse.data) ? latestResponse.data : []);
        setPopularPosts(Array.isArray(popularResponse.data) ? popularResponse.data : []);
      } catch (error) {
        console.error('데이터 로딩 중 에러 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-secondary py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8">
            <Card><SkeletonLoader /></Card>
            <div className="grid md:grid-cols-3 gap-8">
              <Card><SkeletonLoader /></Card>
              <Card className="md:col-span-2"><SkeletonLoader /></Card>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-secondary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-6">
              Welcome to <span className="text-primary">보리꼬리</span>
            </h1>
            {/* <p className="text-lg md:text-xl text-text-light mb-12 leading-relaxed">
              우리 강아지가 사람이라면? 검증되지 않은 개BTI 테스트!<br/>
              우리 강아지랑 어딜 가면 좋을까? 반려견 관련 주변 장소 추천!<br/>
              그리고 5천만 반려인들과 소통하세요~
            </p> */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/dogBTI" className="btn btn-primary">
                개BTI 테스트 하러가기
              </Link>
              
              <Link 
                to="/map" className="btn btn-primary">
                개와 함께! 주변 장소 보러가기
              </Link>
            </div>

            <div className="mt-12">
              <img
                src={`${process.env.PUBLIC_URL}/images/borikkori_4cut.png`}
                alt="브로콜리 캐릭터 4컷 만화"
                className="mx-auto w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* MBTI Section */}
            <Card>
              <h2 className="text-2xl font-bold text-text mb-6">
                개비티아이 TOP 3
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {mbtiResults.map((result, index) => (
                  <div key={index} className="text-center">
                    <div className="relative pb-[100%] mb-3">
                      <img
                        alt={`MBTI ${result.type}`}
                        src={`${process.env.PUBLIC_URL}/images/face_results/${result.type}.png`}
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    </div>
                    <p className="font-medium text-text">
                      {result.type}
                    </p>
                    <p className="text-sm text-text-light">
                      {result.count}명
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Latest Posts */}
            <Card className="md:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text">최신 게시글</h2>
                <Link to="/board" className="text-primary hover:text-primary-dark">
                  더보기 →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {latestPosts.slice(0, 4).map((post, index) => (
                  <article key={index} className="group">
                    <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-text-light line-clamp-2">
                      {post.excerpt}
                    </p>
                  </article>
                ))}
              </div>
            </Card>
          </div>

          {/* Popular Posts */}
          <Card className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text">인기 게시글</h2>
              <Link to="/board" className="text-primary hover:text-primary-dark">
                더보기 →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {popularPosts.slice(0, 6).map((post, index) => (
                <article key={index} className="group">
                  <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-text-light line-clamp-2">
                    {post.excerpt}
                  </p>
                </article>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
