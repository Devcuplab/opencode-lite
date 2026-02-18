import { Hono } from "hono"

/**
 * Server is stubbed in this build. Use the CLI only; opencode serve is not available.
 */
export namespace Server {
  const DEFAULT_URL = "http://localhost:4096"

  export function url(): URL {
    return new URL(DEFAULT_URL)
  }

  const app = new Hono().all("*", (c) =>
    c.json({ error: "opencode serve is not available in this build" }, 503),
  )

  export function App(): Hono {
    return app
  }

  export function listen(): never {
    throw new Error("opencode serve is not available in this build")
  }
}
