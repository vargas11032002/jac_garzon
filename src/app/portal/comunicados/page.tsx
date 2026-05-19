"use client";
import { useEffect, useState, useCallback } from "react";
import { Megaphone } from "lucide-react";

interface Comunicado {
  id: string; titulo: string; contenido: string; tipo: string;
  publicado: boolean; fechaPublic: string | null;
}

const TIPO_COLORS: Record<string, string> = {
  GENERAL:  "bg-stone-100 text-gray-600",
  URGENTE:  "bg-red-50 text-red-600",
  CITACION: "bg-blue-50 text-blue-600",
};

export default function PortalComunicadosPage() {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/comunicados");
    const data = await res.json();
    setComunicados(data.filter((c: Comunicado) => c.publicado));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-white/50 text-sm mb-1">Portal del Comunero</p>
        <h2 className="font-display text-2xl font-semibold text-white">Comunicados</h2>
        <p className="text-white/40 text-sm mt-1">Avisos y noticias de la JAC</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      ) : comunicados.length === 0 ? (
        <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/15 p-12 text-center">
          <Megaphone size={32} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/50">Sin comunicados publicados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comunicados.map(c => (
            <div key={c.id} className="bg-white/10 backdrop-blur rounded-2xl border border-white/15 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${TIPO_COLORS[c.tipo] ?? TIPO_COLORS.GENERAL}`}>
                  {c.tipo}
                </span>
                {c.fechaPublic && (
                  <span className="text-[10px] text-white/30">
                    {new Date(c.fechaPublic).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}
                  </span>
                )}
              </div>
              <h3 className="font-display text-base font-semibold text-white mb-1">{c.titulo}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{c.contenido}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}