/** Async codegen tool: POST + SSE GET, buffered into `{ threadId, files, explanation }`. */
import { createParser, type EventSourceMessage } from 'eventsource-parser';
import { z } from 'zod';
import type { ToolOverrides } from './types';
import { wrapTool } from './utils';

export const CODEGEN_GENERATE_PATH = '/v1/codegen/generate';
export const codegenRunPath = (runId: string): string =>
  `/v1/codegen/runs/${encodeURIComponent(runId)}`;

const designContextSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('figma'),
    nodeId: z.string().min(1).optional(),
    fileUrl: z.string().optional(),
    thumbnailDataUrl: z.string().optional(),
    variables: z.unknown().optional(),
    node: z.unknown().optional(),
  }),
  z.object({
    type: z.literal('opaque'),
    payload: z.unknown().optional(),
  }),
]);

// Mirror of the backend's `MuiPairing`. Self-contained on purpose so this package can move
// to mui-x cleanly. Sync with `apps/recipes-backend/src/services/mui-versioning/mui-pairing.ts`.
const muiPairingSchema = z.object({
  material: z
    .enum(['v5', 'v6', 'v7', 'v9'])
    .describe('Material UI major version. v8 was skipped; valid values are v5, v6, v7, v9.'),
  muiX: z.enum(['v5', 'v6', 'v7', 'v8', 'v9']).describe('MUI X products major version.'),
});

// Loose schema for the pairing the backend echoes back: plain strings tolerate a future major the
// request enum doesn't list yet, so it can't reject an already-accepted generation.
const muiPairingResponseSchema = z.object({
  material: z.string(),
  muiX: z.string(),
});

const inputSchema = z.object({
  prompt: z.string().min(1).describe('Natural-language brief for the codegen run.'),
  threadId: z
    .string()
    .min(1)
    .optional()
    .describe(
      'Continue an existing conversation. Must be owned by the caller. Omit to start a new thread.',
    ),
  designContext: designContextSchema
    .optional()
    .describe(
      'Design tool context. Use the `figma` variant when the host has a Figma frame in scope; `opaque` is the escape hatch for other tools (Penpot, Sketch, screenshots).',
    ),
  muiPairing: muiPairingSchema
    .optional()
    .describe(
      "Target MUI / MUI X version pairing. Detect from the project's `package.json` (`@mui/material` and `@mui/x-data-grid` ranges) and pass accordingly. Omit to default to the latest stable pairing (currently Material UI v9 + MUI X v9).",
    ),
  model: z.string().optional().describe('Optional model override; otherwise the backend default.'),
});

const outputSchema = z.object({
  threadId: z.string(),
  files: z.array(
    z.object({
      filename: z.string(),
      contents: z.string(),
    }),
  ),
  explanation: z.string(),
  // Effective MUI / MUI X pairing applied by the backend (echoes the request, the locked
  // thread pairing, or the resolver's default). Surfaced in the footer for the user / agent.
  muiPairing: muiPairingResponseSchema.optional(),
});

const generateResponseSchema = z.object({
  threadId: z.string(),
  runId: z.string(),
  muiPairing: muiPairingResponseSchema.optional(),
});

const backendErrorSchema = z.object({
  message: z.string().optional(),
  statusCode: z.number().optional(),
  data: z
    .object({
      code: z.string().optional(),
      field: z.string().optional(),
    })
    .optional(),
  // Fastify's default error responder sets `error` to the status text (a string, e.g. "Not Found"),
  // while some custom responders nest `{ message }`. Accept both so a standard Fastify body still
  // parses and its top-level `message` survives instead of falling back to the generic text.
  error: z
    .union([
      z.string(),
      z.object({
        message: z.string().optional(),
        statusCode: z.number().optional(),
      }),
    ])
    .optional(),
});

