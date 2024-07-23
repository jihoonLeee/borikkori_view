import React, { lazy } from 'react';

const DogMbtiTest = lazy(() => import('../pages/dogTest/DogMbtiTest'));
const DogMbtiResult = lazy(() => import('../pages/dogTest/DogMbtiResult'));
const MainBoard = lazy(() => import('../pages/boards/MainBoard'));
const DogHouse = lazy(() => import('../pages/home/Home'));
const Join = lazy(() => import('../pages/user/JoinPage'));
const Login = lazy(() => import('../pages/user/LoginPage'));
const BoardWrite = lazy(() => import('../pages/boards/BoardWrite'));
const GameList = lazy(() => import('../pages/game/GameList'));
const Game = lazy(() => import('../pages/game/Game'));
const Post = lazy(() => import('../pages/boards/Post'));
const ChatRoom = lazy(() => import('../pages/chat/ChatRoom'));
const ChatRoomList = lazy(() => import('../pages/chat/ChatRoomList'));
const ChatLayout = lazy(() => import('../pages/chat/ChatLayout'));
const KakaoMap = lazy(() => import('../pages/map/KakaoMap'));

const routes = [
  { path: "/", element: <DogHouse /> },
  { path: "/dogBTI/*", element: <DogMbtiTest /> },
  { path: "/dogBTI/result", element: <DogMbtiResult /> },
  { path: "/mainBoard", element: <MainBoard /> },
  { path: "/join", element: <Join /> },
  { path: "/login", element: <Login /> },
  { path: "/boardWrite", element: <BoardWrite /> },
  { path: "/games", element: <GameList /> },
  { path: "/boriGame", element: <Game /> },
  { path: "/post/:postId", element: <Post /> },
  { path: "/map", element: <KakaoMap /> },
  { path: "/chat", element: <ChatLayout />, children: [
    { path: "", element: <ChatRoomList /> },
    { path: ":roomId", element: <ChatRoom /> }
  ]},
];

export default routes;
