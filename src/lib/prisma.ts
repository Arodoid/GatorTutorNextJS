/**
 * Prisma Client Configuration
 *
 * This file creates a single, shared database connection for the entire app.
 *
 * Why a single instance?
 * ---------------------
 * 1. Performance: Creating multiple Prisma instances is expensive
 * 2. Connection Pool: One client manages all DB connections efficiently
 * 3. Hot Reloading: Prevents connection errors during development
 *
 * How it's used:
 * -------------
 * import { prisma } from "@/lib/prisma";
 *
 * Then in our code:
 * const users = await prisma.user.findMany();
 * const posts = await prisma.tutorPost.create({ ... });
 */

import { PrismaClient } from "@prisma/client";

// Create a single instance to be shared across the app
export const prisma = new PrismaClient();

// Note: In development, Next.js hot reloading can cause multiple instances
// In production, this isn't an issue as the server doesn't reload
// TODO: Add a check to make sure we only have one instance
// TODO: Add a shutdown hook to close the connection when the app stops (or restart)
// Nextjs might automatically add this, but I think it's better practice to do it ourselves
