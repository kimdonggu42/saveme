import axios from "axios";

const BASE_URL = `http://openAPI.seoul.go.kr:8088/${process.env.REACT_APP_SEOUL_PUBLIC_API_KEY}/json/SearchPublicToiletPOIService/`;
const PROXY_URL = `https://proxy.cors.sh/http://openAPI.seoul.go.kr:8088/${process.env.REACT_APP_SEOUL_PUBLIC_API_KEY}/json/SearchPublicToiletPOIService/`;

export const BASE_API = axios.create({
  baseURL: BASE_URL,
});

export const PROXY_API = axios.create({
  baseURL: PROXY_URL,
  headers: {
    "x-cors-api-key": process.env.REACT_APP_PROXY_KEY,
  },
});
