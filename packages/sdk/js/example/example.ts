import { createOpencodeClient } from "@opencode-ai/sdk"
import { pathToFileURL } from "bun"

// In this build, opencode serve is not started by the SDK. Use createOpencodeClient with baseUrl
// of an existing server, or run opencode serve separately.
const client = createOpencodeClient({ baseUrl: "http://127.0.0.1:4096" })

const input = await Array.fromAsync(new Bun.Glob("packages/core/*.ts").scan())

const tasks: Promise<void>[] = []
for await (const file of input) {
  console.log("processing", file)
  const session = await client.session.create()
  tasks.push(
    client.session.prompt({
      path: { id: session.data.id },
      body: {
        parts: [
          {
            type: "file",
            mime: "text/plain",
            url: pathToFileURL(file).href,
          },
          {
            type: "text",
            text: `Write tests for every public function in this file.`,
          },
        ],
      },
    }),
  )
  console.log("done", file)
}

await Promise.all(
  input.map(async (file) => {
    const session = await client.session.create()
    console.log("processing", file)
    await client.session.prompt({
      path: { id: session.data.id },
      body: {
        parts: [
          {
            type: "file",
            mime: "text/plain",
            url: pathToFileURL(file).href,
          },
          {
            type: "text",
            text: `Write tests for every public function in this file.`,
          },
        ],
      },
    })
    console.log("done", file)
  }),
)
