"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import NewJobPostForm from "@/components/ui/forms/job-posting";

export default function NewPostPage() {
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

                if (response.status == 401) {
                    router.push("/login");
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
                <NewJobPostForm />
            </div>
        </>
    );
}
