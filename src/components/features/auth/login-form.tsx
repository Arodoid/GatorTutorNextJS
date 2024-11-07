"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

interface LoginFormData {
  email: string;
  password: string;
}

const formSchema = z.object({
  email: z
    .string()
    .email()
    .endsWith("@sfsu.edu", "Must be an SFSU email address (@sfsu.edu)"),
  password: z.string().min(8),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const watchedFields = form.watch();
  const emailError = form.formState.errors.email;
  const passwordError = form.formState.errors.password;

  // Handle successful login
  const handleLoginSuccess = async () => {
    const pendingAction = sessionStorage.getItem("pendingTutorForm");

    if (pendingAction) {
      const { formData, action } = JSON.parse(pendingAction);
      sessionStorage.removeItem("pendingTutorForm");

      if (action === "createTutor") {
        try {
          const response = await fetch("/api/tutors/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          if (!response.ok) throw new Error();

          await router.push("/dashboard");
          toast.success("Tutor profile created successfully!", {
            description: "Students can now find and contact you",
            action: {
              label: "View Profile",
              onClick: () => router.push("/profile"),
            },
          });
          return;
        } catch (error) {
          toast.error("Failed to create tutor profile", {
            description: "Please try again later",
          });
        }
      }
    }

    // Default redirect
    await router.push("/dashboard");
    toast.success("Welcome back!", {
      description: "You've successfully signed in",
    });
  };

  async function onSubmit(values: LoginFormData) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      handleLoginSuccess();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Invalid credentials",
        { description: "Please check your email and password" }
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="you@sfsu.edu"
                  type="email"
                  className={cn(
                    "h-11 text-base transition-colors",
                    emailError && "border-red-500 focus-visible:ring-red-500"
                  )}
                  disabled={isLoading}
                  onChange={(e) => {
                    field.onChange(e);
                    form.trigger("email");
                  }}
                />
              </FormControl>
              {watchedFields.email && !emailError && (
                <p className="text-sm text-green-600">✓ Valid SFSU email</p>
              )}
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter your password"
                  type="password"
                  className={cn(
                    "h-11 text-base transition-colors",
                    passwordError && "border-red-500 focus-visible:ring-red-500"
                  )}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex justify-start">
          <Link
            href="#"
            className="text-sm text-[#4B2E83] hover:text-[#FFC726] transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-32 h-11 bg-[#4B2E83] hover:bg-[#4B2E83]/90 text-white font-semibold rounded-md"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </div>
      </form>
    </Form>
  );
}
