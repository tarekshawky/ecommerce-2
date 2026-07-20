import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Admin-only sign-in. Regular customers use Google above; only
    // accounts with role=ADMIN and a password hash can use this.
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password || user.role !== "ADMIN") return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    // Customer email/password sign-in. Accounts are created via
    // /api/auth/register. The jwt callback below forces role=USER for
    // this provider regardless of what's in the DB, same as Google.
    CredentialsProvider({
      id: "customer-credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    // Customer-facing sign-in/error page. Keeps the admin-credentials
    // provider off of any screen a customer could land on — NextAuth's
    // built-in default page lists every provider, admin included.
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        // Only the dedicated admin-credentials flow may grant ADMIN in the
        // session. OAuth sign-ins (Google) are always plain customers, even
        // if that email happens to belong to an admin account in the DB.
        token.role = account.provider === "admin-credentials" ? user.role : "USER";
      } else if (token.sub && !token.role) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
        token.role = dbUser?.role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role ?? "USER";
      }
      return session;
    },
  },
};
