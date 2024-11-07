import { writeFile } from "fs/promises";
import path from "path";

export async function saveFile(
  file: File,
  type: "images" | "videos" | "pdfs"
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a safe filename
  const timestamp = Date.now();
  const safeFileName = `${timestamp}-${file.name.replace(
    /[^a-zA-Z0-9.-]/g,
    ""
  )}`;

  // Define the path where the file will be saved
  const uploadDir = path.join(process.cwd(), "public", "uploads", type);
  const filePath = path.join(uploadDir, safeFileName);

  // Save the file
  await writeFile(filePath, buffer);

  // Return the relative path to be stored in the database
  return `/uploads/${type}/${safeFileName}`;
}
