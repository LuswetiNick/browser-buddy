import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

import { requireMigrationDatabaseUrl } from "./db/env"

// Neon connection strings live in .env.local (Next.js convention).
config({ path: ".env.local", quiet: true })

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dbCredentials: {
    url: requireMigrationDatabaseUrl(),
  },
})
