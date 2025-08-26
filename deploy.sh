#!/bin/bash

# Frontend-only deployment script for React Native Expo
set -e

echo "🚀 Starting frontend deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from your Expo project root directory."
    exit 1
fi

# Create Dockerfile if it doesn't exist
if [ ! -f "Dockerfile" ]; then
    print_status "Creating Dockerfile..."
    cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

RUN npm install -g @expo/cli

COPY package*.json ./
RUN npm install

COPY . .

RUN addgroup -g 1001 -S nodejs
RUN adduser -S reactuser -u 1001
RUN chown -R reactuser:nodejs /app
USER reactuser

EXPOSE 19006

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:19006 || exit 1

CMD ["npx", "expo", "start", "--web", "--port", "19006", "--host", "0.0.0.0"]
EOF
fi

# Stop existing containers
print_status "Stopping existing frontend containers..."
docker-compose down || true

# Remove unused Docker resources
print_status "Cleaning up Docker resources..."
docker system prune -f

# Build and start containers
print_status "Building and starting frontend containers..."
docker-compose up --build -d

# Wait for services to be healthy
print_status "Waiting for services to start..."
sleep 30

# Check container status
print_status "Checking container status..."
docker-compose ps

# Test frontend connectivity
print_status "Testing frontend connectivity..."
if curl -f http://localhost:19006 > /dev/null 2>&1; then
    print_status "✅ Frontend is running successfully on port 19006"
else
    print_warning "⚠️  Frontend health check failed"
fi

# Test nginx
print_status "Testing nginx..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    print_status "✅ Nginx is running successfully"
else
    print_warning "⚠️  Nginx health check failed"
fi

# Test backend connectivity (optional)
print_status "Testing backend connectivity..."
if curl -f https://webservices.venusa.co.in/admin/login/ > /dev/null 2>&1; then
    print_status "✅ Backend is accessible at webservices.venusa.co.in"
else
    print_warning "⚠️  Backend seems to be unreachable. Make sure it's running."
fi

print_status "🎉 Frontend deployment completed!"
print_status "Your frontend should be available at:"
print_status "  - Frontend: https://venusa.co.in"
print_status "  - Backend API: https://webservices.venusa.co.in"

print_status "To check logs:"
print_status "  docker-compose logs -f frontend"
print_status "  docker-compose logs -f nginx"

print_status "To stop services:"
print_status "  docker-compose down"

print_status "Next steps:"
print_status "1. Make sure your SSL certificate for venusa.co.in is properly configured"
print_status "2. Update your Expo app's API base URL to https://webservices.venusa.co.in"
print_status "3. Test the complete flow from frontend to backend"