import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { routing, type Locale } from "@/i18n/routing";
import { connectDB } from "@/lib/db";
import { isUserRole } from "@/lib/auth-roles";
import { User } from "@/lib/models/User";
import { verifyPassword } from "@/lib/password";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim() : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) {
          return null;
        }

        const normalizedEmail = email.toLowerCase();
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (
          adminEmail &&
          adminPassword &&
          normalizedEmail === adminEmail &&
          password === adminPassword
        ) {
          return {
            id: "admin-env",
            name: "Admin",
            email: adminEmail,
            role: "admin",
          };
        }

        await connectDB();
        const user = await User.findOne({
          email: normalizedEmail,
          portalEnabled: true,
        });

        if (!user || !verifyPassword(password, user.passwordHash)) {
          return null;
        }

        user.lastLoginAt = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: `/${routing.defaultLocale}/admin/login`,
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        const userRole = "role" in user ? user.role : undefined;
        token.role =
          typeof userRole === "string" && isUserRole(userRole) ? userRole : "client";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role =
          typeof token.role === "string" && isUserRole(token.role) ? token.role : "client";
      }

      return session;
    },
    async authorized({ auth: session, request }) {
      const pathname = request.nextUrl.pathname;
      const segments = pathname.split("/").filter(Boolean);

      const first = segments[0];
      const locale = routing.locales.includes(first as Locale)
        ? (first as Locale)
        : routing.defaultLocale;

      const isAdminRoute =
        (segments[0] === "admin" && segments.length >= 2) ||
        (routing.locales.includes(segments[0] as Locale) && segments[1] === "admin");

      const isAdminLogin =
        (segments[0] === "admin" && segments[1] === "login") ||
        (routing.locales.includes(segments[0] as Locale) &&
          segments[1] === "admin" &&
          segments[2] === "login");

      const isPortalRoute =
        (segments[0] === "portal" && segments.length >= 1) ||
        (routing.locales.includes(segments[0] as Locale) && segments[1] === "portal");

      const isPortalLogin =
        (segments[0] === "portal" && segments[1] === "login") ||
        (routing.locales.includes(segments[0] as Locale) &&
          segments[1] === "portal" &&
          segments[2] === "login");

      const role = session?.user?.role;

      if (isAdminRoute && !isAdminLogin) {
        if (!session?.user) {
          return Response.redirect(new URL(`/${locale}/admin/login`, request.url));
        }

        if (role !== "admin") {
          return Response.redirect(new URL(`/${locale}/portal`, request.url));
        }
      }

      if (isPortalRoute && !isPortalLogin) {
        if (!session?.user) {
          return Response.redirect(new URL(`/${locale}/portal/login`, request.url));
        }
      }

      return true;
    },
  },
});
