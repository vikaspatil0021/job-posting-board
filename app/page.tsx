"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
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
          if (!data.success) {
            router.push("/login");
          }
        }
      } catch (error) {
        console.log("Error verifying token:", error);
      }
    };

    verifyToken();
  }, [])

  const Logout_handler = async () => {
    try {
      const response = await fetch("https://jbp-backend.onrender.com/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.status == 200) {
        router.push("/login");
      }
    } catch (error) {
      console.log("Error verifying token:", error);
    }
  }

  return (
    <>
      <div className="h-full w-full flex flex-col items-center mt-24">
        <Button onClick={Logout_handler}>
          Logout
        </Button>
      </div>
    </>
  );
}
