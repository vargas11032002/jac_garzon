import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tipo = searchParams.get("tipo"); // INGRESO | EGRESO | null = todos
  const mes  = searchParams.get("mes");
  const anio = searchParams.get("anio") ?? String(new Date().getFullYear());

  const where: Record<string, unknown> = {};
  if (tipo) where.tipo = tipo;
  if (mes && anio) {
    const inicio = new Date(Number(anio), Number(mes) - 1, 1);
    const fin    = new Date(Number(anio), Number(mes), 1);
    where.fecha  = { gte: inicio, lt: fin };
  } else if (anio) {
    where.fecha  = { gte: new Date(Number(anio), 0, 1), lt: new Date(Number(anio) + 1, 0, 1) };
  }

  const [transacciones, totales] = await Promise.all([
    prisma.transaccion.findMany({ where, orderBy: { fecha: "desc" } }),
    prisma.transaccion.groupBy({
      by: ["tipo"],
      _sum: { valor: true },
      where: { fecha: { gte: new Date(Number(anio), 0, 1), lt: new Date(Number(anio) + 1, 0, 1) } },
    }),
  ]);

  const ingresos = totales.find(t => t.tipo === "INGRESO")?._sum.valor ?? 0;
  const egresos  = totales.find(t => t.tipo === "EGRESO")?._sum.valor ?? 0;

  return NextResponse.json({ transacciones, ingresos, egresos, saldo: ingresos - egresos });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tipo, concepto, valor, fecha, categoria, notas } = body;

  if (!tipo || !concepto || !valor) {
    return NextResponse.json({ error: "Tipo, concepto y valor son requeridos" }, { status: 400 });
  }

  const t = await prisma.transaccion.create({
    data: {
      tipo,
      concepto,
      valor: Number(valor),
      fecha: fecha ? new Date(fecha) : new Date(),
      categoria: categoria || null,
      notas: notas || null,
    },
  });
  return NextResponse.json(t, { status: 201 });
}
