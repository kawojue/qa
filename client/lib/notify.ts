import { toast } from "react-hot-toast";

export const notify = (action: NotificationAction, message: string): void => {
    if (action === "success") {
        toast.success(message, {
            duration: 2000,
        });
    }

    if (action === "error") {
        toast.error(message, {
            duration: 2500,
        });
    }
};
