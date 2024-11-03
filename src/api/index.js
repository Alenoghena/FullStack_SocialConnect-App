import axios from "axios";

const cors = require("cors");

// const API_BASE_URL = "http://localhost:3500";
const API_BASE_URL = "http://localhost:3004";
//list of sites or server addresses allowed to share data with this app

const allowedOrigins = [
  "http://localhost:3000",
  "https://www.yoursite.com",
  "http://127.0.0.1:5500",
];

const corsOptions = {
  origin: (origin, callback) => {
    //if index of origin is same as whitelist
    console.log(allowedOrigins);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); //error is null and data is true
    } else {
      callback(new Error("Not allowed by cors"));
    }
  },
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: "include",
  headers: {
    // Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowedOrigins,
  },
};

export const client = axios.create(
  {
    baseURL: API_BASE_URL,
    timeout: 1000,
    withCredentials: false, //This allowed connection to server
    responseType: "json",
  },

  cors(corsOptions)
);

export const apiRequest = async (path, optionObj = null, errMsg = null) => {
  try {
    // enter these two when calling apiRequest

    const response = await client.post(`${API_BASE_URL}/${path}`, optionObj);
    // if (response.ok) return response;
    if (!response.statusText) {
      if (response.statusText === 401) {
        throw new Error("Please reload the app");
      }
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return response;
  } catch (err) {
    throw new Error(err.message);
  }
};
