import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { RegisterFormData } from "@/lib/types/auth";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function checkUserExists(email: string) {
  const existingUser = await prisma.user.findFirst({
    where: { email },
  });
  return existingUser;
}

export async function registerUser(data: RegisterFormData) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      username: data.email.split("@")[0],
    },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });

  return user;
}

export async function signIn(email: string, password: string) {
  const user = await prisma.user.findFirst({
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      password: true,
    },
  });

  if (!user) {
    return { success: false, message: "Invalid credentials" };
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return { success: false, message: "Invalid credentials" };
  }

  // Create JWT token
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  const { password: _, ...userWithoutPassword } = user;

  return {
    success: true,
    message: "Login successful",
    user: userWithoutPassword,
    token,
  };
}
