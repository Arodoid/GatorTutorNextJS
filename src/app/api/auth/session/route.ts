import { getSession } from "@/lib/utils/auth";

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return Response.json({ user: null });
    }

    return Response.json({ user: session });
  } catch (error) {
    return Response.json({ user: null });
  }
} 