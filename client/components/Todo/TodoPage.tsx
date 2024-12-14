"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TodoList } from "./TodoList";
import { AddTodoModal } from "./AddTodoModal";
import { api } from "@/app/api/api";
import throwError from "@/lib/throwError";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 10;

export function TodoPage() {
    const router = useRouter();

    const [todos, setTodos] = useState<Todo[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [username, setUsername] = useState("User");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchTodos(currentPage);
    }, [currentPage]);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data } = await api.get("/auth", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            await new Promise((resolve) => setTimeout(resolve, 1000));
            setUsername(data.username);
        };
        fetchUserData();
    }, []);

    const fetchTodos = async (page: number) => {
        const { data } = await api.get(
            `/todo?limit=${ITEMS_PER_PAGE}&page=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        setTodos(data.data.todos);
        setTotalPages(data.data.meta.totalPages);
    };

    const handleAddTodo = async (newTodo: Omit<Todo, "id">) => {
        try {
            const { data } = await api.post("/todo", newTodo, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setTodos([data.data, ...todos.slice(0, -1)]);

            setTimeout(() => {
                setIsAddModalOpen(false);
            }, 2_000);
        } catch (err) {
            console.error(err);
            throwError(err);
        }
    };

    const handleUpdateTodo = async (updatedTodo: Todo) => {
        try {
            const { data } = await api.put(
                `/todo/${updatedTodo.id}`,
                {
                    title: updatedTodo.title,
                    dueDate: updatedTodo.dueDate,
                    description: updatedTodo.description,
                    status: updatedTodo.status,
                    priority: updatedTodo.priority,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            const { id, title, dueDate, description, status, priority } =
                data.data;

            setTodos((prevTodos) =>
                prevTodos.map((todo) =>
                    todo.id === id
                        ? { id, title, dueDate, description, status, priority }
                        : todo
                )
            );

            setTimeout(() => {
                setIsAddModalOpen(false);
            }, 2_000);
        } catch (err) {
            console.error(err);
            throwError(err);
        }
    };

    const handleDeleteTodo = async (id: string) => {
        const previousTodos = [...todos];
        try {
            setTodos(todos.filter((todo) => todo.id !== id));

            await api.delete(`/todo/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
        } catch (err) {
            console.error("Error deleting todo:", err);
            throwError(err);

            setTodos(previousTodos);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login");
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between w-full">
                <h1 className="text-2xl font-bold mb-6">
                    Welcome, {username} 🙈
                </h1>
                <Button className="bg-red-400" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Todo List</h2>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    Add New Todo
                </Button>
            </div>
            <TodoList
                todos={todos}
                onUpdateTodo={handleUpdateTodo}
                onDeleteTodo={handleDeleteTodo}
            />
            <div className="flex justify-between items-center mt-6">
                <Button
                    onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
            <AddTodoModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddTodo={handleAddTodo}
            />
        </div>
    );
}
