// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// WARNING: THIS IS A TEMPORARY FIX FOR SUBMISSION ONLY.
// In a real application, you should always use environment variables.
const connectionString = "postgresql://postgres:Pradipth241@db.qygxhkjczlrnzkvewmlw.supabase.co:5432/postgres";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient({
    datasources: {
        db: {
            url: connectionString,
        },
    },
});

if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;