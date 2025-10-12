# VENUSA Frontend - Deployment Guide

## Overview
This document explains the changes made to make the VENUSA React Native Expo app properly responsive for web and connect to the production API.

## Changes Made

### 1. API Configuration Updated ✅

**Files Modified:**
- `src/apis/apiConfig.js`
- `src/apis/index.js`

**Changes:**
- Updated API base URL from `http://localhost:8000/` to `http://3.110.46.10/`
- All API endpoints already use correct routing: `/api/*` and `/apis/*`
- Added comments for easy switching between development and production

**API Endpoints:**
- Production: `http://3.110.46.10/api/*`
- Local Dev: `http://localhost:8000/api/*`

### 2. Enhanced Responsive Design ✅

**File Modified:**
- `src/utils/index.js`

**New Features:**
- Added comprehensive breakpoint system:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: >= 1024px
  - Large Desktop: >= 1280px

**New Utility Functions:**
```javascript
- isMobile()      // Check if mobile device
- isTablet()      // Check if tablet device
- isDesktop()     // Check if desktop device
- isWeb()         // Check if platform is web
- getResponsiveValue(mobile, tablet, desktop)  // Get value based on screen size
- getScreenWidth()  // Get current screen width
- getScreenHeight() // Get current screen height
```

### 3. Environment Configuration ✅

**File Created:**
- `src/config/environment.js`

**Features:**
- Centralized environment configuration
- Easy switching between development/production
- Platform detection (web, iOS, Android)
- Feature flags for analytics, error reporting, debugging
- API timeout configuration

**Usage:**
```javascript
import CONFIG from './src/config/environment';

// Use in your code
const apiUrl = CONFIG.API_BASE_URL;
const isProduction = CONFIG.IS_PROD;
```

### 4. Web Build Configuration ✅

**File Modified:**
- `app.json`

**Changes:**
- Added web-specific build configuration
- Set bundler to "metro"
- Set output to "static" for static file generation
- Added Babel configuration for icon support

### 5. Build & Deployment Script ✅

**File Created:**
- `web-build-deploy.sh`

**Features:**
- Automated build process
- Cleans previous builds
- Installs dependencies
- Builds Expo web app
- Creates deployment package (dist.zip)
- Uploads to S3 (if AWS CLI configured)

## How to Use

### Local Development

1. **Switch to Local API:**
   ```javascript
   // In src/apis/apiConfig.js and src/apis/index.js
   const apiMainURL = "http://localhost:8000/";  // Uncomment this
   // const apiMainURL = "http://3.110.46.10/";   // Comment this
   ```

2. **Run Development Server:**
   ```bash
   npm run web
   ```

3. **Access at:** `http://localhost:8081`

### Production Build & Deploy

1. **Ensure Production API is Set:**
   ```javascript
   // In src/apis/apiConfig.js and src/apis/index.js
   const apiMainURL = "http://3.110.46.10/";  // Should be uncommented
   ```

2. **Run Build Script:**
   ```bash
   chmod +x web-build-deploy.sh
   ./web-build-deploy.sh
   ```

3. **Manual Deployment (if AWS CLI not configured):**
   ```bash
   # Build the app
   npm run web

   # The build will be in 'web-build' folder
   # Rename it to 'dist'
   mv web-build dist

   # Create zip
   cd dist && zip -r ../dist.zip . && cd ..

   # Upload dist.zip to S3:
   # https://venusa.s3.ap-south-1.amazonaws.com/venusa/frontend/dist.zip
   ```

4. **Deploy to Server:**
   ```bash
   # SSH to production server
   ssh ubuntu@3.110.46.10

   # Navigate to project directory
   cd /home/ubuntu/Webservices

   # Run deployment script
   ./deploy-frontend.sh
   ```

## API Endpoints Reference

