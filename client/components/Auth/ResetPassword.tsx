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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { api } from "@/app/api/api";
import throwError from "@/lib/throwError";

export default function ResetPasswordPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        otp: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");
        setError("");

        if (formData.otp.length !== 5 || !/^\d+$/.test(formData.otp)) {
            setError("OTP must be 5 digits");
            setIsSubmitting(false);
            return;
        }

        if (formData.newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            setIsSubmitting(false);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsSubmitting(false);
            return;
        }

        try {
            const { data } = await api.post("/auth/password/reset", {
                code: formData.otp,
                password: formData.newPassword,
            });

            await new Promise((resolve) => setTimeout(resolve, 500));
            setMessage(data?.message);

            setFormData({ otp: "", newPassword: "", confirmPassword: "" });
            await new Promise((resolve) => setTimeout(resolve, 1500));
            router.push("/login");
        } catch (err) {
            throwError(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                    Enter your OTP and new password
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="otp">One-Time Password (OTP)</Label>
                        <Input
                            id="otp"
                            name="otp"
                            type="text"
                            inputMode="numeric"
                            pattern="\d{5}"
                            maxLength={5}
                            placeholder="Enter 5-digit OTP"
                            value={formData.otp}
                            onChange={handleChange}
                            required
                            aria-describedby="otp-description"
                        />
                        <p
                            id="otp-description"
                            className="text-sm text-muted-foreground"
                        >
                            Enter the 5-digit code sent to your email
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            minLength={8}
                            aria-describedby="password-description"
                        />
                        <p
                            id="password-description"
                            className="text-sm text-muted-foreground"
                        >
                            Password must be at least 8 characters long
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            Confirm New Password
                        </Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength={8}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Resetting..." : "Reset Password"}
                    </Button>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {message && (
                        <Alert variant="default">
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
