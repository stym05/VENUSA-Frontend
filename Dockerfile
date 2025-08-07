# Use Node.js 20 LTS (compatible with Expo SDK 52)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies needed for React Native
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    && npm install -g @expo/cli

# Set environment variables
ENV NODE_ENV=development
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV WATCHPACK_POLLING=true

# Increase memory limit for Node.js
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Increase file watcher limits (for Alpine Linux)
RUN echo 'fs.inotify.max_user_watches = 524288' >> /etc/sysctl.conf || true

# Copy package files first (for better Docker layer caching)
COPY package*.json ./
COPY yarn.lock* ./

# Install dependencies
RUN npm ci --only=production=false

# Copy the rest of the application code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

USER nextjs

# Expose ports
EXPOSE 8081 8082 19000 19001 19002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8081 || exit 1

# Default command
CMD ["npx", "expo", "start", "--web", "--host", "0.0.0.0", "--port", "8081"]