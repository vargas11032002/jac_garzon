"use client";
import { useEffect, useState } from "react";
import { Users, FileText, FolderKanban, Wallet, TrendingUp, AlertCircle, CalendarDays, Megaphone, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";

const fmt = (v: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

interface DashData {
  afiliados: { total: number; activos: number };
  actas: number;
  proyectosActivos: number;
  cuotasPendientes: number;
  financiero: { ingresos: number; egresos: number; saldo: number };
  actividadReciente: Array<{ id: string; tipo: string; concepto: string; valor: number; fecha: string }>;
  proximosEventos: Array<{ id: string; titulo: string; fecha: string; lugar: string | null; tipo: string }>;
  ultimosComunicados: Array<{ id: string; titulo: string; tipo: string; fechaPublic: string | null }>;
}

const colorMap: Record<string, string> = {
  verde: "border-l-verde-500 text-verde-600 bg-verde-50",
  dorado: "border-l-dorado-500 text-dorado-500 bg-amber-50",
  azul:   "border-l-blue-600 text-blue-700 bg-blue-50",
  rojo:   "border-l-red-500 text-red-600 bg-red-50",
};

export default function DashboardPage() {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  const stats = data ? [
    { label: "Afiliados Activos", value: String(data.afiliados.activos), sub: `${data.afiliados.total} total registrados`, color: "verde", icon: Users, href: "/afiliados" },
    { label: "Cuotas Pendientes", value: fmt(data.cuotasPendientes), sub: "Por recaudar (vencidas)", color: "dorado", icon: Wallet, href: "/afiliados" },
    { label: "Proyectos Activos", value: String(data.proyectosActivos), sub: "En ejecución", color: "azul", icon: FolderKanban, href: "/proyectos" },
    { label: "Actas del Año", value: String(data.actas), sub: "Reuniones registradas", color: "rojo", icon: FileText, href: "/actas" },
  ] : [];

  if (loading) return (
    <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-stone-200 border-t-verde-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Cargando panel...</p>
      </div>
    </main>
  );

  return (
    <main className="flex-1 p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8 animate-fade-up">
        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-verde-500 mb-1">Bienvenido al sistema</p>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-cafe">Panel Principal</h2>
        <p className="text-sm text-gray-500 mt-1">Junta de Acción Comunal — Garzón, Huila</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {stats.map(({ label, value, sub, color, icon: Icon, href }, i) => {
          const [border, text, bg] = colorMap[color].split(" ");
          return (
            <Link key={label} href={href}
              className={`bg-white rounded-2xl p-4 md:p-5 border border-stone-100 border-l-4 ${border} shadow-sm hover:shadow-md transition-all animate-fade-up animate-fade-up-${i+1} group`}>
              <div className="flex items-start justify-between mb-2 md:mb-3">
                <p className="text-[9px] md:text-[10px] font-semibold tracking-[1.5px] uppercase text-gray-400 leading-tight">{label}</p>
                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg ${bg} flex items-center justify-center group-hover:scale-110 transition-transform shrink-0 ml-1`}>
                  <Icon size={14} className={text} />
                </div>
              </div>
              <p className={`font-display text-2xl md:text-4xl font-semibold mb-1 ${text}`}>{value}</p>
              <p className="text-[10px] md:text-xs text-gray-400 leading-tight">{sub}</p>
            </Link>
          );
        })}
      </div>

      {/* Mid grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-5 md:mb-6">
        {/* Actividad reciente */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
          <div className="px-4 md:px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-display text-base md:text-lg font-semibold text-cafe">Movimientos Recientes</h3>
            <Link href="/tesoreria" className="text-xs text-verde-600 font-medium hover:underline">Ver tesorería</Link>
          </div>
          <div className="divide-y divide-stone-50">
            {data!.actividadReciente.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-verde-50 flex items-center justify-center mb-3">
                  <TrendingUp size={22} className="text-verde-500" />
                </div>
                <p className="font-display text-base text-cafe/50">Sin movimientos aún</p>
                <Link href="/tesoreria" className="text-xs text-verde-600 mt-2 hover:underline font-medium">Registrar primer movimiento</Link>
              </div>
            ) : data!.actividadReciente.map(t => (
              <div key={t.id} className="px-4 md:px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${t.tipo === "INGRESO" ? "bg-verde-50" : "bg-red-50"}`}>
                    {t.tipo === "INGRESO"
                      ? <ArrowUpRight size={15} className="text-verde-500" />
                      : <ArrowDownRight size={15} className="text-red-400" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-cafe truncate max-w-[160px] md:max-w-none">{t.concepto}</p>
                    <p className="text-xs text-gray-400">{new Date(t.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold shrink-0 ml-2 ${t.tipo === "INGRESO" ? "text-verde-600" : "text-red-500"}`}>
                  {t.tipo === "EGRESO" ? "-" : "+"}
                  {fmt(t.valor)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Estado financiero + alertas */}
        <div className="space-y-4">
          {/* Financiero */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="px-4 md:px-5 py-4 border-b border-stone-100">
              <h3 className="font-display text-base font-semibold text-cafe">Estado Financiero</h3>
              <p className="text-xs text-gray-400">{new Date().getFullYear()}</p>
            </div>
            <div className="p-4 md:p-5 space-y-3">
              {[
                { label: "Saldo", value: data!.financiero.saldo, color: data!.financiero.saldo >= 0 ? "text-verde-600" : "text-red-500" },
                { label: "Ingresos", value: data!.financiero.ingresos, color: "text-blue-600" },
                { label: "Egresos", value: data!.financiero.egresos, color: "text-red-500" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{label}</span>
                  <span className={`text-sm font-semibold ${color}`}>{fmt(value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alertas */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="px-4 md:px-5 py-4 border-b border-stone-100">
              <h3 className="font-display text-base font-semibold text-cafe">Alertas</h3>
            </div>
            <div className="p-4 space-y-2">
              {data!.cuotasPendientes > 0 && (
                <div className="flex gap-2 items-start p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <AlertCircle size={14} className="text-dorado-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-cafe"><strong>{fmt(data!.cuotasPendientes)}</strong> en cuotas vencidas por recaudar</p>
                </div>
              )}
              {data!.afiliados.total === 0 && (
                <div className="flex gap-2 items-start p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <AlertCircle size={14} className="text-dorado-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-cafe">Registra los primeros afiliados para comenzar</p>
                </div>
              )}
              {data!.cuotasPendientes === 0 && data!.afiliados.total > 0 && (
                <p className="text-xs text-gray-400 text-center py-3">Sin alertas pendientes ✓</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* Próximos eventos */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-4 md:px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays size={15} className="text-verde-500" />
              <h3 className="font-display text-base font-semibold text-cafe">Próximos Eventos</h3>
            </div>
            <Link href="/calendario" className="text-xs text-verde-600 font-medium hover:underline">Ver calendario</Link>
          </div>
          <div className="divide-y divide-stone-50">
            {data!.proximosEventos.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-10">Sin eventos programados</p>
            ) : data!.proximosEventos.map(e => (
              <div key={e.id} className="px-4 md:px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-verde-50 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-verde-600 leading-none">
                    {new Date(e.fecha).toLocaleDateString("es-CO", { month: "short" }).toUpperCase()}
                  </span>
                  <span className="text-base font-bold text-verde-700 leading-none">{new Date(e.fecha).getDate()}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-cafe truncate">{e.titulo}</p>
                  <p className="text-xs text-gray-400">{e.lugar ?? e.tipo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimos comunicados */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-4 md:px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone size={15} className="text-verde-500" />
              <h3 className="font-display text-base font-semibold text-cafe">Últimos Comunicados</h3>
            </div>
            <Link href="/comunicados" className="text-xs text-verde-600 font-medium hover:underline">Ver todos</Link>
          </div>
          <div className="divide-y divide-stone-50">
            {data!.ultimosComunicados.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-10">Sin comunicados publicados</p>
            ) : data!.ultimosComunicados.map(c => (
              <div key={c.id} className="px-4 md:px-5 py-3">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                    ${c.tipo === "URGENTE" ? "bg-red-50 text-red-500" : c.tipo === "CITACION" ? "bg-blue-50 text-blue-600" : "bg-stone-100 text-gray-500"}`}>
                    {c.tipo}
                  </span>
                </div>
                <p className="text-sm font-medium text-cafe">{c.titulo}</p>
                {c.fechaPublic && <p className="text-xs text-gray-400 mt-0.5">{new Date(c.fechaPublic).toLocaleDateString("es-CO")}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}