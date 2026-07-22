import { loadEnvConfig } from "@next/env"
import { defineConfig } from "drizzle-kit"

import { requireMigrationDatabaseUrl } from "./db/env"

loadEnvConfig(process.cwd())

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: requireMigrationDatabaseUrl(),
  },
})
