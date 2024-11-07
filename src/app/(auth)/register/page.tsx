import Link from "next/link";
import { RegisterForm } from "@/components/features/auth/register-form";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <Card className="w-full border-none bg-white/95 shadow-2xl">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-[#4B2E83] flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[#FFC726]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#4B2E83]">
          Join GatorTutor
        </h1>
        <p className="text-base text-gray-600">
          Create your account with your SFSU email
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <RegisterForm />
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#4B2E83] hover:text-[#FFC726] transition-colors"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
