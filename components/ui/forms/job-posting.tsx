"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "../textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";


const formSchema = z.object({
    job_title: z.string().min(1, { message: "Job title is required" }),
    job_description: z.string().min(1, { message: "Job description is required" }),
    candidates: z
        .string()
        .refine((val) => {
            const emails = val.split(/[,|\n|\s]+/).map((email) => email.trim());
            return emails.every((email) => /^\S+@\S+\.\S+$/.test(email));
        }, {
            message: "Please provide valid email addresses separated by commas or spaces.",
        }),
    experience: z.enum(["BEGINNER", "INTERMEDIATE", "EXPERT"]),
    end_date: z.string().min(1, { message: "Valid date is required" }),
});



export default function NewJobPostForm() {
    const { toast } = useToast()

    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            job_title: "",
            job_description: "",
            candidates: "",
            experience: "BEGINNER",
            end_date: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);

        let candidates = values.candidates
            .split(/[,|\n|\s]+/)
            .map((email) => email.trim())

        const data = {
            ...values,
            candidates
        }

        fetch("https://jbp-backend.onrender.com/api/jobs/createjob", {
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
                    variant: 'destructive',
                    title: err.message,
                });
            });

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-1/3 mb-10">
                <div className="font-bold text-3xl mb-10">
                    New Job Post
                </div>

                <FormField
                    control={form.control}
                    name="job_title"
                    render={({ field }) => (
                        <FormItem>
                            <div className="text-xs">Job title</div>
                            <FormControl>
                                <Input placeholder="ex: SWE" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="job_description"
                    render={({ field }) => (
                        <FormItem>
                            <div className="text-xs">Job Description</div>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter detailed job description"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                        <FormItem>
                            <div className="text-xs">Experience</div>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your experience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                                        <SelectItem value="EXPERT">Expert</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="candidates"
                    render={({ field }) => (
                        <FormItem>
                            <div className="text-xs">Candidates List</div>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter emails separated by commas"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                        <FormItem>
                            <div className="text-xs">End Date</div>
                            <FormControl>
                                <Input
                                    type="date"
                                    min="2023-01-01"
                                    max="2025-12-31"
                                    placeholder="yyyy-mm-dd"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">{loading ? "Sending.." : "Submit"}</Button>
            </form>
        </Form>
    )
}
