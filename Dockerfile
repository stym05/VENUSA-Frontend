# Build stage
FROM node:18-alpine

WORKDIR /app

# Set environment variables to make it non-interactive
ENV CI=true
ENV EXPO_NO_TELEMETRY=1
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Expo CLI globally
RUN npm install -g @expo/cli

# Copy project files
COPY . .

# Build the web version (expo export outputs to 'dist' by default)
RUN npx expo export --platform web

# Production stage
FROM nginx:alpine

# Copy built files from previous stage
COPY --from=0 /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]