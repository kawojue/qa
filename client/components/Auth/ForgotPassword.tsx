"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import throwError from "@/lib/throwError";
import { api } from "@/app/api/api";

export default function ForgotPasswordPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        try {
            const { data } = await api.post("/auth/password/request", {
                email,
            });

            await new Promise((resolve) => setTimeout(resolve, 300));
            setMessage(data?.message);

            await new Promise((resolve) => setTimeout(resolve, 1500));
            router.push("/reset-password");
        } catch (err) {
            throwError(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Forgot Password</CardTitle>
                <CardDescription>
                    Enter your email to receive a one-time password
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-describedby="email-description"
                        />
                        <p
                            id="email-description"
                            className="text-sm text-muted-foreground"
                        >
                            We'll send a one-time password to this email
                            address.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Sending..." : "Send OTP"}
                    </Button>

                    {message && (
                        <p
                            className="text-sm text-center text-muted-foreground mt-2"
                            aria-live="polite"
                        >
                            {message}
                        </p>
                    )}
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        Remember your password?{" "}
                        <Link
                            href="/login"
                            className="text-primary hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
