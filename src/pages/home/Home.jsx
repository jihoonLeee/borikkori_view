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
    axios.get('/posts/latest', {
      withCredentials: true
    })
    .then(response => {
      setLatestPosts(Array.isArray(response.data) ? response.data : []);
    })
    .catch(error => {
      console.error('에러', error);
    });

    // Fetch popular posts
    axios.get('/posts/popular', {
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
    <main className="flex flex-col items-center px-4 md:px-6 dark:bg-rose-900 min-h-screen">
      <section className="w-full max-w-5xl mt-8 bg-white dark:bg-rose-950 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-rose-900 dark:text-rose-50 mb-4">개비티아이 TOP 3</h2>
          <div className="relative h-64 w-full mb-8 flex justify-around flex-wrap">
            {mbtiResults.map((result, index) => (
              <div key={index} className="w-1/3 sm:w-1/4 md:w-1/5 p-2 flex flex-col items-center">
                <img
                  alt="MBTI TOP3"
                  className="w-full h-auto object-contain"
                  src={`${process.env.PUBLIC_URL}/images/face_results/${result.type}.png`}
                />
                <p className="text-center mt-2">{result.type} : {result.count}명</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full max-w-5xl mt-8 bg-white dark:bg-rose-950 rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-semibold text-rose-900 dark:text-rose-50 mb-4">최신 게시글</h2>
          <div className="grid grid-cols-1 gap-4">
            {latestPosts.slice(0, 6).map((post, index) => (
              <article key={index} className="mb-8">
                <h3 className="text-xl font-bold text-rose-900 dark:text-rose-50">{post.title}</h3>
                <p className="text-gray-600 dark:text-rose-300 mt-2">{post.excerpt}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-rose-900 dark:text-rose-50 mb-4">인기 게시글</h2>
          <div className="grid grid-cols-1 gap-4">
            {popularPosts.slice(0, 6).map((post, index) => (
              <article key={index} className="mb-8">
                <h3 className="text-xl font-bold text-rose-900 dark:text-rose-50">{post.title}</h3>
                <p className="text-gray-600 dark:text-rose-300 mt-2">{post.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
