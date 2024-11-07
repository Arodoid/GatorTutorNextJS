/**
 * Prisma client for database operations.
 * This will get imported in many files
 * It allows us to use PrismaClient without creating a new instance every time
 */

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
