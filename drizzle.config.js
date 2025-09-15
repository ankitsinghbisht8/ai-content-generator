import 'dotenv/config';
/** @type { import("drizzle-kit").Config } */
export default {
  schema: ["./utils/schema.ts", "./utils/schema.tsx"],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DRIZZLE_DB_URL,
  }
};