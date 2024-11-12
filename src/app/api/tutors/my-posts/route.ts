import { getTutorPostsByUserId } from "@/lib/services/tutorPosts";
import { getSession } from "@/lib/utils/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = parseInt(session.userId as string, 10);

    if (isNaN(userId)) {
      return Response.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const posts = await getTutorPostsByUserId(userId);

    return Response.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Get tutor posts error:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch tutor posts",
      },
      { status: 500 }
    );
  }
}
