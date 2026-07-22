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
    ).toBe("postgresql://example/direct")
  })

  it("falls back to the application URL for migrations", () => {
    expect(
      requireMigrationDatabaseUrl({
        DATABASE_URL: "postgresql://example/pooled",
      })
    ).toBe("postgresql://example/pooled")
  })
})
