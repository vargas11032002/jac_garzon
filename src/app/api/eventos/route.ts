import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const eventos = await prisma.evento.findMany({ orderBy: { fecha: "asc" } });
  return NextResponse.json(eventos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { titulo, descripcion, fecha, horaInicio, horaFin, lugar, tipo } = body;
  if (!titulo || !fecha) return NextResponse.json({ error: "Título y fecha son requeridos" }, { status: 400 });
  const evento = await prisma.evento.create({
    data: {
      titulo, descripcion: descripcion || null,
      fecha: new Date(fecha),
      horaInicio: horaInicio || null, horaFin: horaFin || null,
      lugar: lugar || null, tipo: tipo || "REUNION",
    },
  });
  return NextResponse.json(evento, { status: 201 });
}