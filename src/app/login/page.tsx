"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ cedula: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      cedula: form.cedula.trim(),
      password: form.password,
      redirect: false,
    });
    if (res?.ok) {
      router.push("/portal");
    } else {
      setError("Cédula o contraseña incorrecta. Verifique sus datos.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-verde-600 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-verde-500 rounded-full opacity-30" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-verde-700 rounded-full opacity-40" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur rounded-2xl mb-4 border border-white/20">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">JAC Garzón</h1>
          <p className="text-white/60 text-sm mt-1">Portal del Comunero — Garzón, Huila</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="font-display text-xl font-semibold text-cafe mb-1">Iniciar Sesión</h2>
          <p className="text-sm text-gray-400 mb-6">Ingresa con tu cédula y contraseña asignada</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Número de Cédula</label>
              <input type="text" inputMode="numeric" placeholder="Ej: 12345678"
                value={form.cedula} onChange={e => setForm(f => ({ ...f, cedula: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 transition-all"
                required />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Contraseña</label>
              <div className="relative">
                <input type={show ? "text" : "password"} placeholder="Tu contraseña"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 transition-all"
                  required />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-verde-600 text-white font-semibold text-sm rounded-xl hover:bg-verde-500 transition-colors disabled:opacity-60 mt-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LogIn size={16} />}
              {loading ? "Verificando..." : "Ingresar"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-100">
            <p className="text-xs text-gray-500 text-center">
              <strong>Contraseña inicial:</strong> tu número de cédula<br/>
              <span className="text-gray-400">Comunícate con el presidente si tienes problemas</span>
            </p>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">Sistema desarrollado por JAV Dev Group</p>
      </div>
    </div>
  );
}