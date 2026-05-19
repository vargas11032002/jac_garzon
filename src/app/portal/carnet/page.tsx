"use client";
import { useEffect, useState } from "react";
import { Download, Share2, CheckCircle2, RotateCcw, User } from "lucide-react";

const CARGO_COLORS: Record<string, string> = {
  Presidente:     "bg-dorado-100 text-dorado-600 border-dorado-200",
  Vicepresidente: "bg-orange-100 text-orange-600 border-orange-200",
  Tesorero:       "bg-blue-100 text-blue-700 border-blue-200",
  Fiscal:         "bg-purple-100 text-purple-600 border-purple-200",
  Secretario:     "bg-teal-100 text-teal-600 border-teal-200",
  Vocal:          "bg-gray-100 text-gray-600 border-gray-200",
  Comunero:       "bg-verde-50 text-verde-600 border-verde-100",
};

export default function CarnetPage() {
  const [afiliado, setAfiliado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState(false);

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

  const cargoColor = CARGO_COLORS[afiliado.cargo] ?? CARGO_COLORS.Comunero;
  const vigencia = afiliado.vigenciaHasta
    ? new Date(afiliado.vigenciaHasta).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })
    : "Indefinida";
  const ingreso = new Date(afiliado.fechaIngreso).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-white/50 text-sm mb-1">Portal del Comunero</p>
        <h2 className="font-display text-2xl font-semibold text-white">Mi Carnet Digital</h2>
        <p className="text-white/40 text-sm mt-1">Toca el carnet para ver el reverso</p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-sm cursor-pointer select-none" style={{ perspective: "1000px" }}
          onClick={() => setFlipped(f => !f)}>
          <div className="relative transition-transform duration-500"
            style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", height: "210px" }}>

            {/* FRENTE */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl" style={{ backfaceVisibility: "hidden" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-verde-600 via-verde-700 to-verde-900" />
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-dorado-400 via-dorado-100 to-dorado-400" />
              <div className="relative p-5 h-full flex gap-4">
                <div className="shrink-0">
                  <div className="w-20 h-24 rounded-2xl bg-white/15 border-2 border-white/30 flex items-center justify-center overflow-hidden">
                    {afiliado.foto ? <img src={afiliado.foto} alt="foto" className="w-full h-full object-cover" /> : <User size={36} className="text-white/40" />}
                  </div>
                  {afiliado.activo && (
                    <div className="flex items-center justify-center gap-1 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[9px] text-green-300 font-semibold">ACTIVO</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="text-[9px] font-semibold tracking-[2px] uppercase text-white/40 mb-1">Junta de Acción Comunal</p>
                    <p className="font-display text-lg font-bold text-white leading-tight">{afiliado.nombre}<br/>{afiliado.apellido}</p>
                    <p className="text-white/50 text-xs mt-1">CC {afiliado.cedula}</p>
                    <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cargoColor}`}>{afiliado.cargo}</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40">{afiliado.barrio ?? "Garzón"}</p>
                    <p className="text-[10px] text-white/40">Garzón, Huila</p>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end justify-between">
                  <div className="text-right">
                    <p className="text-[8px] text-white/30 font-semibold tracking-wider uppercase">Código</p>
                    <p className="text-[11px] font-bold text-dorado-100 font-mono">{afiliado.codigoJAC}</p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-lg p-1">
                    <div className="w-full h-full bg-cafe rounded opacity-90"
                      style={{ backgroundImage: "repeating-linear-gradient(0deg,#3d2b1f 0,#3d2b1f 2px,transparent 2px,transparent 5px),repeating-linear-gradient(90deg,#3d2b1f 0,#3d2b1f 2px,transparent 2px,transparent 5px)", backgroundSize: "5px 5px" }} />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-dorado-400 via-dorado-100 to-dorado-400" />
            </div>

            {/* REVERSO */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cafe via-[#2d1f15] to-[#1a0f0a]" />
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-dorado-400 via-dorado-100 to-dorado-400" />
              <div className="relative p-5 h-full flex flex-col justify-between">
                <div>
                  <p className="font-display text-sm font-semibold text-dorado-100 mb-3">JAC — Garzón, Huila</p>
                  <div className="space-y-2">
                    {[
                      { label: "Municipio", value: "Garzón, Huila" },
                      { label: "Fecha de ingreso", value: ingreso },
                      { label: "Vigente hasta", value: vigencia },
                      { label: "Dirección", value: afiliado.direccion ?? "—" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center text-xs">
                        <span className="text-white/40">{label}</span>
                        <span className="text-white/80 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <p className="text-[9px] text-white/25 text-center leading-relaxed">
                    Carnet personal e intransferible. En caso de pérdida comunicarse con la Secretaría de la JAC.
                  </p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-dorado-400 via-dorado-100 to-dorado-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button onClick={() => setFlipped(f => !f)} className="flex items-center gap-2 text-white/50 hover:text-white text-xs transition-colors">
          <RotateCcw size={12} /> {flipped ? "Ver frente" : "Ver reverso"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => window.print()}
          className="flex items-center justify-center gap-2 py-3 bg-white text-cafe text-sm font-semibold rounded-2xl shadow hover:shadow-md transition-all hover:-translate-y-0.5">
          <Download size={16} /> Imprimir / Guardar
        </button>
        <button onClick={() => { if (navigator.share) navigator.share({ title: "Mi Carnet JAC", text: `${afiliado.nombre} ${afiliado.apellido} — ${afiliado.codigoJAC}` }); }}
          className="flex items-center justify-center gap-2 py-3 bg-white/15 text-white text-sm font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
          <Share2 size={16} /> Compartir
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/15 p-4 flex items-center gap-3">
        <CheckCircle2 size={20} className="text-green-400 shrink-0" />
        <div>
          <p className="text-white text-sm font-semibold">Carnet Verificado</p>
          <p className="text-white/40 text-xs mt-0.5">Este carnet es auténtico y está vigente en el sistema JAC Garzón</p>
        </div>
      </div>
    </div>
  );
}