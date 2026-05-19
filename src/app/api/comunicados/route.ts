import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const comunicados = await prisma.comunicado.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(comunicados);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { titulo, contenido, tipo, publicado } = body;
  if (!titulo || !contenido) return NextResponse.json({ error: "Título y contenido son requeridos" }, { status: 400 });
  const comunicado = await prisma.comunicado.create({
    data: {
      titulo, contenido,
      tipo: tipo || "GENERAL",
      publicado: publicado ?? false,
      fechaPublic: publicado ? new Date() : null,
    },
  });
  return NextResponse.json(comunicado, { status: 201 });
}