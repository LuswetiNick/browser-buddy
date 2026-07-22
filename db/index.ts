import "server-only"

import { attachDatabasePool } from "@vercel/functions"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import { requireDatabaseUrl } from "@/db/env"

const pool = new Pool({
  connectionString: requireDatabaseUrl(),
  max: 5,
})

attachDatabasePool(pool)

export const db = drizzle({ client: pool })
