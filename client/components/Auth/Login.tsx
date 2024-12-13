"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import throwError from "@/lib/throwError";
import { api } from "@/app/api/api";
import { notify } from "@/lib/notify";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [loginMethod, setLoginMethod] = useState<"username" | "email">(
        "username"
    );
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { data } = await api.post("/auth/login", formData);
            setFormData({
                identifier: "",
                password: "",
            });
            localStorage.setItem("token", data?.data?.access_token);

            notify("success", data?.message);

            setTimeout(() => {
                router.push("/");
            }, 2000);
        } catch (err) {
            console.error(err);
            throwError(err);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <RadioGroup
                        defaultValue="username"
                        onValueChange={(value) =>
                            setLoginMethod(value as "username" | "email")
                        }
                        className="flex space-x-4 mb-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="username" id="username" />
                            <Label htmlFor="username">Username</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="email" id="email" />
                            <Label htmlFor="email">Email</Label>
                        </div>
                    </RadioGroup>

                    <div className="space-y-2">
                        <Label htmlFor="identifier">
                            {loginMethod === "username" ? "Username" : "Email"}
                        </Label>
                        <Input
                            id="identifier"
                            name="identifier"
                            type={loginMethod === "email" ? "email" : "text"}
                            placeholder={
                                loginMethod === "username"
                                    ? "johndoe"
                                    : "john@example.com"
                            }
                            value={formData.identifier}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Log In
                    </Button>
                </form>

                <div className="mt-4 text-center">
                    <Button variant="link" asChild>
                        <Link href="/forgot-password">Forgot Password?</Link>
                    </Button>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        {`Don't have an account?`}{" "}
                        <Link
                            href="/signup"
                            className="text-primary hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
