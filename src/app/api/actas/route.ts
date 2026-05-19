import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const actas = await prisma.acta.findMany({ orderBy: { fecha: "desc" } });
  return NextResponse.json(actas);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { numero, fecha, tipo, lugar, asistentes, orden, contenido } = body;
  if (!fecha || !tipo || !lugar) return NextResponse.json({ error: "Fecha, tipo y lugar son requeridos" }, { status: 400 });
  const ultimo = await prisma.acta.findFirst({ orderBy: { numero: "desc" } });
  const acta = await prisma.acta.create({
    data: {
      numero: numero ?? (ultimo ? ultimo.numero + 1 : 1),
      fecha: new Date(fecha),
      tipo, lugar,
      asistentes: Number(asistentes) || 0,
      orden: orden ?? "[]",
      contenido: contenido ?? "",
      aprobada: false,
    },
  });
  return NextResponse.json(acta, { status: 201 });
}