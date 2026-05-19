import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const afiliados = await prisma.afiliado.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        cuotas: {
          where: { anio: new Date().getFullYear() },
        },
      },
    });
    return NextResponse.json(afiliados);
  } catch (e) {
    return NextResponse.json({ error: "Error al obtener afiliados" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      cedula, nombre, apellido, telefono, email,
      direccion, barrio, cargo, vigenciaHasta,
    } = body;

    // Validaciones básicas
    if (!cedula || !nombre || !apellido) {
      return NextResponse.json({ error: "Cédula, nombre y apellido son requeridos" }, { status: 400 });
    }

    // Verificar cédula duplicada
    const existe = await prisma.afiliado.findUnique({ where: { cedula } });
    if (existe) {
      return NextResponse.json({ error: "Ya existe un afiliado con esa cédula" }, { status: 400 });
    }

    // Generar código JAC automático
    const count = await prisma.afiliado.count();
    const codigoJAC = `JAC-GAR-${String(count + 1).padStart(4, "0")}`;

    // Contraseña inicial = cédula
    const password = await bcrypt.hash(cedula, 10);

    const afiliado = await prisma.afiliado.create({
      data: {
        cedula,
        codigoJAC,
        nombre,
        apellido,
        telefono: telefono || null,
        email: email || null,
        direccion: direccion || null,
        barrio: barrio || null,
        cargo: cargo || "Comunero",
        vigenciaHasta: vigenciaHasta ? new Date(vigenciaHasta) : null,
        password,
      },
    });

    // Generar cuotas del año actual automáticamente
    const anio = new Date().getFullYear();
    const config = await prisma.configuracionJAC.findFirst();
    const valorCuota = config?.valorCuotaMes ?? 5000;

    await prisma.cuota.createMany({
      data: Array.from({ length: 12 }, (_, i) => ({
        afiliadoId: afiliado.id,
        mes: i + 1,
        anio,
        valor: valorCuota,
        pagado: false,
      })),
    });

    const { password: _, ...rest } = afiliado;
    return NextResponse.json(rest, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al crear afiliado" }, { status: 500 });
  }
}
