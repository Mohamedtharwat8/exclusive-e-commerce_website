import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `https://ecommerce.routemisr.com/api/v1/auth/signin`,
            {
              method: "POST",
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );
          const data = await res.json();

          // If no error and we have user data, return it
          if (!res.ok) {
            throw new Error(data.message);
          }
          const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
          console.log(decodedToken);
          return {
            //we need to put user id which is coming from data.token
            id: decodedToken.id,
            user: data.user,
            token: data.token,
          };
        } catch (error) {
          throw new Error((error as Error).message);
        }
      },
    }),
  ],
  // this will happen after successful login
  callbacks: {
     
    //this will encrypt the token by using AUTH_SECRET from .env 
    async jwt({ token, user }) {
      if (user) {
        token.user = user.user;
        token.token = user.token;
      }
      return token
    },
    // this will happen after jwt callback to encrypt the token that will appear in the cookies
    async session({ session, token }) {
      if (token) {
        session.user = token.user;
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
};
