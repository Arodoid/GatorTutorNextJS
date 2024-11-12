export function getImagePath(path: string | null): string {
  if (!path) return "/images/blank-pfp.png";

  // If the path already starts with http/https, return as is
  if (path.startsWith("http")) return path;

  // Remove any leading slashes and add a single leading slash
  const cleanPath = path.replace(/^\/+/, "");
  return `/${cleanPath}`;
}
