import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://${process.env.REACT_APP_BACKEND}:4000/`,
  // baseURL: `http://184.73.127.5:5000/`,
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
