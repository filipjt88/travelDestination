import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000",
});

export const searchCities = (q) =>
  API.get(`/api/cities?q=${q}`);

export const getPhotos = (q) =>
  API.get(`/api/photos?q=${q}`);
