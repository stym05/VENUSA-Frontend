# 1️⃣ Base image
FROM node:22-alpine

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 4️⃣ Copy project files
COPY . .

# 5️⃣ Expose web dev port
EXPOSE 8081
EXPOSE 19006

# 6️⃣ Set environment variables
ENV NODE_ENV=production
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

# 7️⃣ Start Expo web
CMD ["npx", "expo", "start", "--web", "--host", "0.0.0.0"]
