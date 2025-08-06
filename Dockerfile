# ---------- STAGE 1: Build static site using Expo ----------
FROM node:18-alpine AS builder

# Install Expo CLI globally
RUN npm install -g @expo/cli

# Set working directory
WORKDIR /app

# Copy only package files first for better Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the static web export
RUN npx expo export --web

# ---------- STAGE 2: Serve using Nginx ----------
FROM nginx:alpine

# Clean default nginx html folder
RUN rm -rf /usr/share/nginx/html/*

# Copy exported static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# (Optional) Replace Nginx config for SPA routing support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
