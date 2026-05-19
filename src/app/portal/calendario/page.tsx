"use client";
import { useEffect, useState, useCallback } from "react";
import { CalendarDays, MapPin, Clock } from "lucide-react";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

const TIPO_COLORS: Record<string, string> = {
  REUNION:      "bg-verde-50 text-verde-600",
  ASAMBLEA:     "bg-blue-50 text-blue-600",
  CAPACITACION: "bg-purple-50 text-purple-600",
  OTRO:         "bg-stone-100 text-gray-600",
};

interface Evento {
  id: string; titulo: string; descripcion: string | null;
  fecha: string; horaInicio: string | null; horaFin: string | null;
  lugar: string | null; tipo: string;
}

export default function PortalCalendarioPage() {
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/eventos");
    setEventos(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

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
    <div className="space-y-6">
      <div>
        <p className="text-white/50 text-sm mb-1">Portal del Comunero</p>
        <h2 className="font-display text-2xl font-semibold text-white">Calendario</h2>
        <p className="text-white/40 text-sm mt-1">Eventos y reuniones de la JAC</p>
      </div>

      {/* Calendario */}
      <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/15 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-semibold text-white">{MESES[mes]} {anio}</h3>
          <div className="flex gap-2">
            <button onClick={prevMes} className="px-3 py-1.5 text-xs bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">‹</button>
            <button onClick={nextMes} className="px-3 py-1.5 text-xs bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">›</button>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-7 mb-2">
            {DIAS.map(d => <div key={d} className="text-center text-[11px] font-semibold text-white/30 py-2">{d}</div>)}
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
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm cursor-pointer transition-colors
                    ${esHoy ? "bg-white text-verde-700 font-bold" : seleccionado ? "bg-white/20 text-white font-semibold" : "hover:bg-white/10 text-white/70"}`}>
                  {dia}
                  {tieneEventos && <div className={`w-1 h-1 rounded-full mt-0.5 ${esHoy ? "bg-verde-500" : "bg-white/60"}`} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Eventos del día seleccionado o del mes */}
      <div>
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <CalendarDays size={16} className="text-white/50" />
          {diaSeleccionado ? `Eventos del ${diaSeleccionado} de ${MESES[mes]}` : `Eventos de ${MESES[mes]}`}
        </h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : (diaSeleccionado ? eventosDiaSeleccionado : eventosDelMes).length === 0 ? (
          <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/15 p-8 text-center">
            <p className="text-white/40 text-sm">Sin eventos {diaSeleccionado ? "este día" : "este mes"}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(diaSeleccionado ? eventosDiaSeleccionado : eventosDelMes).map(e => (
              <div key={e.id} className="bg-white/10 backdrop-blur rounded-2xl border border-white/15 p-4 flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-white/50 uppercase leading-none">
                    {new Date(e.fecha).toLocaleDateString("es-CO", { month: "short" })}
                  </span>
                  <span className="text-lg font-bold text-white leading-none">{new Date(e.fecha).getDate()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TIPO_COLORS[e.tipo] ?? TIPO_COLORS.OTRO}`}>
                      {e.tipo}
                    </span>
                  </div>
                  <p className="text-white font-semibold text-sm">{e.titulo}</p>
                  {e.descripcion && <p className="text-white/50 text-xs mt-1">{e.descripcion}</p>}
                  <div className="flex flex-wrap gap-3 mt-2">
                    {e.lugar && (
                      <span className="flex items-center gap-1 text-white/40 text-xs">
                        <MapPin size={10} /> {e.lugar}
                      </span>
                    )}
                    {e.horaInicio && (
                      <span className="flex items-center gap-1 text-white/40 text-xs">
                        <Clock size={10} /> {e.horaInicio}{e.horaFin ? ` - ${e.horaFin}` : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}