import { TodoItem } from "./TodoItem";

interface TodoListProps {
    todos: Todo[];
    onUpdateTodo: (todo: Todo) => void;
    onDeleteTodo: (id: string) => void;
}

export function TodoList({ todos, onUpdateTodo, onDeleteTodo }: TodoListProps) {
    return (
        <div className="space-y-4">
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onUpdate={onUpdateTodo}
                    onDelete={onDeleteTodo}
                />
            ))}
        </div>
    );
}
