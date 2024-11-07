import { createTutorPost } from "@/lib/services/tutorPosts";
import { getSession } from "@/lib/utils/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const tutorPost = await createTutorPost({
      userId: session.userId,
      ...data,
    });

    return Response.json({
      success: true,
      message: "Tutor post created successfully",
      post: tutorPost,
    });
  } catch (error) {
    console.error("Create tutor post error:", error);
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create tutor post",
      },
      { status: 500 }
    );
  }
}
