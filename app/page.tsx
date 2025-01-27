"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type Job = {
  _id: string;
  company_id: string;
  jobTitle: string;
  jobDescription: string;
  experience: "BEGINNER" | "INTERMEDIATE" | "EXPERT";
  candidates: string[];
  endDate: string;
  __v: number;
}

export default function Home() {
  const router = useRouter();
  const { toast } = useToast()

  const [job_data, set_job_data] = useState([]);

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


  useEffect(() => {
    const fetchdata = async () => {

      try {
        const response = await fetch("https://jbp-backend.onrender.com/api/jobs/getjobs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();

        set_job_data(data)
      } catch (error) {
        console.log("Error verifying token:", error);
      }
    }
    fetchdata()
  }, [])

  const send_email_handler = async (jobId: string) => {
    try {
      const response = await fetch("https://jbp-backend.onrender.com/api/jobs/send_job_mails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ jobId })
      });

      if (response.status == 200) {
        toast({
          title: (await response.json()).message,
        })
      }
    } catch (error) {
      console.log("Error verifying token:", error);
    }
  }
  return (
    <>
      <div className="h-full w-full flex justify-center mt-10">
        <Button onClick={Logout_handler}>
          Logout
        </Button>
        <Link href={"/new-job-post"}>
          <Button className="mx-2">
            New Job Post
          </Button>
        </Link>

      </div>
      <div className="flex-col items-center justify-center ">
        {
          job_data.length != 0 && job_data.map((each: Job, index) => {
            return (
              <>
                <div key={each._id} className="flex justify-between mx-auto w-1/2 py-2">
                  <span>{each?.jobTitle}</span>
                  <span>{each.experience}</span>
                  <span>{each.endDate}</span>
                  <Button size={"sm"} onClick={() => send_email_handler(each._id)}>
                    send emails
                  </Button>
                </div>
              </>
            )
          })
        }
      </div>
    </>
  );
}
