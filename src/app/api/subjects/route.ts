import { getAllSubjects } from "@/lib/services/subjects";

export async function GET() {
  try {
    const subjects = await getAllSubjects();
    return Response.json(subjects);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
