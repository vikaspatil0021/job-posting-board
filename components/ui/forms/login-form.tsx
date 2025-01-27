"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";


const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[\W_]/, { message: "Password must contain at least one special character." })
})


export default function LoginForm() {
    const { toast } = useToast()

    const [loading,setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: '',
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true);
        
        fetch("https://jbp-backend.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then((res) => res.json())
            .then((data) => {
              console.log(data);
              setLoading(false)
              toast({
                title: data.message,
              })
            })
            .catch((err) => {
              console.log(err);
              setLoading(false)
              toast({
                variant:'destructive',
                title: err.message,
              });
            });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-1/3">
                <div className="font-bold text-3xl mb-10">
                    Login
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <div className="text-xs">Email</div>
                            <FormControl>
                                <Input placeholder="example@gmail.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="text-xs">Password</div>
                            <FormControl>
                                <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">{loading ? "Sending.." :"Submit"}</Button>
                <div>
                    <span>
                        Dont have an account?
                    </span>
                    <Link href="/register" className="text-black/70 underline font-semibold px-2">
                        Register here
                    </Link>
                </div>
            </form>
        </Form>
    )
}
