import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:5500"
  baseURL: 'https://vkart-ry24.onrender.com'
});

export default instance;
