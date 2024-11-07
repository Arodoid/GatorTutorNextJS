import { registerUser, checkUserExists, signIn } from "@/lib/services/auth";
import { RegisterFormData } from "@/lib/types/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const data: RegisterFormData = await request.json();

    if (!data.email.endsWith("@sfsu.edu")) {
      return Response.json(
        { success: false, message: "Email must be an SFSU email address" },
        { status: 400 }
      );
    }

    const existingUser = await checkUserExists(data.email);
    if (existingUser) {
      return Response.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    // Register the user
    await registerUser(data);

    // Automatically sign in the user
    const signInResult = await signIn(data.email, data.password);

    if (signInResult.success && signInResult.token) {
      // Set the session cookie
      cookies().set({
        name: "session",
        value: signInResult.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return Response.json({
        success: true,
        message: "Registration and login successful",
        user: signInResult.user,
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      { success: false, message: "Registration failed" },
      { status: 500 }
    );
  }
}
