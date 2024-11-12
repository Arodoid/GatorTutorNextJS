import { CreateTutorForm } from "@/components/features/tutors/create-tutor-form";

/**
 * Become a Tutor Page
 *
 * Displays the tutor registration form in a styled container with:
 * - Frosted glass effect using backdrop blur
 * - Responsive padding and max-width
 * - Elevated card design with rounded corners
 */
export default function CreateTutorPostPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      {/* Centered container with frosted glass effect */}
      <div className="max-w-6xl mx-auto bg-white/75 backdrop-blur-md rounded-3xl p-8 shadow-lg">
        <CreateTutorForm />
      </div>
    </div>
  );
}
