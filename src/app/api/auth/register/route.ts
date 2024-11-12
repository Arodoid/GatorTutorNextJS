import { registerUser, checkUserExists, signIn } from "@/lib/services/auth";
import { RegisterFormData } from "@/lib/types/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const data: RegisterFormData = await request.json();

    // More detailed logging
    console.log("Registration attempt details:", {
      email: data.email,
      passwordLength: data?.password?.length,
      confirmPasswordLength: data?.confirmPassword?.length,
      termsAccepted: data.acceptTerms,
      passwordsMatch: data.password === data.confirmPassword,
      emailValid: data.email?.toLowerCase().endsWith("@sfsu.edu"),
    });

    // Validate required fields
    if (!data.email || !data.password || !data.confirmPassword) {
      const missingFields = [];
      if (!data.email) missingFields.push("email");
      if (!data.password) missingFields.push("password");
      if (!data.confirmPassword) missingFields.push("confirmPassword");

      return Response.json(
        {
          success: false,
          message: "Missing required fields",
          fields: missingFields,
        },
        { status: 400 }
      );
    }

    // Validate email domain
    if (!data.email.toLowerCase().endsWith("@sfsu.edu")) {
      return Response.json(
        { success: false, message: "Email must be an SFSU email address" },
        { status: 400 }
      );
    }

    // Validate password match
    if (data.password !== data.confirmPassword) {
      return Response.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Validate terms acceptance
    if (!data.acceptTerms) {
      return Response.json(
        { success: false, message: "You must accept the terms and conditions" },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await checkUserExists(data.email.toLowerCase());
    if (existingUser) {
      return Response.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    // Register user with try-catch
    try {
      const result = await registerUser(data);
      if (!result.success) {
        return Response.json(
          { success: false, message: "Registration failed" },
          { status: 400 }
        );
      }

      cookies().set({
        name: "session",
        value: result.token!,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      return Response.json({
        success: true,
        message: "Registration successful",
        user: result.user,
      });
    } catch (regError) {
      console.error("Registration service error:", regError);
      return Response.json(
        {
          success: false,
          message: "Registration service error",
          error: regError instanceof Error ? regError.message : "Unknown error",
          stack: regError instanceof Error ? regError.stack : undefined,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Registration route error:", error);
    return Response.json(
      {
        success: false,
        message: "Registration failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
