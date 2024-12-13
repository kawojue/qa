import axios from "axios";

const baseURL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:2000"
        : "https://qa-test123.up.railway.app";

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export { api };
