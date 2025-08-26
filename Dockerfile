# Use Node base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the web port (default for expo web is 19006)
EXPOSE 8081

# Start the Expo web server
CMD ["npx", "expo", "start", "--web", "--tunnel", "--no-open"]
