import React from "react";


export default function DogHouse() {
  const api_url = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_PORT;
  // axios.get(api_url+"/test");
  

  return (
    <main className="flex flex-col items-center px-4 md:px-6  dark:bg-rose-900 min-h-screen">
      *보수중*
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
        <h2 className="text-2xl font-semibold text-rose-900 dark:text-rose-50 mb-4">Top 3 MBTI Results</h2>
        <div className="relative h-64 w-full mb-8 flex justify-between">
          <img
            alt="MBTI Chart"
            className="w-48 h-48 object-cover"
            src={`${process.env.PUBLIC_URL}/images/face_results/istj.png`}
          />
          <img
            alt="MBTI Chart"
            className="w-48 h-48 object-cover"
            src={`${process.env.PUBLIC_URL}/images/face_results/estj.png`}
          />
          <img
            alt="MBTI Chart"
            className="w-48 h-48 object-cover"
            src={`${process.env.PUBLIC_URL}/images/face_results/intj.png`}
          />
        </div>
      </div>
    </section>
  </main>
  );
}