import { z } from 'zod';

const backendErrorSchema = z.object({
  message: z.string().optional(),
  statusCode: z.number().optional(),
  data: z
    .object({
      code: z.string().optional(),
      field: z.string().optional(),
    })
    .optional(),
  // Fastify's default responder sets `error` to the status text (a string), while some nest
  // `{ message }`. Accept both so a standard Fastify body still parses.
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
export function translateBackendError(
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

/** Parse a response body as the backend error shape, tolerating non-JSON (returns null). */
export async function safeJson(
  response: Response,
): Promise<z.infer<typeof backendErrorSchema> | null> {
  try {
    const parsed = backendErrorSchema.safeParse(await response.json());
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
