import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, plainPassword } = credentials as {
          email: string;
          plainPassword: string;
        };

        try {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            return Promise.reject(new Error("User Not Found"));
          }

          const comparePassword = await bcrypt.compare(
            plainPassword,
            user?.password as string
          );

          if (!comparePassword) {
            return Promise.reject(new Error("Wrong Password"));
          }

          const { userId, password, ...other } = user;

          return { id: userId, ...other };
        } catch (error) {
          return Promise.reject(new Error("500"));
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, session }) {
      user && (token.user = user);
      return token;
    },
    async session({ session, token }) {
      const user = token.user as User;
      session.user = user;

      return session;
    },
  },
};

export default NextAuth(authOptions);
