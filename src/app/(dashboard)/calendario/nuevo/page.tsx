"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 transition-all bg-white" />
);

export default function NuevoEventoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    titulo: "", descripcion: "", fecha: new Date().toISOString().split("T")[0],
    horaInicio: "", horaFin: "", lugar: "", tipo: "REUNION",
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.fecha) { setError("Título y fecha son requeridos"); return; }
    setLoading(true);
    const res = await fetch("/api/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/calendario");
    else { const d = await res.json(); setError(d.error); setLoading(false); }
  };

  return (
    <main className="flex-1 p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/calendario" className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors">
          <ArrowLeft size={16} className="text-gray-500" />
        </Link>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-verde-500 mb-0.5">Calendario</p>
          <h2 className="font-display text-2xl font-semibold text-cafe">Nuevo Evento</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Título *</label>
            <Input placeholder="Ej: Reunión ordinaria marzo 2025" value={form.titulo} onChange={e => set("titulo", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tipo</label>
              <select value={form.tipo} onChange={e => set("tipo", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 bg-white">
                <option value="REUNION">Reunión</option>
                <option value="EVENTO">Evento</option>
                <option value="FECHA_IMPORTANTE">Fecha Importante</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Lugar</label>
              <Input placeholder="Ej: Salón comunal" value={form.lugar} onChange={e => set("lugar", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Fecha *</label>
              <Input type="date" value={form.fecha} onChange={e => set("fecha", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Hora inicio</label>
                <Input type="time" value={form.horaInicio} onChange={e => set("horaInicio", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Hora fin</label>
                <Input type="time" value={form.horaFin} onChange={e => set("horaFin", e.target.value)} />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Descripción</label>
            <textarea value={form.descripcion} onChange={e => set("descripcion", e.target.value)} rows={4}
              placeholder="Detalles adicionales del evento..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 resize-none transition-all" />
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">{error}</div>}

        <div className="flex justify-end gap-3 pb-4">
          <Link href="/calendario" className="px-5 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-stone-50 transition-colors">
            Cancelar
          </Link>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-verde-600 text-white text-sm font-semibold rounded-xl hover:bg-verde-500 transition-colors disabled:opacity-60">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
            {loading ? "Guardando..." : "Guardar Evento"}
          </button>
        </div>
      </form>
    </main>
  );
}