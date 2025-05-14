# 1) Build 단계: Node.js로 번들링
FROM node:18-alpine AS builder
WORKDIR /app

# 1.1) 의존성 설치
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 1.2) 환경변수 복사 (.env → .env.production 으로 미리 복사해 두셨다면)
#     또는 build-arg 로 넘기셔도 됩니다.
COPY .env .env.production

# 1.3) 소스 복사 및 빌드
COPY . .
RUN yarn build

# 2) Production 단계: Nginx 로 정적 파일 서빙
FROM nginx:stable-alpine
# (원하면 커스텀 nginx.conf 복사)
# COPY nginx.conf /etc/nginx/nginx.conf

# 2.1) 빌드 결과를 Nginx html 폴더로 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 2.2) 80번 포트 오픈
EXPOSE 80

# 2.3) Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
