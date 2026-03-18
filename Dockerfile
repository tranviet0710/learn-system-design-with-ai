FROM node:18-alpine
WORKDIR /app
# Khởi tạo project Node.js và cài đặt thư viện redis
RUN npm init -y && npm install redis
COPY server.js .
CMD ["node", "server.js"]