# Use Node.js 18 alpine for smaller image size
FROM node:18-alpine

# Install Expo CLI globally
RUN npm install -g @expo/cli

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose port 8081 (default Expo web port)
EXPOSE 8081

# Command to run Expo web
CMD ["npx", "expo", "start", "--web", "--host", "0.0.0.0"]