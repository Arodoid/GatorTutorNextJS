import { getActiveSubjects } from "@/lib/services/subjects";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const activeSubjects = await getActiveSubjects();
    return Response.json(activeSubjects);
  } catch (error) {
    console.error("Error fetching active subjects:", error);
    return Response.json(
      { error: "Failed to fetch active subjects" },
      { status: 500 }
    );
  }
}
