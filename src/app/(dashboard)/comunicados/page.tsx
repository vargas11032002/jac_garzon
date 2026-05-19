"use client";
import { useState, useEffect, useCallback } from "react";
import { Send, Plus, Trash2, EyeOff, Megaphone } from "lucide-react";
import Link from "next/link";

interface Comunicado {
  id: string; titulo: string; contenido: string; tipo: string;
  publicado: boolean; fechaPublic: string | null; createdAt: string;
}

const TIPO_COLORS: Record<string, string> = {
  GENERAL:  "bg-stone-100 text-gray-600",
  URGENTE:  "bg-red-50 text-red-600",
  CITACION: "bg-blue-50 text-blue-600",
};

export default function ComunicadosPage() {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/comunicados");
    setComunicados(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`¿Eliminar "${titulo}"?`)) return;
    await fetch(`/api/comunicados/${id}`, { method: "DELETE" });
    load();
  };

  const handlePublicar = async (id: string, publicado: boolean) => {
    await fetch(`/api/comunicados/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicado: !publicado }),
    });
    load();
  };

  const filtrados = filtro ? comunicados.filter(c => c.tipo === filtro) : comunicados;

  return (
    <main className="flex-1 p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-verde-500 mb-1">Comunidad</p>
          <h2 className="font-display text-3xl font-semibold text-cafe">Comunicados</h2>
          <p className="text-sm text-gray-500 mt-1">Avisos, noticias y citaciones para los miembros</p>
        </div>
        <Link href="/comunicados/nuevo"
          className="flex items-center gap-2 px-4 py-2.5 bg-verde-600 text-white text-sm font-medium rounded-xl hover:bg-verde-500 transition-colors">
          <Plus size={16} /> Nuevo Comunicado
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: comunicados.length, color: "text-cafe" },
          { label: "Publicados", value: comunicados.filter(c => c.publicado).length, color: "text-verde-600" },
          { label: "Borradores", value: comunicados.filter(c => !c.publicado).length, color: "text-gray-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-stone-100 px-5 py-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
            <p className={`font-display text-3xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-5">
        {[["", "Todos"], ["GENERAL", "General"], ["URGENTE", "Urgente"], ["CITACION", "Citación"]].map(([val, label]) => (
          <button key={val} onClick={() => setFiltro(val)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors
              ${filtro === val ? "bg-verde-600 text-white" : "bg-white border border-stone-200 text-gray-600 hover:bg-stone-50"}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm py-16 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-stone-200 border-t-verde-500 rounded-full animate-spin" />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm py-16 text-center">
          <Megaphone size={32} className="text-stone-200 mx-auto mb-3" />
          <p className="font-display text-lg text-cafe/50">Sin comunicados</p>
          <Link href="/comunicados/nuevo" className="inline-flex items-center gap-1.5 mt-3 text-sm text-verde-600 hover:underline font-medium">
            <Plus size={14} /> Crear primer comunicado
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 group hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${TIPO_COLORS[c.tipo] ?? TIPO_COLORS.GENERAL}`}>
                      {c.tipo}
                    </span>
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${c.publicado ? "bg-verde-50 text-verde-600" : "bg-stone-100 text-gray-400"}`}>
                      {c.publicado ? "Publicado" : "Borrador"}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-semibold text-cafe truncate">{c.titulo}</h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{c.contenido}</p>
                  <p className="text-xs text-gray-300 mt-2">
                    {c.publicado && c.fechaPublic
                      ? `Publicado el ${new Date(c.fechaPublic).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}`
                      : `Creado el ${new Date(c.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "long" })}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4 shrink-0">
                  <button onClick={() => handlePublicar(c.id, c.publicado)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors
                      ${c.publicado ? "bg-stone-100 text-gray-600 hover:bg-stone-200" : "bg-verde-50 text-verde-600 hover:bg-verde-100"}`}>
                    {c.publicado ? <><EyeOff size={12} /> Despublicar</> : <><Send size={12} /> Publicar</>}
                  </button>
                  <button onClick={() => handleDelete(c.id, c.titulo)}
                    className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors">
                    <Trash2 size={13} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}