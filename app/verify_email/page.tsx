
"use client"

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
    const searchParams = useSearchParams();
    const [message, setMessage] = useState("Verifying email...");

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setMessage("Invalid token.");
            return;
        }

        fetch("http://localhost:5000/api/auth/verify_email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        }).then((res) => res.json())
            .then((data) => {
                setMessage(data.message);
            })
            .catch((err) => {
                console.error("Error verifying email:", err);
                setMessage("An error occurred while verifying the token.");
            });

    }, [searchParams]);


    return (
        <>
            <div className="h-full w-full flex flex-col items-center mt-24">
                {message}
                <Link href={"/login"} className="px-3 font-semibold underline">
                    Go back to Login
                </Link>
            </div>
        </>
    );
}
