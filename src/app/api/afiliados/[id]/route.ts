import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const afiliado = await prisma.afiliado.findUnique({
    where: { id },
    include: { cuotas: { orderBy: [{ anio: "desc" }, { mes: "asc" }] } },
  });
  if (!afiliado) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  const { password: _pw, ...rest } = afiliado;
  return NextResponse.json(rest);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { cedula: _c, password: _p, codigoJAC: _code, ...data } = body;
  const afiliado = await prisma.afiliado.update({
    where: { id },
    data: {
      ...data,
      vigenciaHasta: data.vigenciaHasta ? new Date(data.vigenciaHasta) : null,
    },
  });
  const { password: __, ...rest } = afiliado;
  return NextResponse.json(rest);
}

export async function DELETE(_req2: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.cuota.deleteMany({ where: { afiliadoId: id } });
  await prisma.afiliado.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
