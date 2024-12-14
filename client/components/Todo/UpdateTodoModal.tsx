import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface UpdateTodoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdateTodo: (todo: Todo) => void;
    todo: Todo;
}

export function UpdateTodoModal({
    isOpen,
    onClose,
    onUpdateTodo,
    todo,
}: UpdateTodoModalProps) {
    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description);
    const [dueDate, setDueDate] = useState(todo.dueDate.split("T")[0]);
    const [priority, setPriority] = useState<Priority>(todo.priority);
    const [status, setStatus] = useState<Status>(todo.status);

    useEffect(() => {
        setTitle(todo.title);
        setDescription(todo.description);
        setDueDate(todo.dueDate.split("T")[0]);
        setPriority(todo.priority);
        setStatus(todo.status);
    }, [todo]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateTodo({
            ...todo,
            title,
            description,
            dueDate,
            priority,
            status,
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Todo</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                            value={priority}
                            onValueChange={(value: Priority) =>
                                setPriority(value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={status}
                            onValueChange={(value: Status) => setStatus(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="IN_PROGRESS">
                                    In Progress
                                </SelectItem>
                                <SelectItem value="COMPLETED">
                                    Completed
                                </SelectItem>
                                <SelectItem value="CANCELED">
                                    Canceled
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="w-full">
                        Update Todo
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
