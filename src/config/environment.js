/**
 * Environment Configuration
 *
 * This file manages all environment-specific configurations
 * for the VENUSA frontend application.
 */

import { Platform } from 'react-native';

// Determine environment
const ENV = {
  dev: 'development',
  prod: 'production',
};

// Set current environment (change this based on your deployment)
const currentEnv = ENV.prod; // Change to ENV.dev for local development

// API Configuration
const API_URLS = {
  development: {
    base: 'http://localhost:8000',
    name: 'Local Development',
  },
  production: {
    base: 'https://webservices.venusa.co.in',
    name: 'Production Server',
  },
};

// Get current API configuration
const getAPIConfig = () => {
  return API_URLS[currentEnv];
};

// Export configuration
export const CONFIG = {
  // Environment
  ENV: currentEnv,
  IS_DEV: currentEnv === ENV.dev,
  IS_PROD: currentEnv === ENV.prod,

  // API
  API_BASE_URL: getAPIConfig().base,
  API_NAME: getAPIConfig().name,

  // Platform
  IS_WEB: Platform.OS === 'web',
  IS_IOS: Platform.OS === 'ios',
  IS_ANDROID: Platform.OS === 'android',

  // App Info
  APP_NAME: 'VENUSA',
  APP_VERSION: '1.0.0',

  // Timeouts
  API_TIMEOUT: 30000, // 30 seconds

  // Features flags
  ENABLE_ANALYTICS: currentEnv === ENV.prod,
  ENABLE_ERROR_REPORTING: currentEnv === ENV.prod,
  ENABLE_DEBUG_LOGGING: currentEnv === ENV.dev,
};

// Log current configuration (only in development)
if (CONFIG.ENABLE_DEBUG_LOGGING) {
  console.log('🔧 Environment Configuration:', {
    Environment: CONFIG.ENV,
    API_URL: CONFIG.API_BASE_URL,
    Platform: Platform.OS,
  });
}

export default CONFIG;
