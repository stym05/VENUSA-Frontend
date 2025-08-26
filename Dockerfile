# Frontend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install Expo CLI globally
RUN npm install -g @expo/cli

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S reactuser -u 1001

# Change ownership of the app directory
RUN chown -R reactuser:nodejs /app
USER reactuser

# Expose port for Expo dev server
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8081 || exit 1

# Start Expo development server for web
CMD ["npx", "expo", "start", "--web", "--port", "8081", "--host", "0.0.0.0"]