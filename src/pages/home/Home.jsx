import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DogHouse() {
  const [mbtiResults, setMbtiResults] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    axios.get('/mbti', { withCredentials: true })
      .then(response => {
        setMbtiResults(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => console.error('에러', error));

    axios.get('/post/latest', { withCredentials: true })
      .then(response => {
        setLatestPosts(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => console.error('에러', error));

    axios.get('/post/popular', { withCredentials: true })
      .then(response => {
        setPopularPosts(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => console.error('에러', error));
  }, []);

  return (
    <main className="flex flex-col items-center px-4 md:px-6 bg-secondary min-h-screen">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mt-8 bg-accent/20 rounded-lg shadow-lg overflow-hidden text-center py-16 px-4 md:px-8">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-primary mb-4">
          Welcome to 보리꼬리
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-primary mb-8">
          우리 강아지가 사람이라면? 검증되지 않은 개BTI 테스트! 
          우리 강아지랑 어딜 가면 좋을까? 반려견 관련 주변 장소 추천! 
          그리고 5천만 반려인들과 소통하세요~
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a 
            href="/#/dogBTI" 
            className="bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-primary/80 transition-colors"
          >
            개BTI 테스트 하러가기
          </a>
          <a 
            href="/#/map" 
            className="bg-white text-primary border-2 border-primary px-6 py-3 rounded-lg shadow-md hover:bg-secondary transition-colors"
          >
            개와 함께! 주변 장소 보러가기
          </a>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="w-full max-w-5xl mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* MBTI Section */}
        <div className="bg-accent/10 rounded-lg shadow-lg p-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary mb-4">
            개비티아이 TOP 3
          </h2>
          <div className="relative h-64 w-full mb-8 flex flex-wrap justify-around items-center">
            {mbtiResults.map((result, index) => (
              <div key={index} className="w-1/3 p-2 flex flex-col items-center">
                <img
                  alt="MBTI TOP3"
                  className="w-full h-auto object-contain"
                  src={`${process.env.PUBLIC_URL}/images/face_results/${result.type}.png`}
                />
                <p className="text-center mt-2 text-primary font-medium">
                  {result.type} : {result.count}명
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Posts */}
        <div className="bg-accent/10 rounded-lg shadow-lg p-6 md:col-span-2">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary mb-4">
            최신 게시글
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestPosts.slice(0, 4).map((post, index) => (
              <article key={index} className="mb-8">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary">
                  {post.title}
                </h3>
                <p className="text-gray-700 mt-2 text-sm sm:text-base">
                  {post.excerpt}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Posts Section */}
      <section className="w-full max-w-5xl mt-8 bg-accent/10 rounded-lg shadow-lg p-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary mb-4">
          인기 게시글
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {popularPosts.slice(0, 6).map((post, index) => (
            <article key={index} className="mb-8">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary">
                {post.title}
              </h3>
              <p className="text-gray-700 mt-2 text-sm sm:text-base">
                {post.excerpt}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
