// Graceful Prisma client with fallback
let PrismaClient: any;
let prismaInstance: any;

try {
  // Try to import Prisma client
  const prismaModule = require('@prisma/client');
  PrismaClient = prismaModule.PrismaClient;

  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined
  }

  prismaInstance = globalForPrisma.prisma ?? new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || "file:./dev.db"
      }
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
} catch (error) {
  console.warn('Prisma client not available, using fallback');
  // Create a mock Prisma client that will trigger client-side storage
  prismaInstance = {
    moodEntry: {
      findMany: () => Promise.reject(new Error('Database not available')),
      create: () => Promise.reject(new Error('Database not available'))
    },
    $queryRaw: () => Promise.reject(new Error('Database not available'))
  };
}

export const prisma = prismaInstance;
