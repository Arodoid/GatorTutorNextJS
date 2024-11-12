"use client"; // Marks this as a Client Component, enabling client-side interactivity and state management

import Link from "next/link"; // Next.js optimized link component for client-side navigation
import { LoginForm } from "@/components/features/auth/login-form";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // Shadcn/UI components for consistent styling
import { useSearchParams } from "next/navigation"; // Hook to access URL query parameters

/**
 * Login Page Component
 *
 * This page handles user authentication within the (auth) route group.
 * Route groups in Next.js (denoted by parentheses) are used to organize
 * files without affecting the URL structure.
 *
 * The page implements a card-based login interface with:
 * - A header with welcome message and icon
 * - The main login form
 * - A footer with registration link
 *
 * @returns {JSX.Element} The rendered login page
 */
export default function LoginPage() {
  // Retrieve URL parameters to handle redirect after login
  // This is commonly used for protected route redirects
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  return (
    // Card wrapper with glassmorphism effect using Tailwind's backdrop filters
    <Card className="w-full border-none bg-white/95 shadow-2xl">
      <CardHeader className="space-y-4 text-center pb-2">
        {/* 
          Custom avatar container using SFSU's purple (#4B2E83) as background
          with a gold (#FFC726) icon maintaining brand colors
        */}
        <div className="mx-auto w-20 h-20 rounded-full bg-[#4B2E83] flex items-center justify-center">
          <svg
            className="w-10 h-10 text-[#FFC726]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {/* SVG path for user icon */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        {/* 
          Text elements using SFSU brand colors
          tracking-tight reduces letter spacing for headers
        */}
        <h1 className="text-4xl font-bold tracking-tight text-[#4B2E83]">
          Welcome Back!
        </h1>
        <p className="text-lg text-gray-600">
          Enter your credentials to access your account
        </p>
      </CardHeader>

      {/* Main login form container */}
      <CardContent className="p-6">
        <LoginForm />
      </CardContent>

      {/* 
        Footer with registration link
        Preserves the returnTo parameter when navigating to registration
        This maintains the redirect chain for protected routes
      */}
      <CardFooter className="flex justify-center pb-8">
        <p className="text-base text-gray-600">
          Don't have an account?{" "}
          <Link
            href={`/register${returnTo ? `?returnTo=${returnTo}` : ""}`}
            className="font-semibold text-[#4B2E83] hover:text-[#FFC726] transition-colors"
          >
            Sign up now
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
