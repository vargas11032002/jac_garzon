import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as any;

function createPrisma() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require("../../node_modules/.prisma/client/default.js");
  const pool = new Pool({
    connectionString: "postgresql://postgres:2112@localhost:5432/jac_garzon",
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;