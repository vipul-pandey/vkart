import axios from "axios";

const instance = axios.create({
  baseURL: "http://13.204.82.250"
  // baseURL: 'https://vkart-ry24.onrender.com'
});

export default instance;
