import { Dimensions, Platform } from "react-native"

// Responsive breakpoints
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1280,
};

// Check if current device is mobile (width < 640px)
export const isMobile = () => {
  const { width } = Dimensions.get("window");
  return width < BREAKPOINTS.mobile;
};

// Check if current device is tablet (640px <= width < 1024px)
export const isTablet = () => {
  const { width } = Dimensions.get("window");
  return width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop;
};

// Check if current device is desktop (width >= 1024px)
export const isDesktop = () => {
  const { width } = Dimensions.get("window");
  return width >= BREAKPOINTS.desktop;
};

// Get responsive value based on screen size
export const getResponsiveValue = (mobileValue, tabletValue, desktopValue) => {
  if (isMobile()) return mobileValue;
  if (isTablet()) return tabletValue || mobileValue;
  return desktopValue || tabletValue || mobileValue;
};

// Get screen width
export const getScreenWidth = () => {
  return Dimensions.get("window").width;
};

// Get screen height
export const getScreenHeight = () => {
  return Dimensions.get("window").height;
};

// Check if platform is web
export const isWeb = () => {
  return Platform.OS === 'web';
};

// Validate email format
export function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}