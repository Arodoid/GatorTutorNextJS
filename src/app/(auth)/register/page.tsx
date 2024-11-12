"use client"; // Enables client-side interactivity for form handling and state management

// Next.js and Component Imports
import Link from "next/link"; // Optimized link component for client-side navigation
import { RegisterForm } from "@/components/features/auth/register-form"; // Custom form component for user registration
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // Shadcn/UI card components for consistent layout
import { useSearchParams } from "next/navigation"; // Hook to access URL query parameters

/**
 * Registration Page Component
 *
 * This component handles new user registration within the (auth) route group.
 * It maintains visual consistency with the login page while providing
 * registration-specific functionality.
 *
 * Key Features:
 * - SFSU email validation
 * - Protected route redirect handling
 * - Consistent brand styling
 * - Responsive card layout
 */
export default function RegisterPage() {
  // Retrieve returnTo parameter for post-registration redirect
  // This preserves the user's intended destination after authentication
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  return (
    // Main card container with glassmorphism effect
    // bg-white/95 creates semi-transparent white background
    // shadow-2xl adds pronounced drop shadow for depth
    <Card className="w-full border-none bg-white/95 shadow-2xl">
      <CardHeader className="space-y-3 text-center">
        {/* 
          User icon container
          Uses SFSU brand colors:
          - Background: Purple (#4B2E83)
          - Icon: Gold (#FFC726)
        */}
        <div className="mx-auto w-16 h-16 rounded-full bg-[#4B2E83] flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[#FFC726]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {/* 
              SVG path for user-plus icon
              Represents new user registration with a combined user silhouette and plus symbol
            */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>

        {/* 
          Header text with brand styling
          tracking-tight reduces letter spacing for better visual appeal
        */}
        <h1 className="text-3xl font-bold tracking-tight text-[#4B2E83]">
          Join GatorTutor
        </h1>
        <p className="text-base text-gray-600">
          Create your account with your SFSU email
        </p>
      </CardHeader>

      {/* 
        Main registration form container
        Form component handles email validation, password requirements,
        and terms acceptance
      */}
      <CardContent className="p-6">
        <RegisterForm />
      </CardContent>

      {/* 
        Footer with login link
        Preserves returnTo parameter when switching to login
        This maintains the redirect chain for protected routes
      */}
      <CardFooter className="flex justify-center pb-6">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href={`/login${returnTo ? `?returnTo=${returnTo}` : ""}`}
            className="font-semibold text-[#4B2E83] hover:text-[#FFC726] transition-colors"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