/** Translate recipes-backend error responses into agent-friendly text. */
function translateBackendError(
  status: number,
  body: z.infer<typeof backendErrorSchema> | null,
): string {
  const code = body?.data?.code;
  if (status === 402 || code === 'billing_failed') {
    return 'Out of credits. Upgrade at console.mui.com or wait for the allowance to reset.';
  }
  if (code === 'thread_not_owned') {
    return 'That `threadId` belongs to another user. Start a new chat (omit `threadId`) or pass a `threadId` you own.';
  }
  if (code === 'token_scope_not_allowed') {
    return 'This API key is not authorized for codegen. Recreate the key under the recipes / codegen scope at console.mui.com/products/recipes/api-keys.';
  }
  if (code === 'thread_not_found') {
    return 'Thread not found. The id may not exist, may belong to a different user, or may have been deleted.';
  }
  if (code === 'run_not_found') {
    return 'Run not found. The id may not exist, may belong to a different user, or may not be a codegen run.';
  }
  if (code === 'codegen_stream_not_found') {
    return 'Run state is no longer available. Re-issue the request to start a new run.';
  }
  if (status === 413 || code === 'design_context_too_large') {
    const field = body?.data?.field;
    return `The design payload is too large${field ? ` (\`${field}\`)` : ''} (256 KB per field cap). Send a smaller subtree or drop variables.`;
  }
  if (status === 429 || code === 'thread_already_streaming') {
    return 'Another generation is already in flight on this thread. Retry in a moment.';
  }
  if (status === 401) {
    return 'JWT rejected by recipes-backend. The token may have expired mid-run; retry.';
  }
  const nestedError = typeof body?.error === 'object' ? body.error.message : undefined;
  const detail = body?.message ?? nestedError;
  if (status >= 500) {
    return detail
      ? `Backend error (HTTP ${status}): ${detail}. Retry shortly.`
      : `Backend error (HTTP ${status}). Retry shortly.`;
  }
  return detail ?? `Backend rejected the request (HTTP ${status}).`;
}

export type CreateGenerateReactCodeToolOptions = {
  /** Base URL of recipes-backend (no trailing slash). */
  recipesBackendBaseUrl: string;
  // Returns a Bearer JWT; called once per tool invocation. Usually a `CliJwtClient`.
  getToken: () => Promise<string>;
  /** Called after a 401 so the next call mints a fresh JWT (clock skew, key rotation, revocation). */
  invalidateToken?: () => void;
  // Fires as the buffered SSE stream advances. Hosts translate these into MCP
  // `notifications/progress` so the agent UI shows progress while the wrapper is still
  // buffering. No-op if not provided. Total file count is unknown until completion.
  onProgress?: (event: CodegenProgressEvent) => void | Promise<void>;
  // Silent by default. Host wires a logger to surface swallowed `onProgress` failures.
  logger?: (message: string, error?: unknown) => void;
  /** Override `globalThis.fetch`. Useful for tests. */
  fetcher?: typeof fetch;
  // Abort signal from the host (e.g. the MCP request). When it fires, the in-flight POST and SSE
  // fetches are cancelled so the server stops streaming and the backend can stop the run.
  signal?: AbortSignal;
  /** Override the tool's name / description (e.g. when restraining the agent's tool selection). */
  overrides?: ToolOverrides;
};

export type CodegenProgressEvent =
  | { kind: 'file'; filename: string; filesSeen: number }
  | { kind: 'done'; filesSeen: number };

// From the response schema, so the footer renders whatever effective pairing the backend returns.
type MuiPairing = z.infer<typeof muiPairingResponseSchema>;

/** Serialize a codegen result into MCP text content: explanation + fenced files + threadId footer. */
export function formatCodegenText(result: {
  threadId: string;
  explanation: string;
  files: { filename: string; contents: string }[];
  muiPairing?: MuiPairing;
}): string {
  const parts: string[] = [];
  if (result.explanation?.trim()) {
    parts.push(result.explanation.trim());
  }
  for (const file of result.files) {
    const lang = file.filename.split('.').pop() ?? '';
    // Pick a fence longer than any backtick run in the file (MDX, README, code-sample literals),
    // otherwise the closing fence collides with embedded backticks and truncates the file.
    const longest = Math.max(0, ...(file.contents.match(/`+/g) ?? []).map((m) => m.length));
    const fence = '`'.repeat(Math.max(3, longest + 1));
    parts.push(`### ${file.filename}\n\n${fence}${lang}\n${file.contents}\n${fence}`);
  }
  const body = parts.join('\n\n') || 'Generated code.';
  // Footer so clients reading only `content` (not `structuredContent`) can still echo the
  // threadId on the next call. Pairing line, when present, tells the user what was targeted.
  const pairingLine = result.muiPairing
    ? `\nmuiPairing: \`${result.muiPairing.material}\` + \`${result.muiPairing.muiX}\` (effective targeting)`
    : '';
  return `${body}\n\n---\nthreadId: \`${result.threadId}\` (pass on follow-up calls to continue this conversation).${pairingLine}`;
}

