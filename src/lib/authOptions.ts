import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        cedula:   { label: "Cédula",     type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.cedula || !credentials?.password) return null;
        const { prisma } = await import("@/lib/prisma");
        const afiliado = await prisma.afiliado.findUnique({ where: { cedula: credentials.cedula } });
        if (!afiliado || !afiliado.activo) return null;
        const ok = await bcrypt.compare(credentials.password, afiliado.password);
        if (!ok) return null;
        return {
          id: afiliado.id, name: `${afiliado.nombre} ${afiliado.apellido}`,
          email: afiliado.email ?? afiliado.cedula,
          cedula: afiliado.cedula, codigoJAC: afiliado.codigoJAC,
          cargo: afiliado.cargo, barrio: afiliado.barrio, foto: afiliado.foto,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id        = user.id;
        token.cedula    = (user as any).cedula;
        token.codigoJAC = (user as any).codigoJAC;
        token.cargo     = (user as any).cargo;
        token.barrio    = (user as any).barrio;
        token.foto      = (user as any).foto;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id        = token.id;
        (session.user as any).cedula    = token.cedula;
        (session.user as any).codigoJAC = token.codigoJAC;
        (session.user as any).cargo     = token.cargo;
        (session.user as any).barrio    = token.barrio;
        (session.user as any).foto      = token.foto;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: "jac-garzon-huila-2025-secret-key-xK9mP3qR7vN2",
};