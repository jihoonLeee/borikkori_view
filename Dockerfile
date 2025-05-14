# 1) Build 단계: Node.js로 번들링
FROM node:18-alpine AS builder
WORKDIR /app

# 의존성 설치
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 소스 복사 및 빌드
COPY . .
RUN yarn build

# 2) Production 단계: Nginx로 정적 파일 서빙
FROM nginx:stable-alpine

# (이미 설정된 nginx.conf가 있다면 복사)
# COPY nginx.conf /etc/nginx/nginx.conf

# 빌드 결과를 웹 폴더로 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 런타임 환경변수 주입
# React 앱에서 process.env.API_URL 을 참조하도록 셋업
ENV API_URL=${API_URL}

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]