"use client";

import { api } from "@/app/api/api";
import { useEffect, FC, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

export const CheckAuth: FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem("token");

        async function auth() {
            try {
                if (!token) throw new Error("No token");
                await api.get("/auth", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (pathname !== "/") {
                    router.push("/");
                }
            } catch {
                if (
                    ![
                        "/login",
                        "/signup",
                        "/reset-password",
                        "/forgot-password",
                    ].includes(pathname)
                ) {
                    router.push("/login");
                }
            }
        }

        auth();
    }, [router, pathname]);

    return <>{children}</>;
};
