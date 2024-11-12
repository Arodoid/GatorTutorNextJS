import { writeFile } from "fs/promises";
import path from "path";

export async function saveFile(
  file: File,
  type: "images" | "videos" | "pdfs"
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename
  const filename = `${Date.now()}-${file.name}`;

  // Determine the subdirectory based on type
  const publicDir = path.join(process.cwd(), "public");
  const uploadDir = path.join(publicDir, type);
  const filePath = path.join(uploadDir, filename);

  // Save the file
  await writeFile(filePath, buffer);

  // Return the public URL path
  return `/${type}/${filename}`;
}
