import type { Subject } from "./subject";
import type { Prisma } from "@prisma/client";

export interface TutorPost {
  id: number;
  userId: number;
  bio: string;
  availability: Prisma.JsonValue;
  hourlyRate: Prisma.Decimal;
  contactInfo: string;
  createdAt: Date;
  updatedAt: Date;
  profilePhoto: string | null;
  profileVideo: string | null;
  experience: string | null;
  reviews: number | null;
  subjects: string | null;
  user: {
    username: string;
    email: string;
  };
  tutorSubjects: {
    subject: Subject;
    tutorId: number;
    subjectId: number;
  }[];
}

export interface TutorPostsResponse {
  posts: TutorPost[];
  total: number;
  pages: number;
}
