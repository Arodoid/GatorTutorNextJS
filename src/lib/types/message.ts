import type { User } from "@prisma/client";

/**
 * Message Type
 *
 * This is the shape of a message in our system. It includes:
 * - Basic message info (id, content, timestamps)
 * - Who sent it and who received it
 * - The tutor post it's about
 * - Whether it's been read
 *
 * Note: We only include email for users (no other personal info)
 * Note: For tutor posts, we just grab the basics (rate and subjects)
 */
export interface Message {
  // Core message data
  id: number;
  message: string;
  createdAt: Date;
  readAt: Date | null; // null means unread

  // Relationship IDs
  senderId: number; // Who sent it
  recipientId: number; // Who it's for
  tutorPostId: number; // Which tutor post it's about

  // Related user data (just emails)
  sender: {
    email: string;
  };
  recipient: {
    email: string;
  };

  // Related tutor post data
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

/**
 * Message Response
 *
 * What the API sends back when you request messages:
 * - success: Did the request work?
 * - message: Any error/success messages
 * - data: The actual messages (if successful)
 */
export interface MessageResponse {
  success: boolean;
  message?: string;
  data?: Message[];
}
