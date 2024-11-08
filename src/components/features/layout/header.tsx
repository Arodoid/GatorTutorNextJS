"use client";

import Link from "next/link";
import { useSubjects } from "@/lib/hooks/useSubjects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import { useDebouncedCallback } from "use-debounce";
import { useTransition } from "react";
import { useEffect, useState } from "react";
import { UserWithoutPassword } from "@/lib/types/auth";
import { LogOut, User, ChevronDown } from "lucide-react";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { activeSubjects, error } = useSubjects();
  const [isPending, startTransition] = useTransition();
  const [user, setUser] = useState<UserWithoutPassword | null>(null);

  const currentSearch = searchParams.get("q") ?? "";
  const currentSubject = searchParams.get("subject") ?? "all";
  const isOnTutorsPage = pathname === "/tutors";

  const debouncedSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    startTransition(() => {
      router.replace(`/tutors?${params.toString()}`, { scroll: false });
    });
  }, 300);

  const handleSubjectChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== "all") {
      params.set("subject", value);
    } else {
      params.delete("subject");
    }
    startTransition(() => {
      router.push(`/tutors?${params.toString()}`);
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isOnTutorsPage) {
      debouncedSearch(e.target.value);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchInput = (e.target as HTMLFormElement)?.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    const searchTerm = searchInput?.value || "";

    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("q", searchTerm);
    } else {
      params.delete("q");
    }

    router.push(`/tutors?${params.toString()}`);
  };

  useEffect(() => {
    // Check session on component mount
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(console.error);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderNavigation = () => {
    if (user) {
      return (
        <div className="hidden lg:flex items-center space-x-2">
          <Link
            href="/tutors"
            className="flex items-center px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <span className="text-lg text-white hover:text-[#FFC726] transition-colors">
              Find a Tutor
            </span>
          </Link>
          <Link
            href="/become-a-tutor"
            className="flex items-center px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <span className="text-lg text-white hover:text-[#FFC726] transition-colors">
              Create Tutor Post
            </span>
          </Link>
          <div className="group relative">
            <Link
              href="/dashboard"
              className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
            >
              <span className="text-lg text-white group-hover:text-[#FFC726] transition-colors">
                {user.email.split("@")[0]}
              </span>
              <ChevronDown className="h-4 w-4 text-white group-hover:text-[#FFC726] transition-colors" />
            </Link>

            {/* Hover Dropdown */}
            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute right-0 mt-1 w-56 transition-all duration-150 z-50">
              <div className="bg-white rounded-md shadow-lg py-1">
                <Link
                  href="/dashboard"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <nav className="hidden lg:block">
        <ul className="flex items-center space-x-2">
          <li>
            <Link
              href="/tutors"
              className="flex items-center px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
            >
              <span className="text-lg text-white hover:text-[#FFC726] transition-colors">
                Find a Tutor
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/become-a-tutor"
              className="flex items-center px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
            >
              <span className="text-lg text-white hover:text-[#FFC726] transition-colors">
                Create Tutor Post
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="px-6 py-2 text-[#4B2E83] bg-[#FFC726] hover:bg-[#FFD54F] rounded-md text-lg font-medium ml-2"
            >
              Login
            </Link>
          </li>
        </ul>
      </nav>
    );
  };

  const renderMobileMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 lg:hidden">
        <Menu className="w-6 h-6 text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white">
        <DropdownMenuItem asChild>
          <Link href="/tutors" className="text-[#4B2E83] hover:bg-gray-100">
            Find a Tutor
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/become-a-tutor"
            className="text-[#4B2E83] hover:bg-gray-100"
          >
            Create Tutor Post
          </Link>
        </DropdownMenuItem>
        {user ? (
          <>
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard"
                className="text-[#4B2E83] hover:bg-gray-100"
              >
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 hover:bg-gray-100 cursor-pointer"
            >
              Logout
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/login" className="text-[#4B2E83] hover:bg-gray-100">
              Login
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="bg-[#4B2E83] text-white shadow-md relative z-40">
      <div className="container flex items-center justify-between px-6 py-3 mx-auto max-w-[1400px]">
        <Link href="/" className="flex items-center space-x-3 shrink-0">
          <Image
            src="/images/logoIcon.png"
            alt="GatorTutor Logo"
            width={44}
            height={44}
            priority
          />
          <div className="flex flex-col max-lg:hidden">
            <span className="text-2xl font-bold text-[#FFC726]">
              GatorTutor
            </span>
            <span className="text-xs leading-tight">CSC648-848 Team 6</span>
          </div>
        </Link>

        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center mx-8 transition-all duration-300 bg-white rounded-full max-w-3xl flex-1"
        >
          <Select value={currentSubject} onValueChange={handleSubjectChange}>
            <SelectTrigger className="w-fit bg-white text-[#4B2E83] h-10 px-4 font-bold rounded-l-full border-none focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent
              className="bg-white text-[#4B2E83]"
              align="start"
              position="popper"
              sideOffset={5}
              avoidCollisions
            >
              <SelectItem value="all" className="font-bold whitespace-nowrap">
                All Subjects
              </SelectItem>
              {activeSubjects?.map((subject) => (
                <SelectItem
                  key={subject.id}
                  value={subject.subjectName}
                  className="flex items-center justify-between whitespace-nowrap"
                >
                  <span>{subject.subjectName}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({subject.tutorCount})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1">
            <input
              type="text"
              defaultValue={currentSearch}
              onChange={handleSearchChange}
              placeholder="Search tutors, subjects, or keywords..."
              className="w-full h-10 px-4 text-[#4B2E83] focus:outline-none"
            />
            {isPending && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#FFC726] h-10 px-4 rounded-r-full flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 text-[#4B2E83]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </form>

        {renderNavigation()}

        {renderMobileMenu()}
      </div>
    </header>
  );
}
