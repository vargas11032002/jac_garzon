"use client";
import { useState, useEffect, useCallback } from "react";
import { PlusCircle, TrendingUp, TrendingDown, Wallet, Trash2, ArrowUpRight, ArrowDownRight, X } from "lucide-react";

const fmt = (v: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

const CATEGORIAS_INGRESO = ["Cuotas","Donación","Subsidio","Multa","Otro ingreso"];
const CATEGORIAS_EGRESO  = ["Servicios","Materiales","Transporte","Alimentación","Honorarios","Evento","Otro gasto"];
const MESES = ["","Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

interface Transaccion {
  id: string; tipo: string; concepto: string; valor: number;
  fecha: string; categoria: string | null; notas: string | null;
}

interface Modal { open: boolean; tipo: "INGRESO" | "EGRESO"; }

export default function TesoreriaPage() {
  const anio = new Date().getFullYear();
  const [data, setData] = useState<{ transacciones: Transaccion[]; ingresos: number; egresos: number; saldo: number }>({
    transacciones: [], ingresos: 0, egresos: 0, saldo: 0,
  });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Modal>({ open: false, tipo: "INGRESO" });
  const [saving, setSaving] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [form, setForm] = useState({ concepto: "", valor: "", fecha: new Date().toISOString().split("T")[0], categoria: "", notas: "" });
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/tesoreria?anio=${anio}${filtroTipo ? `&tipo=${filtroTipo}` : ""}`);
    setData(await res.json());
    setLoading(false);
  }, [anio, filtroTipo]);

  useEffect(() => { load(); }, [load]);

  const openModal = (tipo: "INGRESO" | "EGRESO") => {
    setForm({ concepto: "", valor: "", fecha: new Date().toISOString().split("T")[0], categoria: "", notas: "" });
    setError("");
    setModal({ open: true, tipo });
  };

  const handleSave = async () => {
    if (!form.concepto.trim() || !form.valor) { setError("Concepto y valor son requeridos"); return; }
    if (isNaN(Number(form.valor)) || Number(form.valor) <= 0) { setError("El valor debe ser un número positivo"); return; }
    setSaving(true);
    const res = await fetch("/api/tesoreria", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tipo: modal.tipo }),
    });
    if (res.ok) { setModal({ open: false, tipo: "INGRESO" }); load(); }
    else { const d = await res.json(); setError(d.error); }
    setSaving(false);
  };

  const handleDelete = async (id: string, concepto: string) => {
    if (!confirm(`¿Eliminar "${concepto}"?`)) return;
    await fetch(`/api/tesoreria/${id}`, { method: "DELETE" });
    load();
  };

  const categorias = modal.tipo === "INGRESO" ? CATEGORIAS_INGRESO : CATEGORIAS_EGRESO;

  return (
    <main className="flex-1 p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-verde-500 mb-1">Finanzas</p>
          <h2 className="font-display text-3xl font-semibold text-cafe">Tesorería</h2>
          <p className="text-sm text-gray-500 mt-1">Ingresos, egresos e informes — {anio}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => openModal("EGRESO")}
            className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 bg-white text-sm font-medium text-gray-700 rounded-xl hover:bg-stone-50 transition-colors">
            <ArrowDownRight size={15} className="text-red-500" /> Registrar Egreso
          </button>
          <button onClick={() => openModal("INGRESO")}
            className="flex items-center gap-2 px-4 py-2.5 bg-verde-600 text-white text-sm font-medium rounded-xl hover:bg-verde-500 transition-colors">
            <PlusCircle size={15} /> Registrar Ingreso
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Saldo Actual", value: data.saldo, icon: Wallet, color: data.saldo >= 0 ? "text-verde-600" : "text-red-500", bg: "bg-verde-50" },
          { label: "Ingresos del Año", value: data.ingresos, icon: TrendingUp, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Egresos del Año", value: data.egresos, icon: TrendingDown, color: "text-red-600", bg: "bg-red-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={17} className={color} />
              </div>
            </div>
            <p className={`font-display text-3xl font-semibold ${color}`}>{fmt(value)}</p>
          </div>
        ))}
      </div>

      {/* Resumen mensual mini */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-base font-semibold text-cafe">Distribución Anual</h3>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-verde-600 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-verde-500 inline-block"/>Ingresos</span>
            <span className="flex items-center gap-1.5 text-red-500 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"/>Egresos</span>
          </div>
        </div>
        <div className="flex items-end gap-1.5 h-20">
          {MESES.slice(1).map((m, i) => {
            const mesNum = i + 1;
            const ing = data.transacciones.filter(t => t.tipo === "INGRESO" && new Date(t.fecha).getMonth() + 1 === mesNum).reduce((s, t) => s + t.valor, 0);
            const eg  = data.transacciones.filter(t => t.tipo === "EGRESO"  && new Date(t.fecha).getMonth() + 1 === mesNum).reduce((s, t) => s + t.valor, 0);
            const max = Math.max(data.ingresos, data.egresos, 1);
            const hIng = Math.round((ing / max) * 64);
            const hEg  = Math.round((eg  / max) * 64);
            return (
              <div key={m} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full flex items-end justify-center gap-0.5" style={{ height: 64 }}>
                  <div className="w-2 rounded-t bg-verde-400 transition-all" style={{ height: hIng || 2 }} title={`Ingresos: ${fmt(ing)}`} />
                  <div className="w-2 rounded-t bg-red-300 transition-all"   style={{ height: hEg  || 2 }} title={`Egresos: ${fmt(eg)}`} />
                </div>
                <span className="text-[9px] text-gray-400">{m}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filtros y tabla */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-cafe">Movimientos</h3>
          <div className="flex gap-2">
            {[["", "Todos"], ["INGRESO", "Ingresos"], ["EGRESO", "Egresos"]].map(([val, label]) => (
              <button key={val} onClick={() => setFiltroTipo(val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                  ${filtroTipo === val ? "bg-verde-600 text-white" : "bg-stone-50 text-gray-500 hover:bg-stone-100"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-gray-400">
            <div className="w-5 h-5 border-2 border-stone-200 border-t-verde-500 rounded-full animate-spin" />
          </div>
        ) : data.transacciones.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-display text-lg text-cafe/50">Sin movimientos registrados</p>
            <p className="text-sm text-gray-400 mt-1">Registra el primer ingreso o egreso</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                {["Fecha", "Concepto", "Categoría", "Tipo", "Valor", ""].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {data.transacciones.map(t => (
                <tr key={t.id} className="hover:bg-stone-50/50 transition-colors group">
                  <td className="px-5 py-3.5 text-sm text-gray-400 whitespace-nowrap">
                    {new Date(t.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-cafe">{t.concepto}</p>
                    {t.notas && <p className="text-xs text-gray-400 mt-0.5">{t.notas}</p>}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-400">{t.categoria ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full
                      ${t.tipo === "INGRESO" ? "bg-verde-50 text-verde-600" : "bg-red-50 text-red-500"}`}>
                      {t.tipo === "INGRESO" ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                      {t.tipo === "INGRESO" ? "Ingreso" : "Egreso"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-sm font-semibold ${t.tipo === "INGRESO" ? "text-verde-600" : "text-red-500"}`}>
                      {t.tipo === "EGRESO" ? "-" : "+"}{fmt(t.valor)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => handleDelete(t.id, t.concepto)}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-all">
                      <Trash2 size={13} className="text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${modal.tipo === "INGRESO" ? "bg-verde-50" : "bg-red-50"}`}>
                  {modal.tipo === "INGRESO" ? <ArrowUpRight size={18} className="text-verde-600" /> : <ArrowDownRight size={18} className="text-red-500" />}
                </div>
                <h3 className="font-display text-lg font-semibold text-cafe">
                  {modal.tipo === "INGRESO" ? "Registrar Ingreso" : "Registrar Egreso"}
                </h3>
              </div>
              <button onClick={() => setModal(m => ({ ...m, open: false }))}
                className="w-8 h-8 rounded-xl hover:bg-stone-100 flex items-center justify-center transition-colors">
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Concepto *", key: "concepto", placeholder: modal.tipo === "INGRESO" ? "Ej: Cuotas marzo" : "Ej: Compra de materiales" },
                { label: "Valor (COP) *", key: "valor", placeholder: "Ej: 50000", type: "number" },
                { label: "Fecha", key: "fecha", type: "date" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input type={type ?? "text"} placeholder={placeholder}
                    value={(form as Record<string, string>)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 transition-all" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Categoría</label>
                <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 bg-white">
                  <option value="">Sin categoría</option>
                  {categorias.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Notas</label>
                <textarea value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} rows={2} placeholder="Observaciones opcionales..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-cafe text-sm outline-none focus:border-verde-500 resize-none transition-all" />
              </div>
              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setModal(m => ({ ...m, open: false }))}
                className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-stone-50 transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className={`flex-1 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60
                  ${modal.tipo === "INGRESO" ? "bg-verde-600 hover:bg-verde-500" : "bg-red-500 hover:bg-red-400"}`}>
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
