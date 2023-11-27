import React, { useState, useEffect } from 'react';
import Button from "../../Components/UI/button";

export default function DogBoard() {
    const [posts, setPosts] = useState([]);
    const initialPosts = [
        { id: 1, title: '첫 번째 게시글', content: '안녕하ㅅ세요' },
        { id: 2, title: '두 번째 게시글', content: '안녕하시요' },
        { id: 3, title: '세 번째 게시글', content: '굿굿' },
      ];
      
    useEffect(() => {
        // 실제 환경에서는 API 호출을 통해 게시물 데이터를 가져옵니다.
        setPosts(initialPosts);
    }, []);
    return (
        <main className="flex flex-col items-center px-4 md:px-6 dark:bg-rose-900 min-h-screen">
        <section className="w-full max-w-2xl mt-8 bg-white dark:bg-rose-950 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-rose-900 dark:text-rose-50">정보 공유</h2>
              <Button className="bg-rose-500 text-white rounded-md">Write a Post</Button>
            </div>
            <div className="flex items-center mb-4">
              <input
                className="flex-1 px-3 py-2 rounded-md text-gray-900 dark:bg-rose-800 dark:text-rose-200"
                placeholder="Search..."
                type="text"
              />
              <Button className="ml-2 bg-rose-500 text-white rounded-md">Search</Button>
            </div>
            <hr className="my-4 border-rose-200 dark:border-rose-800" />
          
            {posts.map((post) => (
            <div key={post.id}>
               <article className="mb-8">
                <h3 className="text-xl font-bold text-rose-900 dark:text-rose-50">{post.title}</h3>
                <p className="text-gray-600 dark:text-rose-300 mt-2">
                    {post.content}
                </p>
                </article>
            </div>
          ))}
            <div className="flex justify-center mt-4">
              <Button className="mx-1 bg-rose-500 text-white rounded-md">Previous</Button>
              <Button className="mx-1 bg-rose-500 text-white rounded-md">1</Button>
              <Button className="mx-1 bg-rose-500 text-white rounded-md">2</Button>
              <Button className="mx-1 bg-rose-500 text-white rounded-md">3</Button>
              <Button className="mx-1 bg-rose-500 text-white rounded-md">Next</Button>
            </div>
          </div>
        </section>
      </main>
    );
}
