"use client";
import { useState, useEffect, useCallback } from "react";
import { UserPlus, Search, CheckCircle2, AlertCircle, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const MESES = ["","Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const CARGO_COLORS: Record<string, string> = {
  Presidente:     "bg-dorado-100 text-dorado-600",
  Vicepresidente: "bg-orange-100 text-orange-600",
  Tesorero:       "bg-blue-100 text-blue-700",
  Fiscal:         "bg-purple-100 text-purple-600",
  Secretario:     "bg-teal-100 text-teal-600",
  Vocal:          "bg-gray-100 text-gray-600",
  Comunero:       "bg-verde-50 text-verde-600",
};

interface Cuota { mes: number; anio: number; pagado: boolean; }
interface Afiliado {
  id: string; cedula: string; codigoJAC: string; nombre: string;
  apellido: string; barrio: string | null; cargo: string;
  activo: boolean; cuotas: Cuota[];
}

function cuotasResumen(cuotas: Cuota[]) {
  const anio = new Date().getFullYear();
  const delAnio = cuotas.filter(c => c.anio === anio);
  const pagadas = delAnio.filter(c => c.pagado).length;
  const pendientes = delAnio.filter(c => !c.pagado && c.mes <= new Date().getMonth() + 1).length;
  return { pagadas, pendientes, total: delAnio.length };
}

function AfiliadosContent() {
  const searchParams = useSearchParams();
  const [afiliados, setAfiliados] = useState<Afiliado[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(searchParams.get("success") ? "Afiliado registrado exitosamente ✓" : "");
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/afiliados");
    const data = await res.json();
    setAfiliados(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(""), 3500); return () => clearTimeout(t); } }, [toast]);

  const filtered = afiliados.filter(a =>
    `${a.nombre} ${a.apellido} ${a.cedula} ${a.barrio ?? ""} ${a.codigoJAC}`
      .toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar a ${nombre}? Esta acción no se puede deshacer.`)) return;
    setDeleting(id);
    await fetch(`/api/afiliados/${id}`, { method: "DELETE" });
    await load();
    setDeleting(null);
    setToast("Afiliado eliminado");
  };

  return (
    <main className="flex-1 p-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-verde-600 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-fade-up">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-verde-500 mb-1">Gestión</p>
          <h2 className="font-display text-3xl font-semibold text-cafe">Afiliados</h2>
          <p className="text-sm text-gray-500 mt-1">Registro de comuneros y estado de cuotas</p>
        </div>
        <Link href="/afiliados/nuevo"
          className="flex items-center gap-2 px-4 py-2.5 bg-verde-600 text-white text-sm font-medium rounded-xl hover:bg-verde-500 transition-colors">
          <UserPlus size={16} /> Nuevo Afiliado
        </Link>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Afiliados", value: afiliados.length, color: "text-verde-600" },
          { label: "Activos", value: afiliados.filter(a => a.activo).length, color: "text-blue-600" },
          { label: "Con Cuotas Pendientes", value: afiliados.filter(a => cuotasResumen(a.cuotas).pendientes > 0).length, color: "text-amber-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-stone-100 px-5 py-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
            <p className={`font-display text-3xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm mb-5 px-4 py-3 flex items-center gap-2">
        <Search size={15} className="text-gray-400 shrink-0" />
        <input
          placeholder="Buscar por nombre, cédula, código o barrio..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none text-cafe placeholder:text-gray-400"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-cafe">Lista de Afiliados</h3>
          <span className="text-xs text-gray-400 bg-stone-50 px-3 py-1 rounded-full">
            {filtered.length} registro{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-gray-400">
            <div className="w-5 h-5 border-2 border-stone-200 border-t-verde-500 rounded-full animate-spin" />
            Cargando...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-display text-lg text-cafe/50">
              {search ? "Sin resultados para tu búsqueda" : "No hay afiliados registrados"}
            </p>
            {!search && (
              <Link href="/afiliados/nuevo" className="inline-flex items-center gap-1.5 mt-3 text-sm text-verde-600 hover:underline font-medium">
                <UserPlus size={14} /> Registrar el primer afiliado
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50">
                <tr>
                  {["Afiliado", "Cédula", "Código JAC", "Barrio", "Cargo", "Cuotas", "Estado", ""].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filtered.map(a => {
                  const { pagadas, pendientes, total } = cuotasResumen(a.cuotas);
                  return (
                    <tr key={a.id} className="hover:bg-stone-50/50 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-verde-100 flex items-center justify-center text-verde-700 font-bold text-xs shrink-0">
                            {a.nombre[0]}{a.apellido[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-cafe">{a.nombre} {a.apellido}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 font-mono">{a.cedula}</td>
                      <td className="px-5 py-3.5 text-xs font-semibold text-verde-600 font-mono">{a.codigoJAC}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{a.barrio ?? "—"}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${CARGO_COLORS[a.cargo] ?? CARGO_COLORS.Comunero}`}>
                          {a.cargo}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {pendientes > 0
                            ? <AlertCircle size={13} className="text-amber-400" />
                            : <CheckCircle2 size={13} className="text-verde-500" />}
                          <span className="text-xs text-gray-500">{pagadas}/{total}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${a.activo ? "bg-verde-50 text-verde-600" : "bg-red-50 text-red-500"}`}>
                          {a.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/afiliados/${a.id}`}
                            className="w-7 h-7 rounded-lg hover:bg-stone-100 flex items-center justify-center transition-colors" title="Ver detalle">
                            <Eye size={13} className="text-gray-500" />
                          </Link>
                          <Link href={`/afiliados/${a.id}/editar`}
                            className="w-7 h-7 rounded-lg hover:bg-stone-100 flex items-center justify-center transition-colors" title="Editar">
                            <Pencil size={13} className="text-gray-500" />
                          </Link>
                          <button onClick={() => handleDelete(a.id, `${a.nombre} ${a.apellido}`)}
                            disabled={deleting === a.id}
                            className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors" title="Eliminar">
                            <Trash2 size={13} className={deleting === a.id ? "text-gray-300" : "text-red-400"} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AfiliadosPage() {
  return <Suspense><AfiliadosContent /></Suspense>;
}
