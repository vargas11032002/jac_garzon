import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { prisma } = await import("@/lib/prisma");
  const cedula = (session.user as any).cedula ?? session.user.email;
  const afiliado = await prisma.afiliado.findUnique({
    where: { cedula },
    include: { cuotas: { orderBy: [{ anio: "desc" }, { mes: "asc" }] } },
  });
  if (!afiliado) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  const { password: _, ...rest } = afiliado;
  return NextResponse.json(rest);
}