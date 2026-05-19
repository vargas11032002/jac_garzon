import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { actual, nueva } = await req.json();
  if (!actual || !nueva) return NextResponse.json({ error: "Campos requeridos" }, { status: 400 });
  if (nueva.length < 6) return NextResponse.json({ error: "Mínimo 6 caracteres" }, { status: 400 });
  const { prisma } = await import("@/lib/prisma");
  const cedula = (session.user as any).cedula ?? session.user.email;
  const afiliado = await prisma.afiliado.findUnique({ where: { cedula } });
  if (!afiliado) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  const ok = await bcrypt.compare(actual, afiliado.password);
  if (!ok) return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 });
  const hash = await bcrypt.hash(nueva, 10);
  await prisma.afiliado.update({ where: { cedula }, data: { password: hash } });
  return NextResponse.json({ ok: true });
}