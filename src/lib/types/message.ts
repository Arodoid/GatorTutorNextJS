import type { User } from "@prisma/client";

export interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  tutorPostId: number;
  message: string;
  createdAt: Date;
  readAt: Date | null;
  sender: {
    email: string;
  };
  recipient: {
    email: string;
  };
  tutorPost: {
    id: number;
    hourlyRate: number;
    tutorSubjects: {
      subject: {
        id: number;
        subjectName: string;
      };
    }[];
  };
}

export interface MessageResponse {
  success: boolean;
  message?: string;
  data?: Message[];
}
