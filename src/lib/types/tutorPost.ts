import type { Subject } from "./subject";
import type { Prisma } from "@prisma/client";

export interface TutorPost {
  id: number;
  userId: number;
  displayName: string;
  bio: string;
  availability: Prisma.JsonValue;
  hourlyRate: Prisma.Decimal;
  contactInfo: string;
  createdAt: Date;
  updatedAt: Date;
  profilePhoto: string | null;
  profileVideo: string | null;
  resumePdf: string | null;
  experience: string | null;
  reviews: number | null;
  subjects: string | null;
  user: {
    email: string;
    username?: string;
  };
  tutorSubjects: {
    subject: Subject;
    tutorId: number;
    subjectId: number;
  }[];
}

export interface TutorPostsResponse {
  posts: TutorPost[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalCount: number;
  };
}
