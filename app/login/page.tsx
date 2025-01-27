"use client"
import LoginForm from "@/components/ui/forms/login-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch("https://jbp-backend.onrender.com/api/auth/verify_session", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        router.push("/dashboard");
                    }
                }
            } catch (error) {
                console.log("Error verifying token:", error);
            }
        };

        verifyToken();
    }, [])
    return (
        <>
            <div className="h-full w-full flex justify-center mt-24">
                <LoginForm />
            </div>
        </>
    );
}
