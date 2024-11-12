import { saveFile } from "@/lib/utils/upload";
import { requireAuth } from "@/lib/utils/auth";

export async function POST(request: Request) {
  try {
    await requireAuth();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as "images" | "videos" | "pdfs";

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const filePath = await saveFile(file, type);
    return Response.json({ path: filePath });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
