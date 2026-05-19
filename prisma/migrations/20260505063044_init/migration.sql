-- CreateTable
CREATE TABLE "Afiliado" (
    "id" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "codigoJAC" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "barrio" TEXT,
    "cargo" TEXT NOT NULL DEFAULT 'Comunero',
    "foto" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaIngreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vigenciaHasta" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Afiliado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfiguracionJAC" (
    "id" TEXT NOT NULL,
    "nombreJAC" TEXT NOT NULL DEFAULT 'Junta de Acción Comunal',
    "municipio" TEXT NOT NULL DEFAULT 'Garzón',
    "departamento" TEXT NOT NULL DEFAULT 'Huila',
    "logo" TEXT,
    "valorCuotaMes" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "presidente" TEXT,
    "nit" TEXT,
    "resolucion" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfiguracionJAC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cuota" (
    "id" TEXT NOT NULL,
    "afiliadoId" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "pagado" BOOLEAN NOT NULL DEFAULT false,
    "fechaPago" TIMESTAMP(3),
    "comprobante" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cuota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acta" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "tipo" TEXT NOT NULL,
    "lugar" TEXT NOT NULL,
    "asistentes" INTEGER NOT NULL,
    "orden" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "aprobada" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Acta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proyecto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'PLANEACION',
    "presupuesto" DOUBLE PRECISION,
    "ejecutado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "inicio" TIMESTAMP(3),
    "fin" TIMESTAMP(3),
    "responsable" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaccion" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoria" TEXT,
    "comprobante" TEXT,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comunicado" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'GENERAL',
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "fechaPublic" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comunicado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL,
    "horaInicio" TEXT,
    "horaFin" TEXT,
    "lugar" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'REUNION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Afiliado_cedula_key" ON "Afiliado"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Afiliado_codigoJAC_key" ON "Afiliado"("codigoJAC");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- AddForeignKey
ALTER TABLE "Cuota" ADD CONSTRAINT "Cuota_afiliadoId_fkey" FOREIGN KEY ("afiliadoId") REFERENCES "Afiliado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
