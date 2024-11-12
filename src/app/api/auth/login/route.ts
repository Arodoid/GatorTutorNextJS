import { signIn } from "@/lib/services/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const result = await signIn(email, password);

    if (!result.success) {
      return Response.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }

    if (result.token) {
      cookies().set({
        name: "session",
        value: result.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }

    return Response.json({
      success: true,
      message: "Login successful",
      user: result.user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}
