import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const acta = await prisma.acta.findUnique({ where: { id } });
  if (!acta) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(acta);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const acta = await prisma.acta.update({
    where: { id },
    data: {
      ...body,
      fecha: body.fecha ? new Date(body.fecha) : undefined,
      asistentes: body.asistentes ? Number(body.asistentes) : undefined,
    },
  });
  return NextResponse.json(acta);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.acta.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}