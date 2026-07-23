import "server-only"

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import { requireDatabaseUrl } from "@/db/env"

import * as schema from "./schema"

const sql = neon(requireDatabaseUrl())

export const db = drizzle({
  client: sql,
})

export { schema }