export function createGenerateReactCodeTool(options: CreateGenerateReactCodeToolOptions) {
  const recipesBackendBaseUrl = options.recipesBackendBaseUrl.replace(/\/+$/, '');
  const fetcher = options.fetcher ?? globalThis.fetch;

  return wrapTool({
    name: 'generate_react_code',
    publicName: 'generateReactCode',
    description:
      'generates React + Material UI code from a natural-language prompt (optionally grounded in a Figma frame). Returns the generated files plus a short explanation. Requires `MUI_RECIPES_API_KEY`. Pass `threadId` back on subsequent calls to keep multi-turn conversations on the same chat. Pass `muiPairing` to target a specific MUI / MUI X major.',
    ...options.overrides,
    inputSchema,
    outputSchema,
    execute: async (input) => {
      const token = await options.getToken();

      // 1. Kick off the run.
      const generateResponse = await fetcher(`${recipesBackendBaseUrl}${CODEGEN_GENERATE_PATH}`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify(input),
        signal: options.signal,
      });

      if (!generateResponse.ok) {
        if (generateResponse.status === 401) {
          options.invalidateToken?.();
        }
        const body = await safeJson(generateResponse);
        throw new Error(
          `MUI X Agent Tools: ${translateBackendError(generateResponse.status, body)}`,
        );
      }

      // Wrap raw JSON/schema parse errors (e.g. a 2xx HTML proxy page) in the prefixed message below.
      let generated: z.infer<typeof generateResponseSchema>;
      try {
        generated = generateResponseSchema.parse(await generateResponse.json());
      } catch {
        throw new Error(
          'MUI X Agent Tools: The codegen backend returned an unexpected response (not valid JSON, or missing runId). Check that MUI_RECIPES_BACKEND_BASE_URL points at recipes-backend (not a proxy or error page), then retry.',
        );
      }

      // 2. Open the SSE stream + buffer chunks until `[DONE]`.
      const streamResponse = await fetcher(
        `${recipesBackendBaseUrl}${codegenRunPath(generated.runId)}`,
        {
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`,
            accept: 'text/event-stream',
          },
          signal: options.signal,
        },
      );

      if (!streamResponse.ok) {
        if (streamResponse.status === 401) {
          options.invalidateToken?.();
        }
        const body = await safeJson(streamResponse);
        throw new Error(`MUI X Agent Tools: ${translateBackendError(streamResponse.status, body)}`);
      }

      const { files, explanation } = await consumeCodegenStream(
        streamResponse,
        options.onProgress,
        options.logger,
      );
      return {
        threadId: generated.threadId,
        files,
        explanation,
        ...(generated.muiPairing && { muiPairing: generated.muiPairing }),
      };
    },
  });
}

// Buffer the SSE stream. Handles both server-shape and client-shape chunks; both end with `[DONE]`.
async function consumeCodegenStream(
  response: Response,
  onProgress?: (event: CodegenProgressEvent) => void | Promise<void>,
  logger?: (message: string, error?: unknown) => void,
): Promise<{
  files: { filename: string; contents: string }[];
  explanation: string;
}> {
  if (!response.body) {
    throw new Error(
      'MUI X Agent Tools: Backend returned an SSE response with no body, so the generation stream cannot be read. Check that MUI_RECIPES_BACKEND_BASE_URL points at recipes-backend (not a proxy or error page), then retry.',
    );
  }

  const files = new Map<string, string>(); // last-write-wins for a given filename
  const explanationParts: string[] = [];

  // Progress events chained for serial in-order delivery. Drained before resolve so the
  // tool result never arrives before the final `Generation complete` notification.
  let progressChain: Promise<void> = Promise.resolve();
  const fireProgress = (event: CodegenProgressEvent): void => {
    if (!onProgress) {
      return;
    }
    progressChain = progressChain.then(async () => {
      try {
        await onProgress(event);
      } catch (err) {
        // UX-only; never fail the run on a host bug. Surface via logger if the host wants it.
        logger?.('codegen.onProgress hook failed', err);
      }
    });
  };
  const drainProgress = (): Promise<void> => progressChain;

  await new Promise<void>((resolve, reject) => {
    let finished = false;
    const parser = createParser({
      onEvent: (event: EventSourceMessage) => {
        if (finished) {
          return;
        }
        const raw = event.data;
        if (raw === undefined) {
          return;
        }

        // Producer emits `[DONE]` as a literal token, JSON-encoded or not.
        if (raw === '[DONE]' || raw === '"[DONE]"') {
          finished = true;
          fireProgress({ kind: 'done', filesSeen: files.size });
          // Drain queued progress before resolving so the final notification lands first.
          void drainProgress().then(resolve);
          return;
        }

        let chunk: unknown;
        try {
          chunk = JSON.parse(raw);
        } catch {
          // Producer emits JSON chunks only; ignore anything that isn't parseable.
          return;
        }

        const outcome = handleCodegenChunk(chunk, files, explanationParts);
        if (outcome.kind === 'error') {
          if (finished) {
            return;
          }
          finished = true;
          reject(new Error(`MUI X Agent Tools: ${outcome.message}`));
          return;
        }
        if (outcome.kind === 'file') {
          // Emit progress AFTER the Map is updated so `filesSeen` reflects the unique count.
          fireProgress({ kind: 'file', filename: outcome.filename, filesSeen: files.size });
        }
      },
    });

    void pumpStream(response.body!, parser, (err) => {
      if (finished) {
        return;
      }
      finished = true;
      if (err) {
        reject(new Error(`MUI X Agent Tools: SSE stream errored: ${err.message}`));
      } else {
        // Stream closed without `[DONE]`: treat as truncated so the agent retries.
        reject(
          new Error(
            'MUI X Agent Tools: Generation stream ended unexpectedly before `[DONE]`. Retry the request.',
          ),
        );
      }
    });
  });

  return {
    files: Array.from(files.entries()).map(([filename, contents]) => ({ filename, contents })),
    explanation: explanationParts.join(''),
  };
}

type CodegenChunk = {
  type?: unknown;
  text?: unknown;
  textDelta?: unknown;
  delta?: unknown;
  content?: unknown;
  fileName?: unknown;
  filename?: unknown;
  contents?: unknown;
  error?: unknown;
};

type ChunkOutcome =
  | { kind: 'file'; filename: string }
  | { kind: 'error'; message: string }
  | { kind: 'noop' };

function handleCodegenChunk(
  chunk: unknown,
  files: Map<string, string>,
  explanationParts: string[],
): ChunkOutcome {
  if (!chunk || typeof chunk !== 'object') {
    return { kind: 'noop' };
  }
  const c = chunk as CodegenChunk;
  const type = typeof c.type === 'string' ? c.type : undefined;

  if (!type) {
    return { kind: 'noop' };
  }

  if (type === 'file-update') {
    const filename =
      (typeof c.fileName === 'string' && c.fileName) ||
      (typeof c.filename === 'string' && c.filename) ||
      '';
    const contents = typeof c.contents === 'string' ? c.contents : '';
    if (filename) {
      files.set(filename, contents);
      return { kind: 'file', filename };
    }
    return { kind: 'noop' };
  }

  // Skip `reasoning` chunks (model chain-of-thought is not part of the user-facing reply).
  if (type === 'text-delta' || type === 'body' || type === 'text') {
    const text =
      (typeof c.textDelta === 'string' && c.textDelta) ||
      (typeof c.text === 'string' && c.text) ||
      (typeof c.delta === 'string' && c.delta) ||
      (typeof c.content === 'string' && c.content) ||
      '';
    if (text) {
      explanationParts.push(text);
    }
    return { kind: 'noop' };
  }

  if (type === 'error') {
    const message =
      (typeof c.error === 'string' && c.error) ||
      (typeof c.text === 'string' && c.text) ||
      'Generation failed.';
    return { kind: 'error', message: `Generation failed: ${message}` };
  }
  // Other chunk types (finish, tool-call, tool-result, source, etc.) are intentionally
  // not surfaced in the tool result; the agent only needs files + explanation.
  return { kind: 'noop' };
}

async function pumpStream(
  body: ReadableStream<Uint8Array>,
  parser: ReturnType<typeof createParser>,
  onDone: (err?: Error) => void,
): Promise<void> {
  const decoder = new TextDecoder();
  try {
    // ReadableStream is async-iterable in Node >=18; this loop is sequential by design
    // (the next chunk depends on the current one finishing; streams aren't parallelizable).
    for await (const value of body as unknown as AsyncIterable<Uint8Array>) {
      parser.feed(decoder.decode(value, { stream: true }));
    }
    onDone();
  } catch (err) {
    // Fallback wrap for a non-Error rejection; the message is dynamic (not a literal), so it can't
    // be minified into an error code.
    onDone(err instanceof Error ? err : /* minify-error-disabled */ new Error(String(err)));
  }
}

async function safeJson(response: Response): Promise<z.infer<typeof backendErrorSchema> | null> {
  try {
    const parsed = backendErrorSchema.safeParse(await response.json());
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
