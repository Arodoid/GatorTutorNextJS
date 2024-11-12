import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { RedirectStateService } from "@/lib/services/redirect-state";

/**
 * Authentication Protection Hook
 *
 * Why this exists:
 * ----------------
 * Protects routes/features that require authentication while preserving form state (for example: a form they were filling out)
 * during the auth flow. Think of it as a checkpoint that remembers what you were doing.
 *
 * Input/Output:
 * -------------
 * IN  -> { returnTo?: string, formState?: any, immediate?: boolean }
 * OUT -> { isChecking: boolean, checkAuth: () => Promise<boolean> }
 *
 * Usage patterns:
 * --------------
 * 1. Protect an entire page:
 *    ```
 *    const { isChecking } = useAuthProtection();
 *    if (isChecking) return <LoadingSpinner />;
 *    ```
 *
 * 2. Protect a form submission:
 *    ```
 *    const { checkAuth } = useAuthProtection({
 *      formState: formData,
 *      immediate: false
 *    });
 *
 *    const onSubmit = async () => {
 *      if (!(await checkAuth())) return;
 *      // Continue with submission...
 *    };
 *    ```
 * -------------
 * So the flow of urls would be like this:
 * /login?returnTo=/tutors/1
 * then after login they are redirected to /tutors/1
 * then after submitting the form they are redirected to /tutors/1?returnTo=/tutors
 *
 * !IMPORTANT: Works in tandem with RedirectStateService to preserve state
 * TODO: Consider adding role-based protection options for tutors/admins/etc (not for this project)
 */

interface UseAuthProtectionOptions {
  returnTo?: string; // Path to return to after auth
  formState?: any; // Form data to preserve
  immediate?: boolean; // Whether to check auth immediately
}

export function useAuthProtection({
  returnTo,
  formState,
  immediate = true,
}: UseAuthProtectionOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isChecking, setIsChecking] = useState(true);

  /**
   * Authentication Check
   *
   * !IMPORTANT: Handles both immediate and manual auth checks
   *
   * Flow:
   * 1. Check session endpoint
   * 2. Save form state if needed
   * 3. Redirect to login if unauthenticated
   * 4. Return auth status
   *
   * @param redirect - Whether to redirect on auth failure
   * @returns boolean indicating auth status
   */
  const checkAuth = async (redirect = true) => {
    try {
      const response = await fetch("/api/auth/session");
      const { user } = await response.json();

      if (!user && redirect) {
        // Save form state before redirect
        if (formState) {
          RedirectStateService.save(
            returnTo || window.location.pathname,
            formState
          );
        }

        // Build redirect URL with returnTo parameter
        // This is used to redirect the user back to the page they were on after they login example: /tutors/1?returnTo=/tutors
        const params = new URLSearchParams(searchParams.toString());
        params.set("returnTo", returnTo || window.location.pathname);

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
  };

  /**
   * Immediate Auth Check
   *
   * Runs on mount if immediate option is true
   * Useful for protecting entire pages/components
   * TODO: Should probably be used in the layout file (I think?) but I am still learning the best practices for next.js
   */
  useEffect(() => {
    if (immediate) {
      checkAuth();
    }
  }, [immediate]);

  return { isChecking, checkAuth };
}
