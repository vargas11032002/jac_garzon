"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LogOut, Home, CreditCard, ClipboardList, Megaphone, CalendarDays } from "lucide-react";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") return (
    <div className="min-h-screen bg-verde-600 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  );

  if (!session) return null;

  const navItems = [
    { href: "/portal", icon: Home, label: "Inicio" },
    { href: "/portal/carnet", icon: CreditCard, label: "Mi Carnet" },
    { href: "/portal/estado-cuenta", icon: ClipboardList, label: "Estado de Cuenta" },
    { href: "/portal/comunicados", icon: Megaphone, label: "Comunicados" },
    { href: "/portal/calendario", icon: CalendarDays, label: "Calendario" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-verde-600 via-verde-700 to-verde-900">
      <nav className="bg-white/10 backdrop-blur border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="font-display text-white font-semibold text-base leading-tight">JAC Garzón</p>
            <p className="text-white/50 text-[11px]">Portal del Comunero</p>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap
                  ${path === href ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
                <Icon size={13} /> <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 text-xs transition-all ml-2">
              <LogOut size={13} /> <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}