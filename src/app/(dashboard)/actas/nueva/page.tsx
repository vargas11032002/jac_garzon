"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import Link from "next/link";

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 transition-all bg-white" />
);

export default function NuevaActaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [puntos, setPuntos] = useState<string[]>([""]);
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split("T")[0],
    tipo: "ORDINARIA", lugar: "", asistentes: "", contenido: "",
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.lugar.trim()) { setError("El lugar es requerido"); return; }
    setLoading(true);
    const res = await fetch("/api/actas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, orden: JSON.stringify(puntos.filter(p => p.trim())) }),
    });
    if (res.ok) router.push("/actas");
    else { const d = await res.json(); setError(d.error); setLoading(false); }
  };

  return (
    <main className="flex-1 p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/actas" className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors">
          <ArrowLeft size={16} className="text-gray-500" />
        </Link>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-verde-500 mb-0.5">Actas</p>
          <h2 className="font-display text-2xl font-semibold text-cafe">Nueva Acta de Reunión</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h3 className="font-display text-base font-semibold text-cafe mb-4">Datos Generales</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Fecha *</label>
              <Input type="date" value={form.fecha} onChange={e => set("fecha", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tipo</label>
              <select value={form.tipo} onChange={e => set("tipo", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 bg-white">
                <option value="ORDINARIA">Ordinaria</option>
                <option value="EXTRAORDINARIA">Extraordinaria</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Lugar *</label>
              <Input placeholder="Ej: Salón comunal" value={form.lugar} onChange={e => set("lugar", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">N° Asistentes</label>
              <Input type="number" placeholder="Ej: 25" min="0" value={form.asistentes} onChange={e => set("asistentes", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-cafe">Orden del Día</h3>
            <button type="button" onClick={() => setPuntos(p => [...p, ""])}
              className="flex items-center gap-1.5 text-xs font-semibold text-verde-600 hover:text-verde-500">
              <Plus size={13} /> Agregar punto
            </button>
          </div>
          <div className="space-y-2">
            {puntos.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-verde-50 text-verde-600 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <Input placeholder={`Punto ${i + 1}`} value={p} onChange={e => setPuntos(pts => pts.map((x, idx) => idx === i ? e.target.value : x))} />
                {puntos.length > 1 && (
                  <button type="button" onClick={() => setPuntos(pts => pts.filter((_, idx) => idx !== i))}
                    className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center shrink-0">
                    <X size={13} className="text-red-400" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h3 className="font-display text-base font-semibold text-cafe mb-4">Contenido del Acta</h3>
          <textarea value={form.contenido} onChange={e => set("contenido", e.target.value)} rows={10}
            placeholder="Desarrollo de la reunión, decisiones, compromisos..."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 resize-none transition-all" />
        </div>

        {error && <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">{error}</div>}

        <div className="flex justify-end gap-3 pb-4">
          <Link href="/actas" className="px-5 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-stone-50 transition-colors">Cancelar</Link>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-verde-600 text-white text-sm font-semibold rounded-xl hover:bg-verde-500 disabled:opacity-60">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
            {loading ? "Guardando..." : "Guardar Acta"}
          </button>
        </div>
      </form>
    </main>
  );
}