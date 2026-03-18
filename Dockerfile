# Sử dụng môi trường Node.js phiên bản siêu nhẹ (alpine)
FROM node:18-alpine
# Chuyển vào thư mục /app trong máy ảo
WORKDIR /app
# Copy file server.js từ máy tính của bạn vào máy ảo
COPY server.js .
# Chạy file khi máy ảo khởi động
CMD ["node", "server.js"]