"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, Trash2, Printer } from "lucide-react";
import Link from "next/link";

export default function ActaDetallePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [acta, setActa] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/actas/${id}`).then(r => r.json()).then(d => { setActa(d); setLoading(false); });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta acta?")) return;
    await fetch(`/api/actas/${id}`, { method: "DELETE" });
    router.push("/actas");
  };

  const handleAprobar = async () => {
    const res = await fetch(`/api/actas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aprobada: !acta.aprobada }),
    });
    setActa(await res.json());
  };

  if (loading) return <main className="flex-1 p-8 flex items-center justify-center"><div className="w-6 h-6 border-2 border-stone-200 border-t-verde-500 rounded-full animate-spin" /></main>;
  if (!acta || acta.error) return <main className="flex-1 p-8"><p className="text-red-500">Acta no encontrada.</p></main>;

  const puntos: string[] = JSON.parse(acta.orden || "[]");

  return (
    <main className="flex-1 p-8 max-w-3xl">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/actas" className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors">
            <ArrowLeft size={16} className="text-gray-500" />
          </Link>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[2px] text-verde-500 mb-0.5">Actas</p>
            <h2 className="font-display text-2xl font-semibold text-cafe">Acta N° {acta.numero}</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 bg-white text-sm font-medium text-gray-700 rounded-xl hover:bg-stone-50 transition-colors">
            <Printer size={14} /> Imprimir
          </button>
          <button onClick={handleAprobar}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors
              ${acta.aprobada ? "bg-stone-100 text-gray-600 hover:bg-stone-200" : "bg-verde-600 text-white hover:bg-verde-500"}`}>
            <CheckCircle2 size={14} /> {acta.aprobada ? "Desaprobar" : "Aprobar Acta"}
          </button>
          <button onClick={handleDelete}
            className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 flex items-center justify-center transition-colors">
            <Trash2 size={15} className="text-red-400" />
          </button>
        </div>
      </div>

      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-cafe">
                Acta {acta.tipo.charAt(0) + acta.tipo.slice(1).toLowerCase()} N° {acta.numero}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Junta de Acción Comunal — Garzón, Huila</p>
            </div>
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${acta.aprobada ? "bg-verde-50 text-verde-600" : "bg-amber-50 text-amber-500"}`}>
              {acta.aprobada ? <><CheckCircle2 size={12} /> Aprobada</> : <><Clock size={12} /> Pendiente</>}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-100">
            {[
              { label: "Fecha", value: new Date(acta.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" }) },
              { label: "Lugar", value: acta.lugar },
              { label: "Asistentes", value: `${acta.asistentes} personas` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
                <p className="text-sm font-medium text-cafe mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {puntos.length > 0 && (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h3 className="font-display text-base font-semibold text-cafe mb-4">Orden del Día</h3>
            <ol className="space-y-2">
              {puntos.map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-verde-50 text-verde-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-sm text-cafe pt-0.5">{p}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h3 className="font-display text-base font-semibold text-cafe mb-4">Desarrollo de la Reunión</h3>
          {acta.contenido
            ? <div className="text-sm text-cafe leading-relaxed whitespace-pre-wrap">{acta.contenido}</div>
            : <p className="text-sm text-gray-400 italic">Sin contenido registrado</p>}
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h3 className="font-display text-base font-semibold text-cafe mb-6">Firmas</h3>
          <div className="grid grid-cols-2 gap-8">
            {["Presidente", "Secretario"].map(cargo => (
              <div key={cargo} className="text-center">
                <div className="h-12 border-b border-dashed border-stone-300 mb-2" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{cargo}</p>
                <p className="text-xs text-gray-400">Junta de Acción Comunal</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}