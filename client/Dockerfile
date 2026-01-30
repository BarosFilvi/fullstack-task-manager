# client/Dockerfile mới
FROM node:18-alpine

WORKDIR /app

# Copy package để cài thư viện trước (tối ưu cache)
COPY package*.json ./
RUN npm install

# Copy toàn bộ code vào
COPY . .

# Build code Next.js (lúc này nó sẽ tạo folder .next)
RUN npm run build

# Mở port 3000 (Next.js mặc định chạy 3000)
EXPOSE 3000

# Lệnh chạy server
CMD ["npm", "start"]