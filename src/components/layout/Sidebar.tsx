"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Users, FileText, FolderKanban,
  Wallet, Megaphone, CalendarDays, ChevronRight, LogOut
} from "lucide-react";

const nav = [
  { label: "Panel Principal", href: "/dashboard", icon: LayoutDashboard },
  { label: "Afiliados", href: "/afiliados", icon: Users, badge: null },
  { label: "Actas", href: "/actas", icon: FileText },
  { label: "Proyectos", href: "/proyectos", icon: FolderKanban },
  { label: "Tesorería", href: "/tesoreria", icon: Wallet },
  { label: "Comunicados", href: "/comunicados", icon: Megaphone },
  { label: "Calendario", href: "/calendario", icon: CalendarDays },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-verde-600 flex flex-col z-50 overflow-y-auto">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/10">
        <p className="text-[9px] font-semibold tracking-[3px] uppercase text-white/40 mb-1">Sistema de Gestión</p>
        <h1 className="font-display text-2xl font-bold text-white leading-tight">
          JAC <span className="text-dorado-100">Garzón</span>
        </h1>
        <p className="mt-2 text-[11px] text-white/50 leading-snug">Juntas de Acción Comunal<br/>Garzón, Huila</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3">
        <p className="px-3 mb-2 text-[9px] font-semibold tracking-[2.5px] uppercase text-white/30">Módulos</p>
        {nav.map(({ label, href, icon: Icon }) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-[9px] mx-1 rounded-lg text-[13.5px] font-medium mb-[2px] transition-all group
                ${active
                  ? "bg-white/20 text-white"
                  : "text-white/65 hover:bg-white/10 hover:text-white"}`}
            >
              <Icon size={17} className="shrink-0 opacity-80" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={13} className="opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 bg-white/8 rounded-xl transition-all">
          <div className="w-8 h-8 rounded-full bg-dorado-500 flex items-center justify-center text-white font-bold text-sm shrink-0">P</div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-white truncate">Presidente JAC</p>
            <p className="text-[10px] text-white/45">Administrador</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Cerrar sesión"
            className="text-white/30 hover:text-white transition-colors cursor-pointer">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}