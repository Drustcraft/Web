import axios from "axios";

export default axios.create({
  baseURL: "https://api.drustcraft.com.au/v1",
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Drustcraft-Version": "2021-05-25",
  },
});
