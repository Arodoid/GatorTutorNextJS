import { getUserMessages } from "@/lib/services/messages";
import { getSession } from "@/lib/utils/auth";
import { createMessage } from "@/lib/services/messages";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const messages = await getUserMessages(parseInt(session.userId as string));
    return Response.json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      { success: false, message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { recipientId, tutorPostId, message } = await request.json();
    const newMessage = await createMessage(
      parseInt(session.userId as string),
      recipientId,
      tutorPostId,
      message
    );

    return Response.json({ success: true, data: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}
