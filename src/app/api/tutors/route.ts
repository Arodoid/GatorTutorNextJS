import { getTutorPosts } from "@/lib/services/tutorPosts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || undefined;
  const subject = searchParams.get("subject") || undefined;
  const page = parseInt(searchParams.get("page") ?? "1");
  const minPrice = searchParams.get("minPrice") || undefined;
  const maxPrice = searchParams.get("maxPrice") || undefined;

  try {
    const data = await getTutorPosts({
      q,
      subject,
      page,
      minPrice,
      maxPrice,
    });
    return Response.json(data);
  } catch (error) {
    console.error("Tutor posts error:", error);
    return Response.json(
      { error: "Failed to fetch tutor posts" },
      { status: 500 }
    );
  }
}
