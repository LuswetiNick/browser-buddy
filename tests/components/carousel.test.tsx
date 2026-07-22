import { act, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const embla = vi.hoisted(() => {
  const listeners = new Map<string, Set<() => void>>()
  const state = {
    canScrollNext: true,
    canScrollPrev: false,
  }
  const api = {
    canScrollNext: vi.fn(() => state.canScrollNext),
    canScrollPrev: vi.fn(() => state.canScrollPrev),
    off: vi.fn((event: string, listener: () => void) => {
      listeners.get(event)?.delete(listener)
      return api
    }),
    on: vi.fn((event: string, listener: () => void) => {
      const eventListeners = listeners.get(event) ?? new Set()
      eventListeners.add(listener)
      listeners.set(event, eventListeners)
      return api
    }),
    scrollNext: vi.fn(),
    scrollPrev: vi.fn(),
  }

  return {
    api,
    emit(event: string) {
      listeners.get(event)?.forEach((listener) => listener())
    },
    state,
  }
})

vi.mock("embla-carousel-react", () => ({
  default: () => [vi.fn(), embla.api],
}))

describe("Carousel", () => {
  it("tracks navigation availability from Embla selection events", () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )

    const previous = screen.getByRole("button", { name: "Previous slide" })
    const next = screen.getByRole("button", { name: "Next slide" })

    expect(previous).toBeDisabled()
    expect(next).toBeEnabled()

    act(() => {
      embla.state.canScrollPrev = true
      embla.state.canScrollNext = false
      embla.emit("select")
    })

    expect(previous).toBeEnabled()
    expect(next).toBeDisabled()
  })
})
