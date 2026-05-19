"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Clock, TrendingUp } from "lucide-react";

const MESES = ["","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const fmt = (v: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

export default function EstadoCuentaPage() {
  const [afiliado, setAfiliado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [anioVer, setAnioVer] = useState(new Date().getFullYear());

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

  const mesActual = new Date().getMonth() + 1;
  const cuotasAnio = afiliado.cuotas.filter((c: any) => c.anio === anioVer);
  const pagadas = cuotasAnio.filter((c: any) => c.pagado).length;
  const pendientes = cuotasAnio.filter((c: any) => !c.pagado && c.mes <= mesActual).length;
  const totalPagado = cuotasAnio.filter((c: any) => c.pagado).reduce((s: number, c: any) => s + c.valor, 0);
  const totalPendiente = cuotasAnio.filter((c: any) => !c.pagado && c.mes <= mesActual).reduce((s: number, c: any) => s + c.valor, 0);
  const aniosDisp = [...new Set(afiliado.cuotas.map((c: any) => c.anio))].sort((a: any, b: any) => b - a) as number[];

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/50 text-sm mb-1">Portal del Comunero</p>
          <h2 className="font-display text-2xl font-semibold text-white">Estado de Cuenta</h2>
          <p className="text-white/40 text-sm mt-1">{afiliado.nombre} {afiliado.apellido} · {afiliado.codigoJAC}</p>
        </div>
        {aniosDisp.length > 1 && (
          <select value={anioVer} onChange={e => setAnioVer(Number(e.target.value))}
            className="bg-white/15 text-white text-sm px-3 py-1.5 rounded-xl border border-white/20 outline-none">
            {aniosDisp.map(a => <option key={a} value={a} className="text-cafe">{a}</option>)}
          </select>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pagado", value: fmt(totalPagado), color: "text-verde-600" },
          { label: "Pendiente", value: fmt(totalPendiente), color: totalPendiente > 0 ? "text-amber-500" : "text-verde-600" },
          { label: "Cuota Mes", value: cuotasAnio[0] ? fmt(cuotasAnio[0].valor) : "$0", color: "text-cafe" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-lg">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">{label}</p>
            <p className={`font-display text-xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-verde-600" />
            <p className="font-semibold text-cafe text-sm">Progreso {anioVer}</p>
          </div>
          <p className="text-xs text-gray-400">{pagadas}/12 meses</p>
        </div>
        <div className="grid grid-cols-6 gap-2 mb-3">
          {MESES.slice(1).map((mes, i) => {
            const mesNum = i + 1;
            const cuota = cuotasAnio.find((c: any) => c.mes === mesNum);
            const vencida = cuota && !cuota.pagado && mesNum <= mesActual;
            return (
              <div key={mes} className="text-center">
                <div className={`w-full aspect-square rounded-xl flex items-center justify-center mb-1 transition-all
                  ${cuota?.pagado ? "bg-verde-500 text-white shadow-sm"
                  : vencida ? "bg-amber-100 text-amber-600 border border-amber-200"
                  : "bg-stone-100 text-stone-300"}`}>
                  {cuota?.pagado ? <CheckCircle2 size={14} /> : <span className="text-xs font-bold">{mesNum}</span>}
                </div>
                <p className="text-[9px] text-gray-400 truncate">{mes.slice(0, 3)}</p>
              </div>
            );
          })}
        </div>
        <div className="w-full bg-stone-100 rounded-full h-2">
          <div className="bg-verde-500 h-2 rounded-full transition-all" style={{ width: `${Math.round((pagadas / 12) * 100)}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">{pagadas} de 12 meses pagados ({Math.round((pagadas / 12) * 100)}%)</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100">
          <h3 className="font-display text-base font-semibold text-cafe">Detalle por Mes — {anioVer}</h3>
        </div>
        {cuotasAnio.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">Sin cuotas registradas para este año</div>
        ) : (
          <div className="divide-y divide-stone-50">
            {cuotasAnio.map((c: any) => {
              const vencida = !c.pagado && c.mes <= mesActual;
              return (
                <div key={c.id} className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {c.pagado ? <CheckCircle2 size={15} className="text-verde-500 shrink-0" />
                      : vencida ? <AlertCircle size={15} className="text-amber-400 shrink-0" />
                      : <Clock size={15} className="text-stone-300 shrink-0" />}
                    <div>
                      <p className="text-sm font-medium text-cafe">{MESES[c.mes]} {c.anio}</p>
                      {c.fechaPago && <p className="text-[11px] text-gray-400">Pagado el {new Date(c.fechaPago).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}</p>}
                      {vencida && <p className="text-[11px] text-amber-500 font-medium">Pendiente de pago</p>}
                      {!c.pagado && c.mes > mesActual && <p className="text-[11px] text-gray-300">Próximo</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${c.pagado ? "text-verde-600" : "text-amber-500"}`}>{fmt(c.valor)}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.pagado ? "bg-verde-50 text-verde-600" : vencida ? "bg-amber-50 text-amber-500" : "bg-stone-50 text-stone-400"}`}>
                      {c.pagado ? "Pagado" : vencida ? "Vencida" : "Pendiente"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {pendientes > 0 && (
        <div className="bg-amber-500/20 border border-amber-400/30 rounded-2xl p-4 flex gap-3">
          <AlertCircle size={18} className="text-amber-300 shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-semibold text-sm">{pendientes} cuota{pendientes > 1 ? "s" : ""} vencida{pendientes > 1 ? "s" : ""}</p>
            <p className="text-white/50 text-xs mt-0.5">Comunícate con el tesorero. Total: {fmt(totalPendiente)}</p>
          </div>
        </div>
      )}

      {pendientes === 0 && pagadas > 0 && (
        <div className="bg-verde-500/20 border border-verde-400/30 rounded-2xl p-4 flex gap-3">
          <CheckCircle2 size={18} className="text-green-300 shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-semibold text-sm">¡Al día con tus pagos!</p>
            <p className="text-white/50 text-xs mt-0.5">Gracias por mantener tus aportes al día con la comunidad.</p>
          </div>
        </div>
      )}
    </div>
  );
}