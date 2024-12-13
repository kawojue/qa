import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UpdateTodoModal } from "./UpdateTodoModal";

interface TodoItemProps {
    todo: Todo;
    onUpdate: (todo: Todo) => void;
    onDelete: (id: string) => void;
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const priorityColors: Record<Priority, string> = {
        LOW: "bg-green-500",
        MEDIUM: "bg-yellow-500",
        HIGH: "bg-red-500",
    };

    const statusColors: Record<Status, string> = {
        PENDING: "bg-yellow-500",
        COMPLETED: "bg-green-500",
        CANCELED: "bg-red-500",
        IN_PROGRESS: "bg-blue-500",
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">{todo.title}</h3>
                <p className="text-gray-600 mb-2">{todo.description}</p>
                <div className="flex justify-between items-center">
                    <div className="space-x-2">
                        <Badge className={priorityColors[todo.priority]}>
                            {todo.priority}
                        </Badge>
                        <Badge className={statusColors[todo.status]}>
                            {todo.status}
                        </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                        Due: {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                </div>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
                <Button
                    variant="outline"
                    onClick={() => setIsUpdateModalOpen(true)}
                >
                    Update
                </Button>
                <Button variant="destructive" onClick={() => onDelete(todo.id)}>
                    Delete
                </Button>
            </CardFooter>
            <UpdateTodoModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onUpdateTodo={onUpdate}
                todo={todo}
            />
        </Card>
    );
}
