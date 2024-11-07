"use client";

import { useTutorPosts } from "@/lib/hooks/useTutorPosts";
import { TutorCard } from "@/components/features/tutors/tutor-card";
import { Skeleton } from "@/components/ui/skeleton";

export function TutorList() {
  const { posts, loading, error } = useTutorPosts();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="w-full h-48 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        Error loading tutors: {error}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="py-8 text-center text-gray-500">
        No tutors found matching your criteria
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:gap-8 w-full max-w-7xl mx-auto">
      {posts.map((tutor) => (
        <TutorCard key={tutor.id} tutor={tutor} />
      ))}
    </div>
  );
}
