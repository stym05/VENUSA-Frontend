# Build stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Expo CLI globally
RUN npm install -g @expo/cli

# Copy project files
COPY . .

# Build the web version using the new command
RUN npx expo export --platform web

# Production stage
FROM nginx:alpine

# Copy built files from previous stage (note: output is in 'dist' folder)
COPY --from=0 /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]