import React, { useState,useEffect } from 'react';
import axios from 'axios'; 

export default function DogHouse() {
  const [mbtiResults, setMbtiResults] = useState([]);
  useEffect(() => {
    axios.get('/mbti', {
      withCredentials: true
    }) 
    .then(response => {
      setMbtiResults(response.data);
    })
    .catch(error => {
      console.error('에러', error);
    });
  }, []);

  return (
    <main className="flex flex-col items-center px-4 md:px-6  dark:bg-rose-900 min-h-screen">
      {/* <section className="w-full md:w-1/3 bg-white dark:bg-rose-950 rounded-lg shadow-md overflow-hidden md:mr-2 mb-8 md:mb-0">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-rose-900 dark:text-rose-50 mb-4">인기 게시글</h2>
          <article className="mb-8">
            <h3 className="text-xl font-bold text-rose-900 dark:text-rose-50">Popular Post 1</h3>
            <p className="text-gray-600 dark:text-rose-300 mt-2">
              1
            </p>
            
          </article>
          <article className="mb-8">
            <h3 className="text-xl font-bold text-rose-900 dark:text-rose-50">Popular Post 2</h3>
            <p className="text-gray-600 dark:text-rose-300 mt-2">
              2
            </p>
          </article>
          <article className="mb-8">
            <h3 className="text-xl font-bold text-rose-900 dark:text-rose-50">Popular Post 3</h3>
            <p className="text-gray-600 dark:text-rose-300 mt-2">
             3 eu fugiat nulla pariatur.
            </p>
          </article>
        </div>
      </section>
      <section className="w-full md:w-1/3 bg-white dark:bg-rose-950 rounded-lg shadow-md overflow-hidden md:ml-2">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-rose-900 dark:text-rose-50 mb-4">최신 게시글</h2>
          <article className="mb-8">
            <h3 className="text-xl font-bold text-rose-900 dark:text-rose-50">Recent Post 1</h3>
            <p className="text-gray-600 dark:text-rose-300 mt-2">
              L1
            </p>
          </article>
          <article className="mb-8">
            <h3 className="text-xl font-bold text-rose-900 dark:text-rose-50">Recent Post 2</h3>
            <p className="text-gray-600 dark:text-rose-300 mt-2">
              3
            </p>
          </article>
          <article className="mb-8">
            <h3 className="text-xl font-bold text-rose-900 dark:text-rose-50">Recent Post 3</h3>
            <p className="text-gray-600 dark:text-rose-300 mt-2">
              2
            </p>
          </article>
        </div>
      </section> */}
    <section className="w-full max-w-5xl mt-8 bg-white dark:bg-rose-950 rounded-lg shadow-md overflow-hidden">
  <div className="p-6">
    <h2 className="text-2xl font-semibold text-rose-900 dark:text-rose-50 mb-4">개비티아이 TOP 3</h2>
    <div className="relative h-64 w-full mb-8 flex justify-between">
      {mbtiResults.map((result, index) => (
        <div><img
          key={index}
          alt="MBTI TOP3"
          className="w-48 h-48 object-cover"
          src={`${process.env.PUBLIC_URL}/images/face_results/${result.type}.png`}
        />
        {result.type}   :  {result.count}명   
        </div>
        ))
      }
     
    </div>
  </div>
</section>
  </main>
  );
}