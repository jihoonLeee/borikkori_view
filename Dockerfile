# 1) Build 단계: Node.js로 번들링
FROM node:18-alpine AS builder
WORKDIR /app

# 1. 패키지 설치
COPY package.json package-lock.json ./
RUN npm ci

# 2. 환경변수 파일 복사 (.env는 CI에서 복호화된 파일)
COPY .env .env

# 3. 소스 복사 및 번들링
COPY . .
RUN npm run build

# 2) Production 단계: Nginx로 정적 파일 서빙
FROM nginx:stable-alpine

# 빌드 결과를 웹 폴더로 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 프로덕션 환경으로 고정
ENV NODE_ENV=production

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
