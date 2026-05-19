"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Send } from "lucide-react";
import Link from "next/link";

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 transition-all bg-white" />
);

export default function NuevoComunicadoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ titulo: "", contenido: "", tipo: "GENERAL" });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent, publicar = false) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.contenido.trim()) { setError("Título y contenido son requeridos"); return; }
    setLoading(true);
    const res = await fetch("/api/comunicados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, publicado: publicar }),
    });
    if (res.ok) router.push("/comunicados");
    else { const d = await res.json(); setError(d.error); setLoading(false); }
  };

  return (
    <main className="flex-1 p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/comunicados" className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors">
          <ArrowLeft size={16} className="text-gray-500" />
        </Link>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-verde-500 mb-0.5">Comunicados</p>
          <h2 className="font-display text-2xl font-semibold text-cafe">Nuevo Comunicado</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Título *</label>
            <Input placeholder="Ej: Convocatoria reunión ordinaria marzo" value={form.titulo} onChange={e => set("titulo", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tipo</label>
            <select value={form.tipo} onChange={e => set("tipo", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 bg-white">
              <option value="GENERAL">General</option>
              <option value="URGENTE">Urgente</option>
              <option value="CITACION">Citación</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Contenido *</label>
            <textarea value={form.contenido} onChange={e => set("contenido", e.target.value)} rows={12}
              placeholder="Escribe aquí el contenido del comunicado..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 resize-none transition-all" />
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">{error}</div>}

        <div className="flex justify-end gap-3 pb-4">
          <Link href="/comunicados" className="px-5 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-stone-50 transition-colors">
            Cancelar
          </Link>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 border border-stone-200 bg-white text-sm font-medium text-gray-700 rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-60">
            {loading ? <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" /> : <Save size={15} />}
            Guardar borrador
          </button>
          <button type="button" disabled={loading} onClick={e => handleSubmit(e as any, true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-verde-600 text-white text-sm font-semibold rounded-xl hover:bg-verde-500 transition-colors disabled:opacity-60">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={15} />}
            Publicar ahora
          </button>
        </div>
      </form>
    </main>
  );
}