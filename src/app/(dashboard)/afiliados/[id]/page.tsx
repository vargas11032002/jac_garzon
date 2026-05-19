"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, CheckCircle2, AlertCircle, Clock, User } from "lucide-react";
import Link from "next/link";

const MESES = ["","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const fmt = (v: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

const CARGO_COLORS: Record<string, string> = {
  Presidente: "bg-dorado-100 text-dorado-600", Vicepresidente: "bg-orange-100 text-orange-600",
  Tesorero: "bg-blue-100 text-blue-700", Fiscal: "bg-purple-100 text-purple-600",
  Secretario: "bg-teal-100 text-teal-600", Vocal: "bg-gray-100 text-gray-600",
  Comunero: "bg-verde-50 text-verde-600",
};

export default function AfiliadoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/afiliados/${id}`).then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar a ${data.nombre} ${data.apellido}? Esta acción no se puede deshacer.`)) return;
    await fetch(`/api/afiliados/${id}`, { method: "DELETE" });
    router.push("/afiliados?success=0");
  };

  const handlePagarCuota = async (cuotaId: string) => {
    await fetch(`/api/cuotas/${cuotaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagado: true, fechaPago: new Date().toISOString() }),
    });
    const res = await fetch(`/api/afiliados/${id}`);
    setData(await res.json());
  };

  if (loading) return (
    <main className="flex-1 p-8 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-stone-200 border-t-verde-500 rounded-full animate-spin" />
    </main>
  );

  if (!data || data.error) return (
    <main className="flex-1 p-8">
      <p className="text-red-500">Afiliado no encontrado.</p>
    </main>
  );

  const anio = new Date().getFullYear();
  const cuotasAnio = data.cuotas.filter((c: any) => c.anio === anio);
  const pagadas = cuotasAnio.filter((c: any) => c.pagado).length;
  const pendientes = cuotasAnio.filter((c: any) => !c.pagado && c.mes <= new Date().getMonth() + 1).length;
  const totalDeuda = cuotasAnio.filter((c: any) => !c.pagado).reduce((s: number, c: any) => s + c.valor, 0);

  return (
    <main className="flex-1 p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/afiliados" className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors">
            <ArrowLeft size={16} className="text-gray-500" />
          </Link>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[2px] text-verde-500 mb-0.5">Detalle</p>
            <h2 className="font-display text-2xl font-semibold text-cafe">{data.nombre} {data.apellido}</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/afiliados/${id}/editar`}
            className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 bg-white text-sm font-medium text-gray-700 rounded-xl hover:bg-stone-50 transition-colors">
            <Pencil size={14} /> Editar
          </Link>
          <button onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition-colors border border-red-100">
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Info personal */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
            <div className="w-16 h-16 rounded-2xl bg-verde-100 flex items-center justify-center text-verde-700 font-bold text-xl mb-4">
              {data.nombre[0]}{data.apellido[0]}
            </div>
            <h3 className="font-display text-lg font-semibold text-cafe">{data.nombre} {data.apellido}</h3>
            <p className="text-sm text-gray-400 mt-0.5">CC {data.cedula}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${CARGO_COLORS[data.cargo] ?? CARGO_COLORS.Comunero}`}>
                {data.cargo}
              </span>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${data.activo ? "bg-verde-50 text-verde-600" : "bg-red-50 text-red-500"}`}>
                {data.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 space-y-2">
              {[
                { label: "Código JAC", value: data.codigoJAC },
                { label: "Barrio", value: data.barrio ?? "—" },
                { label: "Dirección", value: data.direccion ?? "—" },
                { label: "Teléfono", value: data.telefono ?? "—" },
                { label: "Email", value: data.email ?? "—" },
                { label: "Ingreso", value: new Date(data.fechaIngreso).toLocaleDateString("es-CO") },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
                  <p className="text-sm text-cafe mt-0.5 truncate">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cuotas */}
        <div className="col-span-2 space-y-4">
          {/* Resumen */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Pagadas</p>
              <p className="font-display text-3xl font-semibold text-verde-600">{pagadas}</p>
              <p className="text-xs text-gray-400">de 12 meses</p>
            </div>
            <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Pendientes</p>
              <p className={`font-display text-3xl font-semibold ${pendientes > 0 ? "text-amber-500" : "text-verde-500"}`}>{pendientes}</p>
              <p className="text-xs text-gray-400">vencidas</p>
            </div>
            <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Deuda</p>
              <p className={`font-display text-2xl font-semibold ${totalDeuda > 0 ? "text-amber-500" : "text-verde-600"}`}>{fmt(totalDeuda)}</p>
            </div>
          </div>

          {/* Detalle cuotas */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100">
              <h3 className="font-display text-base font-semibold text-cafe">Cuotas {anio}</h3>
            </div>
            <div className="divide-y divide-stone-50">
              {cuotasAnio.map((c: any) => {
                const vencida = !c.pagado && c.mes <= new Date().getMonth() + 1;
                return (
                  <div key={c.id} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {c.pagado
                        ? <CheckCircle2 size={15} className="text-verde-500" />
                        : vencida
                          ? <AlertCircle size={15} className="text-amber-400" />
                          : <Clock size={15} className="text-stone-300" />}
                      <div>
                        <p className="text-sm font-medium text-cafe">{MESES[c.mes]}</p>
                        {c.fechaPago && <p className="text-[11px] text-gray-400">Pagado {new Date(c.fechaPago).toLocaleDateString("es-CO")}</p>}
                        {vencida && <p className="text-[11px] text-amber-500">Vencida</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-cafe">{fmt(c.valor)}</span>
                      {!c.pagado && (
                        <button onClick={() => handlePagarCuota(c.id)}
                          className="text-xs font-semibold px-3 py-1.5 bg-verde-600 text-white rounded-lg hover:bg-verde-500 transition-colors">
                          Marcar pagado
                        </button>
                      )}
                      {c.pagado && (
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-verde-50 text-verde-600">Pagado</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
