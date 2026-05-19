"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 transition-all bg-white" />
);

export default function NuevoProyectoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre: "", descripcion: "", estado: "PLANEACION",
    presupuesto: "", responsable: "", inicio: "", fin: "",
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) { setError("El nombre es requerido"); return; }
    setLoading(true);
    const res = await fetch("/api/proyectos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/proyectos");
    else { const d = await res.json(); setError(d.error); setLoading(false); }
  };

  return (
    <main className="flex-1 p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/proyectos" className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors">
          <ArrowLeft size={16} className="text-gray-500" />
        </Link>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-verde-500 mb-0.5">Proyectos</p>
          <h2 className="font-display text-2xl font-semibold text-cafe">Nuevo Proyecto</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h3 className="font-display text-base font-semibold text-cafe mb-4">Información</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="Nombre *">
                <Input placeholder="Ej: Pavimentación calle 5" value={form.nombre} onChange={e => set("nombre", e.target.value)} />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Descripción">
                <textarea value={form.descripcion} onChange={e => set("descripcion", e.target.value)} rows={3}
                  placeholder="Descripción del proyecto..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 resize-none transition-all" />
              </Field>
            </div>
            <Field label="Estado">
              <select value={form.estado} onChange={e => set("estado", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 bg-white">
                <option value="PLANEACION">Planeación</option>
                <option value="EN_EJECUCION">En Ejecución</option>
                <option value="COMPLETADO">Completado</option>
                <option value="SUSPENDIDO">Suspendido</option>
              </select>
            </Field>
            <Field label="Responsable">
              <Input placeholder="Ej: Carlos Perdomo" value={form.responsable} onChange={e => set("responsable", e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h3 className="font-display text-base font-semibold text-cafe mb-4">Presupuesto y Fechas</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Presupuesto (COP)">
              <Input type="number" placeholder="Ej: 5000000" min="0" value={form.presupuesto} onChange={e => set("presupuesto", e.target.value)} />
            </Field>
            <div />
            <Field label="Fecha de Inicio">
              <Input type="date" value={form.inicio} onChange={e => set("inicio", e.target.value)} />
            </Field>
            <Field label="Fecha de Finalización">
              <Input type="date" value={form.fin} onChange={e => set("fin", e.target.value)} />
            </Field>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">{error}</div>}

        <div className="flex justify-end gap-3 pb-4">
          <Link href="/proyectos" className="px-5 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-stone-50 transition-colors">Cancelar</Link>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-verde-600 text-white text-sm font-semibold rounded-xl hover:bg-verde-500 transition-colors disabled:opacity-60">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
            {loading ? "Guardando..." : "Guardar Proyecto"}
          </button>
        </div>
      </form>
    </main>
  );
}