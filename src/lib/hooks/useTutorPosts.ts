import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { TutorPost, TutorPostsResponse } from "@/lib/types/tutorPost";

/**
 * Tutor Posts Hook 👩‍🏫
 * 
 * Why two fetches?
 * --------------
 * 1. ALL posts: Needed to calculate price ranges for filters
 * 2. FILTERED posts: What the user actually sees based on their search
 * 
 * The flow:
 * 1. Component mounts -> Fetch everything to set up filters
 * 2. User searches -> Fetch only matching posts
 * 3. Keep track of loading states and pages for smooth UX
 * 
 * !IMPORTANT: searchParams changes trigger new filtered fetches (so we need to watch them)
 */
export function useTutorPosts() {
  // Core post data
  const [posts, setPosts] = useState<TutorPost[]>([]);          // Filtered posts
  const [allPosts, setAllPosts] = useState<TutorPost[]>([]);    // All posts (for filters)
  
  // Pagination tracking
  const [totalCount, setTotalCount] = useState<number>(0);      // Total matching posts
  const [totalPages, setTotalPages] = useState<number>(0);      // Pages of results
  
  // Loading states
  const [loading, setLoading] = useState(true);                 // Currently fetching?
  const [initialLoad, setInitialLoad] = useState(true);         // First load ever?
  const [error, setError] = useState<string | null>(null);      // Track errors
  
  // Price range for filters
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 100,  // Default range until we calculate from real data
  });

  // Next.js URL search params (like ?subject=math&price=50)
  const searchParams = useSearchParams();

  // First fetch: Get ALL posts to set up our filters
  useEffect(() => {
    async function fetchAllPosts() {
      try {
        const res = await fetch("/api/tutors");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data: TutorPostsResponse = await res.json();
        setAllPosts(data.posts);

        // Find the real price range from actual tutor rates
        if (data.posts.length > 0) {
          const rates = data.posts.map((post) => Number(post.hourlyRate));
          setPriceRange({
            min: Math.min(...rates),  // Cheapest tutor
            max: Math.max(...rates),  // Most expensive tutor
          });
        }
      } catch (err) {
        console.error("Error fetching all posts:", err);
      }
    }

    fetchAllPosts();
  }, []);  // Empty array = run once on mount

  // Second fetch: Get FILTERED posts when search changes
  useEffect(() => {
    async function fetchPosts() {
      // Don't show loading spinner on first load (looks jumpy)
      if (!initialLoad) setLoading(true);
      
      try {
        // Add search params to URL (like ?subject=math)
        const res = await fetch(`/api/tutors?${searchParams.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        
        const data: TutorPostsResponse = await res.json();
        setPosts(data.posts);
        setTotalCount(data.pagination.totalCount);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    }

    fetchPosts();
  }, [searchParams]);  // Run when search params change

  // Everything components need to display and paginate posts
  return {
    posts,        // Filtered posts
    allPosts,     // All posts (for filters)
    total: totalCount,
    pages: totalPages,
    loading,
    error,
    priceRange,   // Min/max tutor rates
    initialLoad,
  };
}
