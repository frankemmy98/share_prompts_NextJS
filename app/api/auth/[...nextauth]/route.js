import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
  // options object
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      // to get the data of a "User" every single time to keep an existing and running session
      const sessionUser = await User.findOne({
        email: session.user.email,
      });

      // updating the id
      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({ profile }) {
      try {
        // NB => every next.js route is a serverless route
        // serverless => Lambda => dynamodb
        // that opens up only when they are called

        await connectToDB();

        // check if a user already exists
        const userExists = await User.findOne({
          email: profile.email,
        });

        // if not, create a new user
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name
              .replace(" ", "") // to remove spaces
              .toLowerCase(),
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
