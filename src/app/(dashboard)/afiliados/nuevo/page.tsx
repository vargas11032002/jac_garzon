"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, User } from "lucide-react";
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

export default function NuevoAfiliadoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    cedula: "", nombre: "", apellido: "", telefono: "",
    email: "", direccion: "", barrio: "", cargo: "Comunero", vigenciaHasta: "",
  });

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.cedula.trim()) e.cedula = "La cédula es requerida";
    else if (!/^\d{6,12}$/.test(form.cedula.trim())) e.cedula = "Cédula inválida (solo números, 6-12 dígitos)";
    if (!form.nombre.trim()) e.nombre = "El nombre es requerido";
    if (!form.apellido.trim()) e.apellido = "El apellido es requerido";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido";
    if (form.telefono && !/^\d{7,10}$/.test(form.telefono.replace(/\s/g, ""))) e.telefono = "Teléfono inválido";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/afiliados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErrors({ general: data.error }); setLoading(false); return; }
      router.push("/afiliados?success=1");
    } catch {
      setErrors({ general: "Error de conexión. Intenta de nuevo." });
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/afiliados" className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors">
          <ArrowLeft size={16} className="text-gray-500" />
        </Link>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-verde-500 mb-0.5">Afiliados</p>
          <h2 className="font-display text-2xl font-semibold text-cafe">Registrar Nuevo Afiliado</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info personal */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-2">
            <User size={15} className="text-verde-500" />
            <h3 className="font-display text-base font-semibold text-cafe">Información Personal</h3>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <Field label="Cédula *" error={errors.cedula}>
              <Input placeholder="Ej: 12847392" value={form.cedula}
                onChange={e => set("cedula", e.target.value.replace(/\D/g, ""))} maxLength={12} />
            </Field>
            <Field label="Cargo en la JAC">
              <select value={form.cargo} onChange={e => set("cargo", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 transition-all bg-white">
                {CARGOS.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Nombre(s) *" error={errors.nombre}>
              <Input placeholder="Ej: Carlos Eduardo" value={form.nombre}
                onChange={e => set("nombre", e.target.value)} />
            </Field>
            <Field label="Apellido(s) *" error={errors.apellido}>
              <Input placeholder="Ej: Perdomo Trujillo" value={form.apellido}
                onChange={e => set("apellido", e.target.value)} />
            </Field>
            <Field label="Teléfono" error={errors.telefono}>
              <Input placeholder="Ej: 3101234567" value={form.telefono}
                onChange={e => set("telefono", e.target.value.replace(/\D/g, ""))} maxLength={10} />
            </Field>
            <Field label="Correo Electrónico" error={errors.email}>
              <Input type="email" placeholder="Ej: carlos@gmail.com" value={form.email}
                onChange={e => set("email", e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Ubicación */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h3 className="font-display text-base font-semibold text-cafe">Ubicación</h3>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <Field label="Barrio">
              <Input placeholder="Ej: La Esperanza" value={form.barrio}
                onChange={e => set("barrio", e.target.value)} />
            </Field>
            <Field label="Dirección">
              <Input placeholder="Ej: Calle 5 #10-23" value={form.direccion}
                onChange={e => set("direccion", e.target.value)} />
            </Field>
            <Field label="Vigencia del Carnet">
              <Input type="date" value={form.vigenciaHasta}
                onChange={e => set("vigenciaHasta", e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Info contraseña */}
        <div className="bg-verde-50 border border-verde-100 rounded-2xl p-4 text-sm text-verde-700">
          <strong>Contraseña inicial:</strong> Se asigna automáticamente igual al número de cédula. El comunero puede cambiarla desde su portal.
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">
            {errors.general}
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 pb-4">
          <Link href="/afiliados"
            className="px-5 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-stone-50 transition-colors">
            Cancelar
          </Link>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-verde-600 text-white text-sm font-semibold rounded-xl hover:bg-verde-500 transition-colors disabled:opacity-60">
            {loading
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save size={15} />}
            {loading ? "Guardando..." : "Guardar Afiliado"}
          </button>
        </div>
      </form>
    </main>
  );
}
