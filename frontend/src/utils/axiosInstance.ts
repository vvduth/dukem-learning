/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";



const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// request interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken ) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
)

// response interceptor to handle responses globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 500) {
                console.error("Server error occurred.");
            } else if (error.response.status === 401) {
                console.error("Unauthorized! Please log in again.");
            } else if (error.code === "ECONNABORTED") {
                console.error("Request timed out. Please try again.");
            }
            
        }
        return Promise.reject(error);
    }
)

export  default axiosInstance;