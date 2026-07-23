type DatabaseEnvironment = Readonly<Record<string, string | undefined>>

function securePostgresUrl(databaseUrl: string) {
  let url: URL

  try {
    url = new URL(databaseUrl)
  } catch {
    throw new Error("Database connection URL must be a valid PostgreSQL URL")
  }

  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error(
      "Database connection URL must use postgres:// or postgresql://"
    )
  }

  url.searchParams.set("sslmode", "verify-full")
  url.searchParams.set("channel_binding", "require")

  return url.toString()
}

export function requireDatabaseUrl(
  environment: DatabaseEnvironment = process.env
) {
  const databaseUrl = environment.DATABASE_URL?.trim()

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to connect to Neon")
  }

  return databaseUrl
}

export function requireMigrationDatabaseUrl(
  environment: DatabaseEnvironment = process.env
) {
  const databaseUrl =
    environment.DATABASE_URL_UNPOOLED?.trim() || requireDatabaseUrl(environment)

  return securePostgresUrl(databaseUrl)
}
