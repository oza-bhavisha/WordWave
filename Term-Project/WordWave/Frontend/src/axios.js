import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const jwt = window.localStorage.getItem("token");
    if (jwt) {
      config.headers["Authorization"] = "Bearer " + jwt;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
