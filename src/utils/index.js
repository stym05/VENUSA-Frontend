import { Platform } from "react-native"


export const isMobile = () => {
    return !Platform.OS == "web";
}