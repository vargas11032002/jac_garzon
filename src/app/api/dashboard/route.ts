import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const anio = new Date().getFullYear();
  const mes  = new Date().getMonth() + 1;

  const [
    totalAfiliados,
    afiliadosActivos,
    totalAcetas,
    proyectosActivos,
    cuotasPendientes,
    financiero,
    actividadReciente,
    proximosEventos,
    ultimosComunicados,
  ] = await Promise.all([
    prisma.afiliado.count(),
    prisma.afiliado.count({ where: { activo: true } }),
    prisma.acta.count({ where: { fecha: { gte: new Date(anio, 0, 1) } } }),
    prisma.proyecto.count({ where: { estado: "EN_EJECUCION" } }),
    prisma.cuota.aggregate({
      _sum: { valor: true },
      where: { pagado: false, mes: { lte: mes }, anio },
    }),
    prisma.transaccion.groupBy({
      by: ["tipo"],
      _sum: { valor: true },
      where: { fecha: { gte: new Date(anio, 0, 1) } },
    }),
    prisma.transaccion.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.evento.findMany({
      where: { fecha: { gte: new Date() } },
      orderBy: { fecha: "asc" },
      take: 4,
    }),
    prisma.comunicado.findMany({
      where: { publicado: true },
      orderBy: { fechaPublic: "desc" },
      take: 3,
    }),
  ]);

  const ingresos = financiero.find(f => f.tipo === "INGRESO")?._sum.valor ?? 0;
  const egresos  = financiero.find(f => f.tipo === "EGRESO")?._sum.valor ?? 0;

  return NextResponse.json({
    afiliados: { total: totalAfiliados, activos: afiliadosActivos },
    actas: totalAcetas,
    proyectosActivos,
    cuotasPendientes: cuotasPendientes._sum.valor ?? 0,
    financiero: { ingresos, egresos, saldo: ingresos - egresos },
    actividadReciente,
    proximosEventos,
    ultimosComunicados,
  });
}
