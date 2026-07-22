import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useIsMobile } from "@/hooks/use-mobile"

describe("useIsMobile", () => {
  let matches: boolean
  let listeners: Set<() => void>

  beforeEach(() => {
    matches = false
    listeners = new Set()

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({
        addEventListener: (_event: string, listener: () => void) => {
          listeners.add(listener)
        },
        get matches() {
          return matches
        },
        media: "(max-width: 767px)",
        removeEventListener: (_event: string, listener: () => void) => {
          listeners.delete(listener)
        },
      })),
    })
  })

  it("updates when the viewport crosses the mobile breakpoint", () => {
    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)

    act(() => {
      matches = true
      listeners.forEach((listener) => listener())
    })

    expect(result.current).toBe(true)
  })
})