All API endpoints are defined in `src/apis/urls.js`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/categories` | GET | Get all categories |
| `/api/categories/subcategory` | GET | Get subcategories by ID |
| `/api/categories/products/subcategory` | GET | Get products by subcategory |
| `/api/products` | GET | Get product by ID |
| `/api/subscriber/create` | POST | Create subscriber |
| `/apis/auth/send-otp/` | POST | Generate OTP |
| `/apis/auth/verify-otp/` | POST | Validate OTP |
| `/api/cart` | GET | Get cart items |
| `/api/wishlist` | GET | Get wishlist |
| `/api/wishlist/add` | POST | Add to wishlist |
| `/api/wishlist/remove` | DELETE | Remove from wishlist |
| `/api/cart/add` | POST | Add to cart |
| `/api/addresses/customer` | GET | Get customer addresses |
| `/api/addresses` | POST | Create address |
| `/api/createOrder` | POST | Create order |
| `/api/order/createPreOrder` | POST | Create pre-order |

## Responsive Design Examples

### Using Responsive Utilities

```javascript
import { isMobile, isTablet, isDesktop, getResponsiveValue } from './src/utils';

// Conditional rendering
{isMobile() && <MobileView />}
{isDesktop() && <DesktopView />}

// Responsive values
const fontSize = getResponsiveValue(14, 16, 18);
const padding = getResponsiveValue(10, 15, 20);

// In StyleSheet
const styles = StyleSheet.create({
  container: {
    padding: getResponsiveValue(10, 20, 30),
    flexDirection: isMobile() ? 'column' : 'row',
  },
});
```

### Existing Responsive Patterns

The app already uses responsive design in many places:

```javascript
// From dashboard.jsx
height: isMobile() ? 400 : 700,
fontSize: isMobile() ? 20 : 36,
paddingVertical: isMobile() ? 10 : 20,

// From header component
width: isMobile() ? "100%" : "33%",
display: isMobile() ? undefined : 'none',
```

## Testing

### Test Responsiveness

1. **Mobile View (< 640px):**
   - Resize browser window to < 640px width
   - Or use browser dev tools mobile emulation

2. **Tablet View (640px - 1024px):**
   - Resize browser window to 768px width

3. **Desktop View (>= 1024px):**
   - Use full browser window on desktop

### Test API Connectivity

1. Open browser console
2. Navigate to dashboard
3. Check for API calls:
   ```
   Network tab → Filter by "api"
   Should see: http://3.110.46.10/api/categories
   ```

4. Verify no CORS errors

## Production URLs

- **Frontend:** http://3.110.46.10/ or http://venusa.co.in
- **Backend API:** http://3.110.46.10/api/*
- **Backend Admin:** http://3.110.46.10/admin/
- **S3 Build:** https://venusa.s3.ap-south-1.amazonaws.com/venusa/frontend/dist.zip

## Troubleshooting

### API Connection Issues

1. Check API base URL in config files
2. Verify CORS settings on backend (already configured)
3. Check network tab in browser console

### Build Issues

1. Clear cache: `rm -rf .expo node_modules && npm install`
2. Rebuild: `npx expo export:web`

### Responsive Issues

1. Check `isMobile()` function is working
2. Test at different breakpoints
3. Use browser dev tools to inspect element sizes

## Environment Configuration

To switch environments, edit `src/config/environment.js`:

```javascript
// For development
const currentEnv = ENV.dev;

// For production
const currentEnv = ENV.prod;
```

Or directly in API files:

```javascript
// Development
const apiMainURL = "http://localhost:8000/";

// Production
const apiMainURL = "http://3.110.46.10/";
```

## Notes

- All API endpoints already have correct `/api/` or `/apis/` prefixes
- CORS is properly configured on the backend
- Frontend is served by Nginx on port 80
- Backend APIs are proxied through Nginx from port 8000
- Responsive design uses 640px as mobile/desktop breakpoint
- Web builds are created in `dist/` folder
- Deployment requires SSH access to production server

## Support

For issues or questions:
1. Check this documentation
2. Review console logs for errors
3. Test API endpoints directly using curl or Postman
4. Verify deployment scripts executed successfully
