import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/utils/auth";

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const postId = parseInt(params.postId, 10);
    const userId = parseInt(session.userId as string, 10);

    // First verify that this post belongs to the user
    const post = await prisma.tutorPost.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    if (post.userId !== userId) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Delete the post
    await prisma.tutorPost.delete({
      where: { id: postId },
    });

    return Response.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete tutor post error:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to delete tutor post",
      },
      { status: 500 }
    );
  }
}
