type NotificationAction = "error" | "success";

type Priority = "LOW" | "MEDIUM" | "HIGH";
type Status = "PENDING" | "COMPLETED" | "CANCELED" | "IN_PROGRESS";

interface Todo {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: Priority;
    status: Status;
}
