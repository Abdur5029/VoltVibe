import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder-client-secret",
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          console.log(`[NextAuth] Authorize called with email: ${credentials.email}`);
          const res = await fetch(`${API_URL}/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });
          
          console.log(`[NextAuth] Django /login/ returned status: ${res.status}`);
          
          if (res.ok) {
            const user = await res.json();
            console.log(`[NextAuth] Django /login/ parsed user:`, user);
            return { id: user.id, name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username, email: user.email, role: user.role };
          } else {
            const errorText = await res.text();
            console.log(`[NextAuth] Django /login/ failed with response: ${errorText}`);
          }
        } catch (error) {
          console.error("NextAuth Django login error:", error);
        }
        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "voltvibe-secret-key-12345",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(`${API_URL}/login/google/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              google_id: user.id
            })
          });
          
          if (res.ok) {
            const djangoUser = await res.json();
            user.id = djangoUser.id; // Link to Django UUID
            (user as any).role = djangoUser.role;
            return true;
          } else {
            console.error("Failed to sync Google user with Django");
            return false;
          }
        } catch (error) {
          console.error("Google login error with Django:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        // ensure sub is correct if user id changed
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
      }
      return session;
    }
  }
})

export { handler as GET, handler as POST }
