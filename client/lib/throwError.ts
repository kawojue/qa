import { notify } from "./notify";

const throwError = (err: any): void => {
    const message = err.response?.data?.message || "An error occured";
    if (message) {
        if (Array.isArray(message)) {
            notify("error", message[0]);
        } else {
            notify("error", message);
        }
    } else {
        notify("error", err.code);
    }
};

export default throwError;
