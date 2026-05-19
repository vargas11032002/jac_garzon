"use client";
import { useState, useEffect, useCallback } from "react";
import { PlusCircle, Trash2, Pencil, ChevronRight } from "lucide-react";
import Link from "next/link";

const fmt = (v: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

const ESTADOS: Record<string, { label: string; color: string; bg: string }> = {
  PLANEACION:   { label: "Planeación",   color: "text-blue-700",  bg: "bg-blue-50 border-blue-100" },
  EN_EJECUCION: { label: "En Ejecución", color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
  COMPLETADO:   { label: "Completado",   color: "text-verde-600", bg: "bg-verde-50 border-verde-100" },
  SUSPENDIDO:   { label: "Suspendido",   color: "text-red-500",   bg: "bg-red-50 border-red-100" },
};

interface Proyecto {
  id: string; nombre: string; descripcion: string | null; estado: string;
  presupuesto: number | null; ejecutado: number; inicio: string | null;
  fin: string | null; responsable: string | null;
}

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/proyectos");
    setProyectos(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    await fetch(`/api/proyectos/${id}`, { method: "DELETE" });
    load();
  };

  const cambiarEstado = async (id: string, estado: string) => {
    const estados = Object.keys(ESTADOS);
    const next = estados[(estados.indexOf(estado) + 1) % estados.length];
    await fetch(`/api/proyectos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: next }),
    });
    load();
  };

  const filtrados = filtro ? proyectos.filter(p => p.estado === filtro) : proyectos;

  return (
    <main className="flex-1 p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-verde-500 mb-1">Seguimiento</p>
          <h2 className="font-display text-3xl font-semibold text-cafe">Proyectos</h2>
          <p className="text-sm text-gray-500 mt-1">Obras e iniciativas de la junta comunal</p>
        </div>
        <Link href="/proyectos/nuevo"
          className="flex items-center gap-2 px-4 py-2.5 bg-verde-600 text-white text-sm font-medium rounded-xl hover:bg-verde-500 transition-colors">
          <PlusCircle size={16} /> Nuevo Proyecto
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {Object.entries(ESTADOS).map(([key, { label, color, bg }]) => (
          <button key={key} onClick={() => setFiltro(f => f === key ? "" : key)}
            className={`rounded-2xl border p-4 text-left transition-all shadow-sm hover:shadow-md ${filtro === key ? bg + " ring-2 ring-offset-1 ring-verde-300" : "bg-white border-stone-100"}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
            <p className={`font-display text-3xl font-semibold ${color}`}>{proyectos.filter(p => p.estado === key).length}</p>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm py-16 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-stone-200 border-t-verde-500 rounded-full animate-spin" />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm py-16 text-center">
          <p className="font-display text-lg text-cafe/50">Sin proyectos {filtro ? "en este estado" : "registrados"}</p>
          {!filtro && (
            <Link href="/proyectos/nuevo" className="inline-flex items-center gap-1.5 mt-3 text-sm text-verde-600 hover:underline font-medium">
              <PlusCircle size={14} /> Crear primer proyecto
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.map(p => {
            const { label, color, bg } = ESTADOS[p.estado] ?? ESTADOS.PLANEACION;
            const pct = p.presupuesto && p.presupuesto > 0 ? Math.min(Math.round((p.ejecutado / p.presupuesto) * 100), 100) : 0;
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 group hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${bg} ${color}`}>{label}</span>
                      {p.responsable && <span className="text-[10px] text-gray-400">· {p.responsable}</span>}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-cafe truncate">{p.nombre}</h3>
                    {p.descripcion && <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">{p.descripcion}</p>}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4 shrink-0">
                    <button onClick={() => cambiarEstado(p.id, p.estado)}
                      className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 rounded-lg transition-colors text-gray-600">
                      Avanzar <ChevronRight size={11} />
                    </button>
                    <Link href={`/proyectos/${p.id}`}
                      className="w-8 h-8 rounded-lg hover:bg-stone-100 flex items-center justify-center transition-colors">
                      <Pencil size={13} className="text-gray-500" />
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.nombre)}
                      className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors">
                      <Trash2 size={13} className="text-red-400" />
                    </button>
                  </div>
                </div>
                {p.presupuesto && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Ejecutado: <strong className="text-cafe">{fmt(p.ejecutado)}</strong></span>
                      <span>Presupuesto: <strong className="text-cafe">{fmt(p.presupuesto)}</strong> · {pct}%</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all ${pct >= 100 ? "bg-red-400" : pct >= 75 ? "bg-amber-400" : "bg-verde-500"}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )}
                {(p.inicio || p.fin) && (
                  <div className="flex gap-4 mt-3 pt-3 border-t border-stone-50">
                    {p.inicio && <p className="text-xs text-gray-400">Inicio: <span className="text-cafe font-medium">{new Date(p.inicio).toLocaleDateString("es-CO")}</span></p>}
                    {p.fin    && <p className="text-xs text-gray-400">Fin: <span className="text-cafe font-medium">{new Date(p.fin).toLocaleDateString("es-CO")}</span></p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}