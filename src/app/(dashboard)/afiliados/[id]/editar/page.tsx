"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const CARGOS = ["Comunero","Presidente","Vicepresidente","Tesorero","Fiscal","Secretario","Vocal"];

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 transition-all bg-white" />
);

export default function EditarAfiliadoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    nombre: "", apellido: "", telefono: "", email: "",
    direccion: "", barrio: "", cargo: "Comunero",
    activo: true, vigenciaHasta: "",
  });

  useEffect(() => {
    fetch(`/api/afiliados/${id}`).then(r => r.json()).then(d => {
      setForm({
        nombre: d.nombre ?? "", apellido: d.apellido ?? "",
        telefono: d.telefono ?? "", email: d.email ?? "",
        direccion: d.direccion ?? "", barrio: d.barrio ?? "",
        cargo: d.cargo ?? "Comunero", activo: d.activo ?? true,
        vigenciaHasta: d.vigenciaHasta ? d.vigenciaHasta.split("T")[0] : "",
      });
      setFetching(false);
    });
  }, [id]);

  const set = (k: string, v: string | boolean) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/afiliados/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push(`/afiliados/${id}`);
    else {
      const d = await res.json();
      setErrors({ general: d.error });
      setLoading(false);
    }
  };

  if (fetching) return (
    <main className="flex-1 p-8 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-stone-200 border-t-verde-500 rounded-full animate-spin" />
    </main>
  );

  return (
    <main className="flex-1 p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/afiliados/${id}`} className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors">
          <ArrowLeft size={16} className="text-gray-500" />
        </Link>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-verde-500 mb-0.5">Afiliados</p>
          <h2 className="font-display text-2xl font-semibold text-cafe">Editar Afiliado</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 grid grid-cols-2 gap-4">
          <Field label="Nombre(s) *">
            <Input value={form.nombre} onChange={e => set("nombre", e.target.value)} />
          </Field>
          <Field label="Apellido(s) *">
            <Input value={form.apellido} onChange={e => set("apellido", e.target.value)} />
          </Field>
          <Field label="Teléfono">
            <Input value={form.telefono} onChange={e => set("telefono", e.target.value.replace(/\D/g, ""))} maxLength={10} />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} />
          </Field>
          <Field label="Barrio">
            <Input value={form.barrio} onChange={e => set("barrio", e.target.value)} />
          </Field>
          <Field label="Dirección">
            <Input value={form.direccion} onChange={e => set("direccion", e.target.value)} />
          </Field>
          <Field label="Cargo">
            <select value={form.cargo} onChange={e => set("cargo", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 bg-white">
              {CARGOS.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Vigencia del Carnet">
            <Input type="date" value={form.vigenciaHasta} onChange={e => set("vigenciaHasta", e.target.value)} />
          </Field>
          <div className="col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.activo} onChange={e => set("activo", e.target.checked)}
                className="w-4 h-4 rounded accent-verde-600" />
              <span className="text-sm font-medium text-cafe">Afiliado activo</span>
            </label>
          </div>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">{errors.general}</div>
        )}

        <div className="flex justify-end gap-3">
          <Link href={`/afiliados/${id}`}
            className="px-5 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-stone-50 transition-colors">
            Cancelar
          </Link>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-verde-600 text-white text-sm font-semibold rounded-xl hover:bg-verde-500 transition-colors disabled:opacity-60">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </main>
  );
}
