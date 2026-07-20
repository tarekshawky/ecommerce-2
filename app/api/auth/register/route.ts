import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Never attach a new password to an existing account from this public,
    // unauthenticated endpoint — that would let anyone hijack an account
    // they don't own just by knowing its email address.
    return NextResponse.json(
      { error: "An account with this email already exists. Try signing in instead." },
      { status: 409 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      name: typeof name === "string" && name.trim() ? name.trim() : null,
      password: hashed,
      role: "USER",
    },
  });

  return NextResponse.json({ id: user.id, email: user.email });
}
