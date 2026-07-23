import { describe, expect, it } from "vitest"

import { requireDatabaseUrl, requireMigrationDatabaseUrl } from "@/db/env"

describe("database environment", () => {
  it("returns the application database URL", () => {
    expect(
      requireDatabaseUrl({ DATABASE_URL: "postgresql://example/app" })
    ).toBe("postgresql://example/app")
  })

  it("rejects a missing application database URL", () => {
    expect(() => requireDatabaseUrl({})).toThrow(
      "DATABASE_URL is required to connect to Neon"
    )
  })

  it("prefers the unpooled URL for migrations", () => {
    expect(
      requireMigrationDatabaseUrl({
        DATABASE_URL: "postgresql://example/pooled",
        DATABASE_URL_UNPOOLED: "postgresql://example/direct",
      })
    ).toBe(
      "postgresql://example/direct?sslmode=verify-full&channel_binding=require"
    )
  })

  it("falls back to the application URL for migrations", () => {
    expect(
      requireMigrationDatabaseUrl({
        DATABASE_URL: "postgresql://example/pooled",
      })
    ).toBe(
      "postgresql://example/pooled?sslmode=verify-full&channel_binding=require"
    )
  })

  it("replaces weaker migration TLS settings", () => {
    expect(
      requireMigrationDatabaseUrl({
        DATABASE_URL_UNPOOLED:
          "postgresql://example/direct?sslmode=require&channel_binding=prefer",
      })
    ).toBe(
      "postgresql://example/direct?sslmode=verify-full&channel_binding=require"
    )
  })

  it("rejects non-PostgreSQL migration URLs", () => {
    expect(() =>
      requireMigrationDatabaseUrl({
        DATABASE_URL_UNPOOLED: "https://example.test/database",
      })
    ).toThrow("Database connection URL must use postgres:// or postgresql://")
  })

  it("rejects malformed migration URLs without exposing their value", () => {
    expect(() =>
      requireMigrationDatabaseUrl({
        DATABASE_URL_UNPOOLED: "not-a-database-url",
      })
    ).toThrow("Database connection URL must be a valid PostgreSQL URL")
  })
})
