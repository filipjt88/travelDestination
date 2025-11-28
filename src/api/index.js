import axios from "axios";

// API za sve destinacije (države)
export const getDestinations = () => {
  return axios.get(
    "https://restcountries.com/v3.1/all?fields=name,capital,flags,region,population"
  );
};

// API pretraga destinacija po nazivu
export const searchDestinations = (query) => {
  return axios.get(
    `https://restcountries.com/v3.1/name/${query}?fields=name,capital,flags,region,population`
  );
};
