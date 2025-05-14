# 1) Build 단계: Node.js로 번들링
FROM node:18-alpine AS builder
WORKDIR /app

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# npm 설치 (package-lock.json 기반)
COPY package.json package-lock.json ./
RUN npm ci

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# 2) Production 단계: Nginx로 정적 파일 서빙
FROM nginx:stable-alpine

# 빌드 결과를 웹 폴더로 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 런타임 환경변수 주입
# React 앱이 process.env.REACT_APP_API_URL 등으로 참조하도록 셋업
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV NODE_ENV=production

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]