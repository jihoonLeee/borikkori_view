# Wagwagt 프로젝트

이 프로젝트는 반려 동물을 키우는 사람들에게 도움이 되는 사이트를 제공하기 위해 시작되었습니다. 처음에는 React를 공부하면서 만든 재미있는 프로젝트였지만, 점차 스케일을 키워 반려 동물의 건강 정보와 의료 시설 정보를 제공하는 사이트로 발전시키는 것이 목표입니다. 

## 프로젝트 설명

전에 보리라는 강아지를 키웠는데 처음 키우다보니 키우는데 서툴렀고, 8년을 함께 한 시점에 보리가 암에 걸려 무지개다리를 건너게 되면서 잘 못해줬던 미안함과, 강아지가 아플 때 정보가 많이 부족하고 의료 시설 정보 등이 모여있으면 좋겠다고 생각했습니다. 우리나라에 많은 반려인들이 있지만 좋은 환경은 아니라고 생각하였고, 모든 반려인들에게 도움이 되는 사이트로 만들어 나가기로 결정했습니다.

## 사용 기술

* 프론트엔드: React.js, Tailwind CSS
* 백엔드(예정): Spring Boot, JPA

## 사이트 링크

[https://deploy-preview-5--funny-heliotrope-d08506.netlify.app](https://deploy-preview-5--funny-heliotrope-d08506.netlify.app) <br/>
[https://wagwagt.world](https://wagwagt.world)


## 사이트 스크린샷

(사진 넣을 공간)

## 저자 정보 및 연락처

* 🧑🏻‍💻 : 이지훈
* 💌 : ljh2723@gmail.com


```
my-dog
├─ .yarn
│  └─ cache
├─ ads.txt
├─ CNAME
├─ package-lock.json
├─ package.json
├─ public
│  ├─ CNAME
│  ├─ icons
│  │  └─ borikkori_brown.png
│  ├─ images
│  │  ├─ borikkori.ico
│  │  ├─ borikkori.svg
│  │  ├─ borikkori_brown.png
│  │  ├─ borikkori_brown.svg
│  │  ├─ borikkori_brown_logo.ico
│  │  ├─ borikkori_logo.png
│  │  ├─ explosion.png
│  │  ├─ face_results
│  │  │  ├─ ENFJ.png
│  │  │  ├─ ENFP.png
│  │  │  ├─ ENTJ.png
│  │  │  ├─ ENTP.png
│  │  │  ├─ ESFJ.png
│  │  │  ├─ ESFP.png
│  │  │  ├─ ESTJ.png
│  │  │  ├─ ESTP.png
│  │  │  ├─ INFJ.png
│  │  │  ├─ INFP.png
│  │  │  ├─ INTJ.png
│  │  │  ├─ INTP.png
│  │  │  ├─ ISFJ.png
│  │  │  ├─ ISFP.png
│  │  │  ├─ ISTJ.png
│  │  │  └─ ISTP.png
│  │  ├─ game
│  │  │  ├─ bichon.png
│  │  │  ├─ bori.png
│  │  │  ├─ chihuahua.png
│  │  │  ├─ french.png
│  │  │  ├─ poodle.png
│  │  │  ├─ retriever.png
│  │  │  ├─ rottweiler.png
│  │  │  ├─ saintbernard.png
│  │  │  ├─ sanggun.png
│  │  │  ├─ sharpei.png
│  │  │  ├─ welshi.png
│  │  │  └─ yorkshire.png
│  │  ├─ main_button.png
│  │  ├─ main_text.png
│  │  ├─ results
│  │  │  ├─ borikkori.svg
│  │  │  ├─ enfj_result.png
│  │  │  ├─ enfp_result.png
│  │  │  ├─ entj_result.png
│  │  │  ├─ entp_result.png
│  │  │  ├─ esfj_result.png
│  │  │  ├─ esfp_result.png
│  │  │  ├─ estj_result.png
│  │  │  ├─ estp_result.png
│  │  │  ├─ infj_result.png
│  │  │  ├─ infp_result.png
│  │  │  ├─ intj_result.png
│  │  │  ├─ intp_result.png
│  │  │  ├─ isfj_result.png
│  │  │  ├─ isfp_result.png
│  │  │  ├─ istj_result.png
│  │  │  └─ istp_result.png
│  │  └─ upload
│  ├─ index.html
│  ├─ manifest.json
│  └─ robots.txt
├─ README.md
├─ src
│  ├─ api
│  │  ├─ boardApi.js
│  │  ├─ mapApi.js
│  │  └─ userApi.js
│  ├─ App.css
│  ├─ App.js
│  ├─ App.test.js
│  ├─ assets
│  │  └─ loading.gif
│  ├─ components
│  │  ├─ board
│  │  │  ├─ BoardList.jsx
│  │  │  ├─ BoardWriteForm.jsx
│  │  │  └─ PostView.jsx
│  │  ├─ chat
│  │  ├─ common
│  │  │  ├─ BasicAlert.jsx
│  │  │  ├─ Loading.jsx
│  │  │  ├─ ProgressBar.jsx
│  │  │  ├─ Spinner.jsx
│  │  │  └─ UserAvatar.jsx
│  │  ├─ dbti
│  │  │  ├─ DogMbtiHome.jsx
│  │  │  ├─ DogQuestion.jsx
│  │  │  └─ DogResult.jsx
│  │  ├─ layout
│  │  │  ├─ DialogPanel.jsx
│  │  │  ├─ Footer.jsx
│  │  │  ├─ Header.jsx
│  │  │  ├─ Layout.jsx
│  │  │  ├─ NavLink.jsx
│  │  │  └─ StyledButton.jsx
│  │  ├─ map
│  │  │  └─ KakaoMapView.jsx
│  │  └─ user
│  │     ├─ JoinForm.jsx
│  │     └─ LoginForm.jsx
│  ├─ containers
│  │  ├─ board
│  │  │  ├─ BoardListContainer.jsx
│  │  │  ├─ BoardWriteContainer.jsx
│  │  │  └─ PostContainer.jsx
│  │  ├─ dbti
│  │  │  ├─ DogMbtiResultContainer.jsx
│  │  │  └─ DogMbtiTestContainer.jsx
│  │  ├─ map
│  │  │  └─ KakaoMapContainer.jsx
│  │  └─ user
│  │     ├─ UserJoinContainer.jsx
│  │     └─ UserLoginContainer.jsx
│  ├─ contexts
│  │  └─ AuthProvider.jsx
│  ├─ function.js
│  ├─ hooks
│  │  └─ Example.jsx
│  ├─ index.css
│  ├─ index.js
│  ├─ logo.svg
│  ├─ pages
│  │  ├─ board
│  │  │  ├─ BoardListPage.jsx
│  │  │  ├─ BoardWritePage.jsx
│  │  │  └─ PostPage.jsx
│  │  ├─ chat
│  │  │  ├─ ChatLayout.jsx
│  │  │  ├─ ChatRoom.jsx
│  │  │  └─ ChatRoomList.jsx
│  │  ├─ dbti
│  │  │  ├─ DogMbtiResultPage.jsx
│  │  │  └─ DogMbtiTestPage.jsx
│  │  ├─ game
│  │  │  ├─ Dogs.js
│  │  │  ├─ Game.jsx
│  │  │  └─ GameList.jsx
│  │  ├─ home
│  │  │  └─ Home.jsx
│  │  ├─ map
│  │  │  └─ KakaoMapPage.jsx
│  │  └─ user
│  │     ├─ JoinPage.jsx
│  │     └─ LoginPage.jsx
│  ├─ queries
│  │  ├─ boards
│  │  ├─ dbti
│  │  │  └─ useDogMbtiQuery.js
│  │  └─ map
│  ├─ reportWebVitals.js
│  ├─ routes
│  │  └─ routes.js
│  ├─ setupTests.js
│  ├─ store
│  │  └─ dbti
│  │     └─ dogMbtiStore.js
│  ├─ styles
│  │  ├─ BoardWrite.css
│  │  ├─ Game.css
│  │  └─ KakaoMap.css
│  ├─ utils
│  │  ├─ DateFormat.js
│  │  ├─ Firebase.js
│  │  ├─ GetMBTI.js
│  │  └─ Style.js
│  └─ variables
│     ├─ charts.js
│     ├─ general.js
│     └─ icons.js
├─ tailwind.config.js
└─ vite.config.ts

```