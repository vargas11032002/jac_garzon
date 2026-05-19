"use client";
import { useState, useEffect, useCallback } from "react";
import { CalendarPlus, Trash2, X, MapPin, Clock } from "lucide-react";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

const TIPO_COLORS: Record<string, string> = {
  REUNION:    "bg-verde-50 text-verde-600 border-verde-100",
  ASAMBLEA:   "bg-blue-50 text-blue-600 border-blue-100",
  CAPACITACION: "bg-purple-50 text-purple-600 border-purple-100",
  OTRO:       "bg-stone-100 text-gray-600 border-stone-200",
};

interface Evento {
  id: string; titulo: string; descripcion: string | null;
  fecha: string; horaInicio: string | null; horaFin: string | null;
  lugar: string | null; tipo: string;
}

const EMPTY_FORM = { titulo: "", descripcion: "", fecha: "", horaInicio: "", horaFin: "", lugar: "", tipo: "REUNION" };

export default function CalendarioPage() {
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/eventos");
    setEventos(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setModal(false);
    setForm(EMPTY_FORM);
    load();
  };

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`¿Eliminar "${titulo}"?`)) return;
    await fetch(`/api/eventos/${id}`, { method: "DELETE" });
    load();
  };

  // Calendario
  const primerDia = new Date(anio, mes, 1).getDay();
  const diasEnMes = new Date(anio, mes + 1, 0).getDate();

  const eventosDelMes = eventos.filter(e => {
    const f = new Date(e.fecha);
    return f.getMonth() === mes && f.getFullYear() === anio;
  });

  const eventosPorDia = (dia: number) =>
    eventosDelMes.filter(e => new Date(e.fecha).getDate() === dia);

  const eventosDiaSeleccionado = diaSeleccionado ? eventosPorDia(diaSeleccionado) : [];

  const prevMes = () => { if (mes === 0) { setMes(11); setAnio(a => a - 1); } else setMes(m => m - 1); setDiaSeleccionado(null); };
  const nextMes = () => { if (mes === 11) { setMes(0); setAnio(a => a + 1); } else setMes(m => m + 1); setDiaSeleccionado(null); };

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="flex items-start justify-between mb-6 md:mb-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-verde-500 mb-1">Planificación</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-cafe">Calendario</h2>
          <p className="text-sm text-gray-500 mt-1">Reuniones, eventos y fechas importantes</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-verde-600 text-white text-sm font-medium rounded-xl hover:bg-verde-500 transition-colors">
          <CalendarPlus size={16} /> <span className="hidden sm:inline">Nuevo Evento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {/* Calendario */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-cafe">{MESES[mes]} {anio}</h3>
            <div className="flex gap-2">
              <button onClick={prevMes} className="px-3 py-1.5 text-xs border border-stone-200 rounded-lg hover:bg-stone-50">‹ Anterior</button>
              <button onClick={nextMes} className="px-3 py-1.5 text-xs border border-stone-200 rounded-lg hover:bg-stone-50">Siguiente ›</button>
            </div>
          </div>
          <div className="p-4 md:p-5">
            <div className="grid grid-cols-7 mb-2">
              {DIAS.map(d => <div key={d} className="text-center text-[11px] font-semibold text-gray-400 py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: primerDia }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: diasEnMes }).map((_, i) => {
                const dia = i + 1;
                const esHoy = dia === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear();
                const tieneEventos = eventosPorDia(dia).length > 0;
                const seleccionado = diaSeleccionado === dia;
                return (
                  <div key={dia} onClick={() => setDiaSeleccionado(seleccionado ? null : dia)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm cursor-pointer transition-colors relative
                      ${esHoy ? "bg-verde-600 text-white font-semibold" : seleccionado ? "bg-verde-100 text-verde-700 font-semibold" : "hover:bg-verde-50 text-cafe"}`}>
                    {dia}
                    {tieneEventos && (
                      <div className={`w-1 h-1 rounded-full mt-0.5 ${esHoy ? "bg-white" : "bg-verde-500"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel lateral */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100">
            <h3 className="font-display text-base font-semibold text-cafe">
              {diaSeleccionado ? `${diaSeleccionado} de ${MESES[mes]}` : "Próximos Eventos"}
            </h3>
          </div>
          <div className="divide-y divide-stone-50">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-5 h-5 border-2 border-stone-200 border-t-verde-500 rounded-full animate-spin" />
              </div>
            ) : diaSeleccionado ? (
              eventosDiaSeleccionado.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-xs text-gray-400">Sin eventos este día</p>
                  <button onClick={() => { setForm(f => ({ ...f, fecha: `${anio}-${String(mes+1).padStart(2,"0")}-${String(diaSeleccionado).padStart(2,"0")}` })); setModal(true); }}
                    className="text-xs text-verde-600 mt-2 hover:underline font-medium">+ Agregar evento</button>
                </div>
              ) : eventosDiaSeleccionado.map(e => (
                <EventoCard key={e.id} evento={e} onDelete={handleDelete} />
              ))
            ) : (
              eventosDelMes.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-10">Sin eventos este mes</p>
              ) : eventosDelMes.slice(0, 6).map(e => (
                <EventoCard key={e.id} evento={e} onDelete={handleDelete} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal nuevo evento */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <h3 className="font-display text-lg font-semibold text-cafe">Nuevo Evento</h3>
              <button onClick={() => { setModal(false); setForm(EMPTY_FORM); }} className="w-8 h-8 rounded-lg hover:bg-stone-100 flex items-center justify-center transition-colors">
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Título *</label>
                <input value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} required
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-cafe outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 transition-all"
                  placeholder="Ej: Asamblea ordinaria" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Fecha *</label>
                  <input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} required
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-cafe outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tipo</label>
                  <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-cafe outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 transition-all">
                    <option value="REUNION">Reunión</option>
                    <option value="ASAMBLEA">Asamblea</option>
                    <option value="CAPACITACION">Capacitación</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Hora inicio</label>
                  <input type="time" value={form.horaInicio} onChange={e => setForm(f => ({ ...f, horaInicio: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-cafe outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Hora fin</label>
                  <input type="time" value={form.horaFin} onChange={e => setForm(f => ({ ...f, horaFin: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-cafe outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Lugar</label>
                <input value={form.lugar} onChange={e => setForm(f => ({ ...f, lugar: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-cafe outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 transition-all"
                  placeholder="Ej: Salón comunal" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Descripción</label>
                <textarea value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-cafe outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-50 transition-all resize-none"
                  placeholder="Detalles del evento..." />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setModal(false); setForm(EMPTY_FORM); }}
                  className="flex-1 py-2.5 border border-stone-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-verde-600 text-white text-sm font-semibold rounded-xl hover:bg-verde-500 transition-colors disabled:opacity-60">
                  {saving ? "Guardando..." : "Guardar Evento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function EventoCard({ evento, onDelete }: { evento: Evento; onDelete: (id: string, titulo: string) => void }) {
  const color = TIPO_COLORS[evento.tipo] ?? TIPO_COLORS.OTRO;
  return (
    <div className="px-5 py-3 flex items-start gap-3 group hover:bg-stone-50 transition-colors">
      <div className="w-9 h-9 rounded-xl bg-verde-50 flex flex-col items-center justify-center shrink-0">
        <span className="text-[9px] font-bold text-verde-600 leading-none uppercase">
          {new Date(evento.fecha).toLocaleDateString("es-CO", { month: "short" })}
        </span>
        <span className="text-sm font-bold text-verde-700 leading-none">{new Date(evento.fecha).getDate()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${color}`}>{evento.tipo}</span>
        </div>
        <p className="text-sm font-medium text-cafe truncate">{evento.titulo}</p>
        {evento.lugar && (
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <MapPin size={10} /> {evento.lugar}
          </p>
        )}
        {evento.horaInicio && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={10} /> {evento.horaInicio}{evento.horaFin ? ` - ${evento.horaFin}` : ""}
          </p>
        )}
      </div>
      <button onClick={() => onDelete(evento.id, evento.titulo)}
        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-all shrink-0">
        <Trash2 size={12} className="text-red-400" />
      </button>
    </div>
  );
}