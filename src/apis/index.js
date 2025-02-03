import { get } from "./apiConfig"
import { URL } from "./urls"


export const getAllCategories = () => {
    const result = get(URL.getAllCategories);
    return result;e
}