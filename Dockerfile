# Use a lightweight Node.js image
FROM node:18-alpine

# Install necessary packages and Expo CLI globally
RUN npm install -g @expo/cli

# Set the working directory inside the container
WORKDIR /app

# Copy only package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the Expo Web default port
EXPOSE 8081

# Start Expo in web mode using correct host option
CMD ["npx", "expo", "start", "--web", "--host", "lan"]
