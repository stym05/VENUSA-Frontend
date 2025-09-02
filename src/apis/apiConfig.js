import { Platform } from "react-native";

// const apiMainURL = "https://webservices.venusa.co.in/"; // Replace with your API base URL.

const apiMainURL = "http://localhost:8000/";

const setAuthorizationHeader = (url) => {
  return {
    Authorization: "Bearer your-token-here",
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorResponse = await response.json();
    throw {
      error: true,
      errorText: errorResponse.message || "Something went wrong",
      errorCode: response.status,
    };
  }
  return response.json();
};

const handleError = (error) => {
  return Promise.reject({
    error: true,
    errorText: error.message || "Something went wrong!",
    errorCode: error.code || 0,
  });
};

const fetchWrapper = async (method, url, data = null, isFormData = false) => {
  const URL = apiMainURL + url;
  const headers = setAuthorizationHeader(url);
  if (Platform.OS !== "web" && isFormData) {
    headers["Content-Type"] = "multipart/form-data";
  } else if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  try {
    const response = await fetch(URL, {
      method,
      headers: {
        ...headers,
      },
      body: data ? (isFormData ? data : JSON.stringify(data)) : null,
    })
    return response;
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

// HTTP Methods
export const get = (url) => fetchWrapper("GET", url);
export const post = (url, data) => fetchWrapper("POST", url, data);
export const put = (url, data) => fetchWrapper("PUT", url, data);
export const patch = (url, data) => fetchWrapper("PATCH", url, data);
export const del = (url) => fetchWrapper("DELETE", url);

// Form Data Methods
export const postForm = (url, formData) => fetchWrapper("POST", url, formData, true);
export const putForm = (url, formData) => fetchWrapper("PUT", url, formData, true);
export const patchForm = (url, formData) => fetchWrapper("PATCH", url, formData, true);
