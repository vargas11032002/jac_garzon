export type Cargo =
  | "Comunero"
  | "Presidente"
  | "Vicepresidente"
  | "Tesorero"
  | "Fiscal"
  | "Secretario"
  | "Vocal";

export interface AfiladoSession {
  id: string;
  cedula: string;
  codigoJAC: string;
  nombre: string;
  apellido: string;
  barrio: string | null;
  cargo: Cargo;
  foto: string | null;
  fechaIngreso: string;
  vigenciaHasta: string | null;
  activo: boolean;
}

export interface CuotaResumen {
  mes: number;
  anio: number;
  valor: number;
  pagado: boolean;
  fechaPago: string | null;
}
