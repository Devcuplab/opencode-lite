import { spawn } from "node:child_process"
import { type Config } from "./gen/types.gen.js"

export type ServerOptions = {
  hostname?: string
  port?: number
  signal?: AbortSignal
  timeout?: number
  config?: Config
}

export type TuiOptions = {
  project?: string
  model?: string
  session?: string
  agent?: string
  signal?: AbortSignal
  config?: Config
}

/**
 * Starting the opencode server from the SDK is not supported in this build.
 * Use createOpencodeClient({ baseUrl }) and run opencode serve separately if you need a server.
 */
export function createOpencodeServer(_options?: ServerOptions): Promise<{ url: string; close(): void }> {
  return Promise.reject(
    new Error(
      "opencode serve is not available in this build. Use createOpencodeClient({ baseUrl }) with an existing server.",
    ),
  )
}

export function createOpencodeTui(options?: TuiOptions) {
  const args = []

  if (options?.project) {
    args.push(`--project=${options.project}`)
  }
  if (options?.model) {
    args.push(`--model=${options.model}`)
  }
  if (options?.session) {
    args.push(`--session=${options.session}`)
  }
  if (options?.agent) {
    args.push(`--agent=${options.agent}`)
  }

  const proc = spawn(`opencode`, args, {
    signal: options?.signal,
    stdio: "inherit",
    env: {
      ...process.env,
      OPENCODE_CONFIG_CONTENT: JSON.stringify(options?.config ?? {}),
    },
  })

  return {
    close() {
      proc.kill()
    },
  }
}
