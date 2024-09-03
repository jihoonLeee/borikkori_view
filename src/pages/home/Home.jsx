import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DogHouse() {
  const [mbtiResults, setMbtiResults] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    axios.get('/mbti', {
      withCredentials: true
    }) 
    .then(response => {
      setMbtiResults(Array.isArray(response.data) ? response.data : []);
    })
    .catch(error => {
      console.error('에러', error);
    });

    // Fetch latest posts
    axios.get('/post/latest', {
      withCredentials: true
    })
    .then(response => {
      setLatestPosts(Array.isArray(response.data) ? response.data : []);
    })
    .catch(error => {
      console.error('에러', error);
    });

    // Fetch popular posts
    axios.get('/post/popular', {
      withCredentials: true
    })
    .then(response => {
      setPopularPosts(Array.isArray(response.data) ? response.data : []);
    })
    .catch(error => {
      console.error('에러', error);
    });
  }, []);

  return (
    <main className="flex flex-col items-center px-4 md:px-6 bg-[#FFF7F0] min-h-screen">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mt-8 bg-[#FECDD3] rounded-lg shadow-lg overflow-hidden text-center py-16 px-4 md:px-8">
        <h1 className="text-4xl font-bold text-[#8B4513] mb-4">Welcome to 보리꼬리</h1>
        <p className="text-xl text-[#8B4513] mb-8">
          우리 강아지가 사람이라면? 검증되지 않은 개BTI 테스트! 
          우리 강아지랑 어딜 가면 좋을까? 반려견 관련 주변 장소 추천! 
          그리고 5천만 반려인들과 소통하세요~
        </p>
        <div className="flex justify-center space-x-4">
          <a href="/#/dogBTI" className="bg-[#8B4513] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#6F3210] transition-colors">개BTI 테스트 하러가기</a>
          <a href="/#/map" className="bg-white text-[#8B4513] border-2 border-[#8B4513] px-6 py-3 rounded-lg shadow-md hover:bg-[#F8EDEB] transition-colors">개와함께! 주변 장소 보러가기</a>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="w-full max-w-5xl mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* MBTI Section */}
        <div className="bg-[#F8EDEB] rounded-lg shadow-lg p-6 col-span-1">
          <h2 className="text-2xl font-semibold text-[#8B4513] mb-4">개비티아이 TOP 3</h2>
          <div className="relative h-64 w-full mb-8 flex justify-around flex-wrap">
            {mbtiResults.map((result, index) => (
              <div key={index} className="w-1/3 p-2 flex flex-col items-center">
                <img
                  alt="MBTI TOP3"
                  className="w-full h-auto object-contain"
                  src={`${process.env.PUBLIC_URL}/images/face_results/${result.type}.png`}
                />
                <p className="text-center mt-2 text-[#8B4513] font-medium">{result.type} : {result.count}명</p>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Posts */}
        <div className="bg-[#F8EDEB] rounded-lg shadow-lg p-6 col-span-1 md:col-span-2">
          <h2 className="text-2xl font-semibold text-[#8B4513] mb-4">최신 게시글</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestPosts.slice(0, 4).map((post, index) => (
              <article key={index} className="mb-8">
                <h3 className="text-xl font-bold text-[#8B4513]">{post.title}</h3>
                <p className="text-gray-700 mt-2">{post.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Posts Section */}
      <section className="w-full max-w-5xl mt-8 bg-[#F8EDEB] rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-[#8B4513] mb-4">인기 게시글</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {popularPosts.slice(0, 6).map((post, index) => (
            <article key={index} className="mb-8">
              <h3 className="text-xl font-bold text-[#8B4513]">{post.title}</h3>
              <p className="text-gray-700 mt-2">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
