import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const cuota = await prisma.cuota.update({
    where: { id },
    data: {
      pagado: body.pagado,
      fechaPago: body.fechaPago ? new Date(body.fechaPago) : null,
      comprobante: body.comprobante ?? null,
    },
  });
  return NextResponse.json(cuota);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.cuota.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}