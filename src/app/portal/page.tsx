"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, ClipboardList, Bell, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";

const fmt = (v: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

export default function PortalHome() {
  const [afiliado, setAfiliado] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/me").then(r => r.json()).then(d => { setAfiliado(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  );

  if (!afiliado || afiliado.error) return (
    <div className="text-white text-center py-20">Error cargando datos</div>
  );

  const anio = new Date().getFullYear();
  const mesActual = new Date().getMonth() + 1;
  const cuotasAnio = afiliado.cuotas.filter((c: any) => c.anio === anio);
  const pagadas = cuotasAnio.filter((c: any) => c.pagado).length;
  const pendientes = cuotasAnio.filter((c: any) => !c.pagado && c.mes <= mesActual).length;
  const totalDeuda = cuotasAnio.filter((c: any) => !c.pagado).reduce((s: number, c: any) => s + c.valor, 0);
  const alDia = pendientes === 0;

  return (
    <div className="space-y-5">
      <div className="animate-fade-up">
        <p className="text-white/50 text-sm">Bienvenido,</p>
        <h1 className="font-display text-3xl font-semibold text-white mt-0.5">{afiliado.nombre} {afiliado.apellido}</h1>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-xs text-white/50 bg-white/10 px-3 py-1 rounded-full">{afiliado.codigoJAC}</span>
          <span className="text-xs text-white/50 bg-white/10 px-3 py-1 rounded-full">{afiliado.cargo}</span>
          {afiliado.barrio && <span className="text-xs text-white/50 bg-white/10 px-3 py-1 rounded-full">{afiliado.barrio}</span>}
        </div>
      </div>

      <div className={`rounded-2xl p-5 border animate-fade-up animate-fade-up-1 ${alDia ? "bg-white/15 border-white/20" : "bg-amber-500/20 border-amber-400/30"}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {alDia ? <CheckCircle2 size={18} className="text-green-300" /> : <AlertCircle size={18} className="text-amber-300" />}
            <p className="font-semibold text-white text-sm">
              {alDia ? "¡Al día con tus cuotas!" : `${pendientes} cuota${pendientes > 1 ? "s" : ""} pendiente${pendientes > 1 ? "s" : ""}`}
            </p>
          </div>
          <Link href="/portal/estado-cuenta" className="text-xs text-white/60 hover:text-white flex items-center gap-1 transition-colors">
            Ver detalle <ChevronRight size={12} />
          </Link>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mb-1.5">
          <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${Math.round((pagadas / 12) * 100)}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-white/50 text-xs">{pagadas} de 12 cuotas pagadas en {anio}</p>
          {totalDeuda > 0 && <p className="text-amber-300 text-xs font-semibold">Deuda: {fmt(totalDeuda)}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 animate-fade-up animate-fade-up-2">
        <Link href="/portal/carnet"
          className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 group">
          <div className="w-10 h-10 rounded-xl bg-verde-50 flex items-center justify-center mb-3">
            <CreditCard size={20} className="text-verde-600" />
          </div>
          <p className="font-display text-base font-semibold text-cafe">Mi Carnet</p>
          <p className="text-xs text-gray-400 mt-1">Ver y descargar tu carnet digital</p>
          <div className="flex items-center gap-1 mt-3 text-verde-600 text-xs font-medium">
            Ver carnet <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link href="/portal/estado-cuenta"
          className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 group">
          <div className="w-10 h-10 rounded-xl bg-dorado-100 flex items-center justify-center mb-3">
            <ClipboardList size={20} className="text-dorado-500" />
          </div>
          <p className="font-display text-base font-semibold text-cafe">Estado de Cuenta</p>
          <p className="text-xs text-gray-400 mt-1">Historial de aportes y cuotas</p>
          <div className="flex items-center gap-1 mt-3 text-dorado-500 text-xs font-medium">
            Ver aportes <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/15 p-5 animate-fade-up animate-fade-up-3">
        <div className="flex items-center gap-2 mb-3">
          <Bell size={15} className="text-white/60" />
          <p className="font-semibold text-white text-sm">Información</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-white/40">Fecha de ingreso</span>
            <span className="text-white/70">{new Date(afiliado.fechaIngreso).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}</span>
          </div>
          {afiliado.vigenciaHasta && (
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Vigencia del carnet</span>
              <span className="text-white/70">{new Date(afiliado.vigenciaHasta).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}</span>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span className="text-white/40">Estado</span>
            <span className={afiliado.activo ? "text-green-300" : "text-red-300"}>{afiliado.activo ? "Activo" : "Inactivo"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}