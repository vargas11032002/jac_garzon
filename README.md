# 🏘️ SistemaJAC — Garzón, Huila

Sistema de Gestión para Juntas de Acción Comunal de Garzón, Huila.
Desarrollado por **JAV Dev Group**.

---

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Base de datos | PostgreSQL + Prisma ORM |
| Autenticación | NextAuth.js (por configurar) |
| Despliegue | Vercel + Supabase / Railway |

---

## 📦 Módulos del Sistema

### 1. 👥 Afiliados
- Registro de comuneros con cédula, contacto, dirección, barrio
- Estado de membresía (activo/inactivo)
- Control de cuotas por mes/año

### 2. 📄 Actas Digitales
- Creación y archivo de actas (ordinarias y extraordinarias)
- Orden del día, asistentes, contenido
- Control de aprobación

### 3. 🏗️ Proyectos
- Seguimiento de obras e iniciativas
- Estados: Planeación → En Ejecución → Completado
- Presupuesto vs ejecutado

### 4. 💰 Tesorería
- Registro de ingresos y egresos
- Cuotas pendientes por comunero
- Informes financieros

### 5. 📢 Comunicados
- Creación de avisos, noticias y citaciones
- Tipos: General, Urgente, Citación

### 6. 📅 Calendario
- Reuniones, eventos y fechas importantes
- Vista mensual interactiva

---

## ⚙️ Instalación Local

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd jac-garzon

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de BD

# 4. Inicializar base de datos
npx prisma migrate dev --name init
npx prisma generate

# 5. Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Base de Datos

### Modelos principales:
- `Afiliado` — comuneros registrados
- `Cuota` — pagos mensuales por afiliado
- `Acta` — reuniones archivadas
- `Proyecto` — obras e iniciativas
- `Transaccion` — movimientos de tesorería
- `Comunicado` — avisos y noticias
- `Evento` — calendario de actividades

---

## 🗺️ Roadmap

- [x] Estructura base del proyecto
- [x] Diseño del sistema de navegación
- [x] Esquema de base de datos (Prisma)
- [x] Páginas de todos los módulos
- [ ] CRUD Afiliados con formularios
- [ ] CRUD Actas con editor de texto
- [ ] CRUD Proyectos con barra de progreso
- [ ] CRUD Tesorería con gráficas (Recharts)
- [ ] CRUD Comunicados
- [ ] Calendario interactivo completo
- [ ] Sistema de autenticación (NextAuth)
- [ ] Generación de informes PDF
- [ ] Notificaciones por WhatsApp/SMS

---

## 👨‍💻 Desarrollado por

**JAV Dev Group** — [jav-dev-group.vercel.app](https://jav-dev-group.vercel.app)
