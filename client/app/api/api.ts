import axios from "axios";
export const baseURL = "http://localhost:2000";

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export { api };
