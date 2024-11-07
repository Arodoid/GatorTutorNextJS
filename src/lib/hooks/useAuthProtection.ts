import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface UseAuthProtectionOptions {
  returnTo?: string;
  formState?: any;
}

export function useAuthProtection({
  returnTo,
  formState,
}: UseAuthProtectionOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session");
        const { user } = await res.json();

        if (!user) {
          // Save current state
          sessionStorage.setItem(
            "authRedirect",
            JSON.stringify({
              returnTo: returnTo || window.location.pathname,
              formState,
              timestamp: Date.now(),
            })
          );

          // Construct return URL
          const params = new URLSearchParams(searchParams.toString());
          params.set("returnTo", returnTo || window.location.pathname);

          toast.info("Please sign in to continue");
          router.push(`/login?${params.toString()}`);
          return false;
        }
        return true;
      } catch (error) {
        console.error("Auth check failed:", error);
        return false;
      } finally {
        setIsChecking(false);
      }
    }

    checkAuth();
  }, [router, returnTo, formState, searchParams]);

  return { isChecking };
}
