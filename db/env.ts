type DatabaseEnvironment = Readonly<Record<string, string | undefined>>

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
  return (
    environment.DATABASE_URL_UNPOOLED?.trim() || requireDatabaseUrl(environment)
  )
}
