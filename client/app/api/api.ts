import axios from "axios";

const baseURL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:2000"
        : process.env.NEXT_PUBLIC_SERVER_URL;

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export { api };
