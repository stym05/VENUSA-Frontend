# Deploy React Native Expo Frontend Only

## Overview
This setup deploys only your React Native Expo frontend to venusa.co.in while your existing Django backend continues running at webservices.venusa.co.in.

## Prerequisites
1. **EC2 Instance** with Docker and Docker Compose installed
2. **SSL Certificate** for venusa.co.in 
3. **DNS Record** pointing venusa.co.in to your EC2 instance
4. **Existing Backend** running at webservices.venusa.co.in

## Project Structure
```
your-frontend-project/
├── Dockerfile (created automatically)
├── docker-compose.yml
├── nginx.conf
├── deploy.sh
├── package.json
├── App.js
└── ... (your Expo project files)
```

## Step-by-Step Deployment

### 1. Prepare Your Expo Project
```bash
# On your EC2 instance, go to your frontend project directory
cd /path/to/your/expo-project

# Make sure you have web support in package.json
npm install @expo/webpack-config react-native-web
```

### 2. SSL Certificate for venusa.co.in
If you don't have an SSL certificate yet:
```bash
# Install Certbot (if not already installed)
sudo apt update
sudo snap install --classic certbot

# Get SSL certificate for venusa.co.in
sudo certbot certonly --standalone -d venusa.co.in
```

### 3. Configure API Base URL
In your Expo project, make sure your API calls point to the backend:
```javascript
// config/api.js or similar
const API_BASE_URL = 'https://webservices.venusa.co.in';

// Example API call
fetch(`${API_BASE_URL}/api/your-endpoint`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 4. Download Configuration Files
Place these files in your Expo project root:
- `docker-compose.yml` (frontend services only)
- `nginx.conf` (routes venusa.co.in to frontend, proxies API calls to backend)
- `deploy.sh` (deployment script)

### 5. Deploy Your Frontend
```bash
# Make the script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## What This Setup Does

### Docker Compose
- **Frontend Container**: Runs `expo start --web` on port 19006
- **Nginx Container**: Handles SSL termination and routing

### Nginx Configuration
- **venusa.co.in** → Your Expo frontend
- **venusa.co.in/api/** → Proxies to webservices.venusa.co.in/api/
- **venusa.co.in/admin/** → Proxies to webservices.venusa.co.in/admin/
- **WebSocket support** for Expo dev server hot reloading

### Port Usage
- **Port 80/443**: Nginx (public HTTPS access)
- **Port 19006**: Expo frontend (internal Docker network only)

## Testing Your Deployment

### Check Container Status
```bash
docker-compose ps
```

### View Logs
```bash
# Frontend logs
docker-compose logs -f frontend

# Nginx logs
docker-compose logs -f nginx
```

### Test Endpoints
```bash
# Test frontend
curl -I https://venusa.co.in

# Test API proxy
curl -I https://venusa.co.in/api/

# Test direct backend
curl -I https://webservices.venusa.co.in/
```

## Updating Your Frontend

```bash
# Pull latest code changes
git pull origin main

# Restart with new changes
docker-compose down
docker-compose up --build -d
```

## Troubleshooting

### Common Issues

1. **Frontend not loading**
   ```bash
   # Check if Expo project builds correctly
   npx expo install --fix
   npm install
   ```

2. **SSL Certificate issues**
   ```bash
   # Check certificate status
   sudo certbot certificates
   
   # Renew if needed
   sudo certbot renew
   ```

3. **API calls failing**
   - Verify webservices.venusa.co.in is accessible
   - Check CORS settings in your Django backend
   - Ensure API base URL is correct in your Expo app

4. **Port conflicts**
   ```bash
   # Check what's using ports 80, 443
   sudo netstat -tulpn | grep :80
   sudo netstat -tulpn | grep :443
   ```

### Backend CORS Configuration
Make sure your Django backend allows requests from venusa.co.in:

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "https://venusa.co.in",
    "http://localhost:19006",  # for development
]

ALLOWED_HOSTS = [
    'webservices.venusa.co.in',
    # ... other hosts
]
```

## Security Considerations

1. **SSL/TLS**: Both domains should use HTTPS
2. **CORS**: Properly configure CORS in your Django backend
3. **Firewall**: Only expose necessary ports (80, 443)
4. **Updates**: Keep Docker images and certificates updated

## Monitoring

### Health Checks
The setup includes health checks for both services:
- Frontend: HTTP check on port 19006
- Nginx: HTTP check on /health endpoint

### Log Monitoring
```bash
# Monitor all logs
docker-compose logs -f

# Monitor specific service
docker-compose logs -f frontend
docker-compose logs -f nginx
```

This setup gives you a clean separation between your frontend and backend while maintaining proper communication between them. Your frontend will be accessible at https://venusa.co.in and will communicate with your existing backend at https://webservices.venusa.co.in.