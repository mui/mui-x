/** Async codegen tool: POST + SSE GET, buffered into `{ threadId, files, explanation }`. */
import { z } from 'zod';
import type { Logger, ToolOverrides } from '../types';
import { createAuthedFetch } from '../auth/authed-fetch';
import { wrapTool } from '../utils/wrap-tool';
import { generateResponseSchema, inputSchema, outputSchema, type MuiPairing } from './schemas';
import { safeJson, translateBackendError } from './errors';
import { consumeCodegenStream, type CodegenProgressEvent } from './stream';

export const CODEGEN_GENERATE_PATH = '/v1/codegen/generate';
export const codegenRunPath = (runId: string): string =>
  `/v1/codegen/runs/${encodeURIComponent(runId)}`;

export type CreateGenerateReactCodeToolOptions = {
  /** Base URL of recipes-backend (no trailing slash). */
  recipesBackendBaseUrl: string;
  /**
   * Returns a Bearer JWT, once per call. Usually an `ApiKeyJwtClient`. Gets the request signal so
   * a slow token exchange is aborted with the codegen fetches.
   * @param {object} [options] Per-call options.
   * @param {AbortSignal} [options.signal] Drops this caller's wait when the request is cancelled.
   * @returns {Promise<string>} The Bearer JWT to send.
   */
  getToken: (options?: { signal?: AbortSignal }) => Promise<string>;
  /** Called after a 401 so the next call mints a fresh JWT (clock skew, key rotation, revocation). */
  invalidateToken?: () => void;
  /** Silent by default. Host wires a logger to surface swallowed `onProgress` failures. */
  logger?: Logger;
  /** Override `globalThis.fetch`. Useful for tests. */
  fetcher?: typeof fetch;
  /** Override the tool's name / description (e.g. when restraining the agent's tool selection). */
  overrides?: ToolOverrides;
};

/** Render a codegen result as markdown: explanation + fenced files + threadId footer. */
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
    // Use a fence longer than any backtick run in the file, or the closing fence collides with
    // embedded backticks and cuts the file off.
    const longest = Math.max(0, ...(file.contents.match(/`+/g) ?? []).map((m) => m.length));
    const fence = '`'.repeat(Math.max(3, longest + 1));
    parts.push(`### ${file.filename}\n\n${fence}${lang}\n${file.contents}\n${fence}`);
  }
  const body = parts.join('\n\n') || 'Generated code.';
  // Footer so clients reading only `content` can still echo the threadId next call; the pairing
  // line tells the user what was targeted.
  const pairingLine = result.muiPairing
    ? `\nmuiPairing: \`${result.muiPairing.material}\` + \`${result.muiPairing.muiX}\` (effective targeting)`
    : '';
  return `${body}\n\n---\nthreadId: \`${result.threadId}\` (pass on follow-up calls to continue this conversation).${pairingLine}`;
}

export function createGenerateReactCodeTool(options: CreateGenerateReactCodeToolOptions) {
  const recipesBackendBaseUrl = options.recipesBackendBaseUrl.replace(/\/+$/, '');
  const fetcher = options.fetcher ?? globalThis.fetch;

  return wrapTool<typeof inputSchema, typeof outputSchema, CodegenProgressEvent>({
    name: 'generateReactCode',
    description:
      'generates React + Material UI code from a natural-language prompt (optionally grounded in a Figma frame). Returns the generated files plus a short explanation. Requires `MUI_RECIPES_API_KEY`. Pass `threadId` back on subsequent calls to keep multi-turn conversations on the same chat. Pass `muiPairing` to target a specific MUI / MUI X major.',
    ...options.overrides,
    inputSchema,
    outputSchema,
    execute: async (input, context) => {
      const signal = context?.signal;
      const authedFetch = createAuthedFetch({
        fetcher,
        getToken: options.getToken,
        invalidateToken: options.invalidateToken,
        signal,
      });

      // 1. Kick off the run.
      const generateResponse = await authedFetch(
        `${recipesBackendBaseUrl}${CODEGEN_GENERATE_PATH}`,
        (token) => ({
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
            'content-type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify(input),
          // Fail on redirects so the Bearer token can't be resent to another origin.
          redirect: 'error',
          signal,
        }),
      );

      if (!generateResponse.ok) {
        const body = await safeJson(generateResponse);
        throw new Error(
          `MUI X Agent Tools: ${translateBackendError(generateResponse.status, body)}`,
        );
      }

      // Wrap raw JSON/schema parse errors (e.g. a 2xx HTML proxy page) in the prefixed message below.
      let generated: z.infer<typeof generateResponseSchema>;
      try {
        generated = generateResponseSchema.parse(await generateResponse.json());
      } catch (error) {
        // A cancellation during the body read rejects with AbortError from the same signal;
        // let it through so hosts detect cancellation, not a fake "unexpected response".
        if (error instanceof Error && error.name === 'AbortError') {
          throw error;
        }
        throw new Error(
          'MUI X Agent Tools: The codegen backend returned an unexpected response (not valid JSON, or missing runId). Check that MUI_RECIPES_BACKEND_BASE_URL points at recipes-backend (not a proxy or error page), then retry.',
        );
      }

      // 2. Open the SSE stream + buffer chunks until `[DONE]`.
      const streamResponse = await authedFetch(
        `${recipesBackendBaseUrl}${codegenRunPath(generated.runId)}`,
        (token) => ({
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`,
            accept: 'text/event-stream',
          },
          redirect: 'error',
          signal,
        }),
      );

      if (!streamResponse.ok) {
        const body = await safeJson(streamResponse);
        throw new Error(`MUI X Agent Tools: ${translateBackendError(streamResponse.status, body)}`);
      }

      const { files, explanation } = await consumeCodegenStream(
        streamResponse,
        context?.onProgress,
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

/** The `generateReactCode` tool, as returned by `createGenerateReactCodeTool`. */
export type GenerateReactCodeTool = ReturnType<typeof createGenerateReactCodeTool>;

// Re-export the public codegen types so the barrel only needs this module.
export type { GenerateReactCodeResult } from './schemas';
export type { CodegenProgressEvent };
