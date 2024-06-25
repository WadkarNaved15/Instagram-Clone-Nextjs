import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler =  NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
],
    callbacks: {
        async session({ session, token, user }) {
          session.user.username = session.user.email.split('@')[0]
          session.user.uid = token.sub
          return session
        }
    }
  
})

export {handler as GET, handler as POST}