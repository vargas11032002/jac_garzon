"use client";
import { useState, useEffect, useCallback } from "react";
import { FilePlus, Search, CheckCircle2, Clock, Trash2, Eye } from "lucide-react";
import Link from "next/link";

interface Acta {
  id: string; numero: number; fecha: string; tipo: string;
  lugar: string; asistentes: number; aprobada: boolean;
}

const TIPO_COLOR: Record<string, string> = {
  ORDINARIA:      "bg-verde-50 text-verde-600",
  EXTRAORDINARIA: "bg-purple-100 text-purple-600",
};

export default function ActasPage() {
  const [actas, setActas] = useState<Acta[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/actas");
    setActas(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string, num: number) => {
    if (!confirm(`¿Eliminar el Acta N° ${num}?`)) return;
    await fetch(`/api/actas/${id}`, { method: "DELETE" });
    load();
  };

  const handleAprobar = async (id: string, aprobada: boolean) => {
    await fetch(`/api/actas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aprobada: !aprobada }),
    });
    load();
  };

  const filtered = actas.filter(a => {
    const matchSearch = `acta ${a.numero} ${a.lugar} ${a.tipo}`.toLowerCase().includes(search.toLowerCase());
    const matchFiltro = filtro ? a.tipo === filtro : true;
    return matchSearch && matchFiltro;
  });

  return (
    <main className="flex-1 p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-verde-500 mb-1">Documentación</p>
          <h2 className="font-display text-3xl font-semibold text-cafe">Actas Digitales</h2>
          <p className="text-sm text-gray-500 mt-1">Registro y archivo de reuniones de la junta</p>
        </div>
        <Link href="/actas/nueva"
          className="flex items-center gap-2 px-4 py-2.5 bg-verde-600 text-white text-sm font-medium rounded-xl hover:bg-verde-500 transition-colors">
          <FilePlus size={16} /> Nueva Acta
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Actas", value: actas.length, color: "text-cafe" },
          { label: "Aprobadas", value: actas.filter(a => a.aprobada).length, color: "text-verde-600" },
          { label: "Pendientes", value: actas.filter(a => !a.aprobada).length, color: "text-amber-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-stone-100 px-5 py-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
            <p className={`font-display text-3xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-5">
        <div className="flex-1 bg-white rounded-2xl border border-stone-100 shadow-sm px-4 py-3 flex items-center gap-2">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input placeholder="Buscar acta..." value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none text-cafe placeholder:text-gray-400" />
        </div>
        {["", "ORDINARIA", "EXTRAORDINARIA"].map(t => (
          <button key={t} onClick={() => setFiltro(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap
              ${filtro === t ? "bg-verde-600 text-white" : "bg-white border border-stone-200 text-gray-600 hover:bg-stone-50"}`}>
            {t === "" ? "Todas" : t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm py-16 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-stone-200 border-t-verde-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm py-16 text-center">
          <p className="font-display text-lg text-cafe/50">Sin actas registradas</p>
          <Link href="/actas/nueva" className="inline-flex items-center gap-1.5 mt-3 text-sm text-verde-600 hover:underline font-medium">
            <FilePlus size={14} /> Crear primera acta
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => (
            <div key={a.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm px-6 py-4 flex items-center justify-between group hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-verde-50 flex flex-col items-center justify-center shrink-0">
                  <p className="text-[9px] font-semibold text-verde-400 uppercase">Acta</p>
                  <p className="font-display text-lg font-bold text-verde-700">#{a.numero}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TIPO_COLOR[a.tipo] ?? "bg-stone-100 text-gray-500"}`}>
                      {a.tipo.charAt(0) + a.tipo.slice(1).toLowerCase()}
                    </span>
                    {a.aprobada
                      ? <span className="flex items-center gap-1 text-[10px] font-semibold text-verde-600"><CheckCircle2 size={11} />Aprobada</span>
                      : <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-500"><Clock size={11} />Pendiente</span>}
                  </div>
                  <p className="text-sm font-medium text-cafe">{a.lugar}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(a.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })} · {a.asistentes} asistentes
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleAprobar(a.id, a.aprobada)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors
                    ${a.aprobada ? "bg-stone-100 text-gray-600 hover:bg-stone-200" : "bg-verde-50 text-verde-600 hover:bg-verde-100"}`}>
                  {a.aprobada ? "Desaprobar" : "Aprobar"}
                </button>
                <Link href={`/actas/${a.id}`}
                  className="w-8 h-8 rounded-lg hover:bg-stone-100 flex items-center justify-center transition-colors">
                  <Eye size={14} className="text-gray-500" />
                </Link>
                <button onClick={() => handleDelete(a.id, a.numero)}
                  className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}