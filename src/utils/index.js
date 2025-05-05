import { Dimensions, Platform } from "react-native"

export const isMobile = () => {
    const { width } = Dimensions.get("window");
    return width  < 640
 } 


 export function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}