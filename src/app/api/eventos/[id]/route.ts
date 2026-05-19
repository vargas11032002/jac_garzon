import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const evento = await prisma.evento.update({
    where: { id },
    data: { ...body, fecha: body.fecha ? new Date(body.fecha) : undefined },
  });
  return NextResponse.json(evento);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.evento.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}