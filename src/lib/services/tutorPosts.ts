import { prisma } from "@/lib/prisma";
import type { TutorPostsResponse } from "@/lib/types/tutorPost";

export async function getTutorPosts({
  q,
  subject,
  page = 1,
  limit = 10,
}: {
  q?: string;
  subject?: string;
  page?: number;
  limit?: number;
}): Promise<TutorPostsResponse> {
  const where = {
    AND: [
      q
        ? {
            OR: [
              { user: { username: { contains: q.toLowerCase() } } },
              { bio: { contains: q.toLowerCase() } },
              { subjects: { contains: q.toLowerCase() } },
            ],
          }
        : {},
      subject
        ? {
            tutorSubjects: {
              some: {
                subject: {
                  subjectName: {
                    equals: subject,
                  },
                },
              },
            },
          }
        : {},
    ],
  };

  const [posts, total] = await Promise.all([
    prisma.tutorPost.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
        tutorSubjects: {
          include: {
            subject: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.tutorPost.count({ where }),
  ]);

  return {
    posts,
    total,
    pages: Math.ceil(total / limit),
  };
}

interface CreateTutorPostData {
  userId: number;
  bio: string;
  hourlyRate: number;
  contactInfo: string;
  experience: string;
  subjectId: string;
  availability: Record<string, boolean>;
  profilePhoto?: string;
  profileVideo?: string;
  resumePdf?: string;
}

export async function createTutorPost(data: CreateTutorPostData) {
  const tutorPost = await prisma.tutorPost.create({
    data: {
      userId: data.userId,
      bio: data.bio,
      hourlyRate: data.hourlyRate,
      contactInfo: data.contactInfo,
      experience: data.experience,
      availability: data.availability,
      profilePhoto: data.profilePhoto,
      profileVideo: data.profileVideo,
      resumePdf: data.resumePdf,
      tutorSubjects: {
        create: {
          subjectId: parseInt(data.subjectId),
        },
      },
    },
    include: {
      user: {
        select: {
          username: true,
          email: true,
        },
      },
      tutorSubjects: {
        include: {
          subject: true,
        },
      },
    },
  });

  return tutorPost;
}

export async function getTutorPostsByUserId(userId: number) {
  try {
    const posts = await prisma.tutorPost.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
        tutorSubjects: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching tutor posts:", error);
    throw error;
  }
}
