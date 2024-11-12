import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { RegisterFormData } from "@/lib/types/auth";
import jwt from "jsonwebtoken";

/**
 * Auth Service
 *
 * This is our authentication service. It handles all the nitty-gritty
 * auth stuff like registering users, signing them in, and checking if they exist.
 *
 * What's in the box:
 * -----------------
 * - checkUserExists: Quick email lookup
 * - registerUser: New user signup + JWT token
 * - signIn: User login + JWT token
 *
 * !IMPORTANT: Make sure JWT_SECRET is set in your .env! It's used to sign the JWT token for authentication
 * !IMPORTANT: Passwords are hashed with bcrypt (10 rounds) so don't worry about it
 */

/**
 * Simple email check - useful for:
 * - Registration validation
 * - Password reset flows
 * - Account lookups
 */
export async function checkUserExists(email: string) {
  const existingUser = await prisma.user.findFirst({
    where: { email },
  });
  return existingUser;
}

/**
 * New user registration
 *
 * Takes registration form data and:
 * 1. Validates JWT secret exists (would be bad if it didn't!)
 * 2. Hashes the password with bcrypt (10 rounds is pretty solid)
 * 3. Creates user in DB (emails forced to lowercase)
 * 4. Returns a nice JWT token (valid for a week)
 *
 * !IMPORTANT: Only returns id and email (no password!)
 */
export async function registerUser(data: RegisterFormData) {
  try {
    // Need this for JWT signing
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Hash that password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create the user (notice we only select id and email)
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    // Give them a token that's good for a week
    const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
      expiresIn: "7d",
    });

    return { success: true, user, token };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

/**
 * User sign in
 *
 * The login flow:
 * 1. Check JWT secret (again, important!)
 * 2. Find user and compare password hash
 * 3. Update their last login timestamp
 * 4. Give them a fresh JWT token
 *
 * If anything fails, they get a generic error
 * (we don't want to give away too much info)
 *
 * !IMPORTANT: Never returns the password hash
 */
export async function signIn(email: string, password: string) {
  try {
    // Same JWT check as register
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables");
      return { success: false, message: "Server configuration error" };
    }

    // Find user and get their password hash using a super simple prisma query
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
      select: {
        id: true, // We need this for the token
        email: true, // We need this for the token
        password: true, // We need this to check the password
      },
    });

    // Check password or bail if no match
    // bcrypt.compare basically just returns true/false, and it knows
    // to return false if the user doesn't exist (so no need to check that)
    // bcrypt.compare is async so we need to await it
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { success: false, message: "Invalid credentials" };
    }

    // Track when they last logged in (for analytics or whatever)
    // It is just a column in the DB so it's cheap
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Fresh token time
    const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
      expiresIn: "7d",
    });

    // Never send the password back! unless you are a hacker (this would be a great place to have a backdoor lol)
    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword, token };
  } catch (error) {
    console.error("Sign in error:", error);
    return { success: false, message: "Authentication failed" };
  }
}
