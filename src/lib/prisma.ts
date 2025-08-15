// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// This prevents TypeScript errors when using the global object in development
declare global {
  // We use `var` here to declare a global variable that can be accessed anywhere.
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;