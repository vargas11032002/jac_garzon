import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const proyectos = await prisma.proyecto.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(proyectos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nombre, descripcion, estado, presupuesto, inicio, fin, responsable } = body;
  if (!nombre) return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
  const proyecto = await prisma.proyecto.create({
    data: {
      nombre,
      descripcion: descripcion || null,
      estado: estado || "PLANEACION",
      presupuesto: presupuesto ? Number(presupuesto) : null,
      ejecutado: 0,
      inicio: inicio ? new Date(inicio) : null,
      fin: fin ? new Date(fin) : null,
      responsable: responsable || null,
    },
  });
  return NextResponse.json(proyecto, { status: 201 });
}