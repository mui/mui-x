import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { createGenerateReactCodeTool, formatCodegenText } from './codegen';

const baseUrl = 'http://localhost:5003';
const token = 'jwt-test';

function makeJsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/** Build a `text/event-stream` Response from a sequence of pre-formatted SSE frames. */
function makeSseResponse(frames: string[]): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const frame of frames) {
        controller.enqueue(encoder.encode(frame));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    status: 200,
    headers: { 'content-type': 'text/event-stream' },
  });
}

const sseFrame = (data: unknown): string =>
  `data: ${typeof data === 'string' ? data : JSON.stringify(data)}\n\n`;

describe('createGenerateReactCodeTool', () => {
  let getToken: Mock<() => Promise<string>>;

  beforeEach(() => {
    getToken = vi.fn<() => Promise<string>>().mockResolvedValue(token);
  });

  it('happy path: POST returns runId, SSE delivers files + explanation, tool returns structured result', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(
        makeSseResponse([
          sseFrame({ type: 'reasoning', text: 'thinking...' }),
          sseFrame({ type: 'body', text: "Here's a card. " }),
          sseFrame({ type: 'body', text: 'It uses MUI v7.' }),
          sseFrame({ type: 'file-update', fileName: 'App.tsx', contents: 'export default ...' }),
          sseFrame({ type: 'file-update', fileName: 'Quantity.tsx', contents: 'export ...' }),
          sseFrame({ type: 'finish', finishReason: 'stop' }),
          sseFrame('[DONE]'),
        ]),
      );

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    const result = await tool.execute({ prompt: 'Build a card' });

    expect(getToken).toHaveBeenCalledTimes(1);
    expect(result.threadId).toBe('chat-1');
    expect(result.files).toEqual([
      { filename: 'App.tsx', contents: 'export default ...' },
      { filename: 'Quantity.tsx', contents: 'export ...' },
    ]);
    expect(result.explanation).toBe("Here's a card. It uses MUI v7.");
  });

  it('passes the prompt + threadId + designContext + model body to POST', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(makeSseResponse([sseFrame('[DONE]')]));

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await tool.execute({
      prompt: 'Build a Tomato card',
      threadId: 'chat-existing',
      designContext: { type: 'figma', nodeId: '4368:321124' },
      model: 'claude-sonnet-4-6',
    });

    const [, init] = fetcher.mock.calls[0];
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    });
    expect(JSON.parse(init.body)).toEqual({
      prompt: 'Build a Tomato card',
      threadId: 'chat-existing',
      designContext: { type: 'figma', nodeId: '4368:321124' },
      model: 'claude-sonnet-4-6',
    });
  });

  it('forwards muiPairing in the POST body so the backend can target the right MUI major', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(makeSseResponse([sseFrame('[DONE]')]));

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await tool.execute({
      prompt: 'Build a v7 product card',
      muiPairing: { material: 'v7', muiX: 'v8' },
    });

    const [, init] = fetcher.mock.calls[0];
    expect(JSON.parse(init.body)).toMatchObject({
      muiPairing: { material: 'v7', muiX: 'v8' },
    });
  });

  it('plumbs the backend-resolved muiPairing from the 202 response into the tool result', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        makeJsonResponse(202, {
          threadId: 'chat-1',
          runId: 'msg-1',
          muiPairing: { material: 'v7', muiX: 'v8' },
        }),
      )
      .mockResolvedValueOnce(makeSseResponse([sseFrame('[DONE]')]));

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    const result = await tool.execute({ prompt: 'Build a v7 card' });

    expect(result.muiPairing).toEqual({ material: 'v7', muiX: 'v8' });
  });

  it('formatCodegenText renders muiPairing in the footer when the result includes it', () => {
    const text = formatCodegenText({
      threadId: 'chat-1',
      explanation: 'A card.',
      files: [],
      muiPairing: { material: 'v7', muiX: 'v8' },
    });
    expect(text).toContain('threadId: `chat-1`');
    expect(text).toContain('muiPairing: `v7` + `v8`');
  });

  it('formatCodegenText omits the muiPairing footer line when no pairing is set', () => {
    const text = formatCodegenText({
      threadId: 'chat-1',
      explanation: 'A card.',
      files: [],
    });
    expect(text).toContain('threadId: `chat-1`');
    expect(text).not.toContain('muiPairing');
  });

  it('end-to-end: tool execute → result includes the backend pairing → formatCodegenText surfaces it', async () => {
    // Locks the full wire: POST muiPairing → tool result → formatCodegenText footer line.
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        makeJsonResponse(202, {
          threadId: 'chat-1',
          runId: 'msg-1',
          muiPairing: { material: 'v7', muiX: 'v8' },
        }),
      )
      .mockResolvedValueOnce(makeSseResponse([sseFrame('[DONE]')]));

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    const result = await tool.execute({ prompt: 'p' });
    const text = formatCodegenText(result);

    expect(text).toContain('threadId: `chat-1`');
    expect(text).toContain('muiPairing: `v7` + `v8` (effective targeting)');
    // Footer order matters: threadId line before pairing line.
    expect(text.indexOf('threadId:')).toBeLessThan(text.indexOf('muiPairing:'));
  });

  it('rejects an invalid muiPairing material version (v8 was skipped) at the schema layer', () => {
    const tool = createGenerateReactCodeTool({
      recipesBackendBaseUrl: baseUrl,
      getToken,
      fetcher: vi.fn(),
    });
    // Same gate the SDK runs against inputSchema before execute; invalid majors never wire out.
    const result = tool.inputSchema.safeParse({
      prompt: 'x',
      muiPairing: { material: 'v8', muiX: 'v9' },
    });
    expect(result.success).toBe(false);
  });

  it('parses server-shape chunks (text-delta) as well as client-shape (body/reasoning)', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(
        makeSseResponse([
          sseFrame({ type: 'text-delta', textDelta: 'live ' }),
          sseFrame({ type: 'text-delta', textDelta: 'stream' }),
          sseFrame({ type: 'finish', finishReason: 'stop' }),
          sseFrame('[DONE]'),
        ]),
      );

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    const result = await tool.execute({ prompt: 'hi' });

    expect(result.explanation).toBe('live stream');
  });

  it('last-write-wins for file-update chunks with the same filename', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(
        makeSseResponse([
          sseFrame({ type: 'file-update', fileName: 'App.tsx', contents: 'v1' }),
          sseFrame({ type: 'file-update', fileName: 'App.tsx', contents: 'v2' }),
          sseFrame('[DONE]'),
        ]),
      );

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    const result = await tool.execute({ prompt: 'hi' });

    expect(result.files).toEqual([{ filename: 'App.tsx', contents: 'v2' }]);
  });

  it('rejects when the SSE stream closes without a `[DONE]` sentinel (truncated generation)', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(
        makeSseResponse([
          sseFrame({ type: 'reasoning', text: 'thinking...' }),
          sseFrame({ type: 'file-update', fileName: 'App.tsx', contents: 'partial' }),
          // Stream closes here. No `[DONE]`.
        ]),
      );

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await expect(tool.execute({ prompt: 'hi' })).rejects.toThrow(/ended unexpectedly/);
  });

  it('throws on an `error` chunk with the error text surfaced', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(
        makeSseResponse([
          sseFrame({ type: 'reasoning', text: 'thinking...' }),
          sseFrame({ type: 'error', error: 'upstream LLM exploded' }),
        ]),
      );

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await expect(tool.execute({ prompt: 'hi' })).rejects.toThrow(/upstream LLM exploded/);
  });

  it('translates 402 billing_failed into a user-friendly out-of-credits message', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(
      makeJsonResponse(402, {
        message: 'Out of credits',
        statusCode: 402,
        data: { code: 'billing_failed' },
      }),
    );

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await expect(tool.execute({ prompt: 'hi' })).rejects.toThrow(/Out of credits/);
  });

  it('translates 403 thread_not_owned', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(
      makeJsonResponse(403, {
        statusCode: 403,
        data: { code: 'thread_not_owned' },
      }),
    );

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await expect(tool.execute({ prompt: 'hi', threadId: 'chat-x' })).rejects.toThrow(
      /belongs to another user/,
    );
  });

  it('translates 413 design_context_too_large and includes the offending field', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(
      makeJsonResponse(413, {
        statusCode: 413,
        data: { code: 'design_context_too_large', field: 'node' },
      }),
    );

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await expect(
      tool.execute({ prompt: 'hi', designContext: { type: 'figma', node: { large: true } } }),
    ).rejects.toThrow(/too large.*node/);
  });

  it('translates 429 thread_already_streaming', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(
      makeJsonResponse(429, {
        statusCode: 429,
        data: { code: 'thread_already_streaming' },
      }),
    );

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await expect(tool.execute({ prompt: 'hi', threadId: 'chat-1' })).rejects.toThrow(
      /already in flight/,
    );
  });

  it('translates 404 run_not_found from the SSE GET into the agent message', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(
        makeJsonResponse(404, { statusCode: 404, data: { code: 'run_not_found' } }),
      );

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await expect(tool.execute({ prompt: 'hi' })).rejects.toThrow(/Run not found/);
  });

  it('sends the Bearer token on the SSE GET, not just the POST', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(makeSseResponse([sseFrame('[DONE]')]));

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await tool.execute({ prompt: 'hi' });

    const [, sseInit] = fetcher.mock.calls[1];
    expect(sseInit.method).toBe('GET');
    expect(sseInit.headers).toMatchObject({
      authorization: `Bearer ${token}`,
      accept: 'text/event-stream',
    });
  });

  it('calls getToken exactly once per execute (one tool call = one token fetch)', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(makeSseResponse([sseFrame('[DONE]')]));

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await tool.execute({ prompt: 'hi' });

    expect(getToken).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledTimes(2); // POST + SSE GET, both used the same token
  });

  it('handles a non-JSON error body (e.g. proxy returns HTML) without throwing', async () => {
    const htmlBody = new Response('<html><body>400 Bad Request</body></html>', {
      status: 400,
      headers: { 'content-type': 'text/html' },
    });
    const fetcher = vi.fn().mockResolvedValueOnce(htmlBody);

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await expect(tool.execute({ prompt: 'hi' })).rejects.toThrow(/HTTP 400/);
  });

  it('surfaces the message from a standard Fastify error body (string `error` field)', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(
      makeJsonResponse(404, {
        statusCode: 404,
        error: 'Not Found',
        message: 'Route POST:/v1/codegen/generate not found',
      }),
    );

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await expect(tool.execute({ prompt: 'hi' })).rejects.toThrow(
      /Route POST:\/v1\/codegen\/generate not found/,
    );
  });

  it('invokes invalidateToken on 401 from the POST so the next call mints a fresh JWT', async () => {
    const invalidateToken = vi.fn();
    const fetcher = vi.fn().mockResolvedValueOnce(makeJsonResponse(401, { statusCode: 401 }));

    const tool = createGenerateReactCodeTool({
      recipesBackendBaseUrl: baseUrl,
      getToken,
      invalidateToken,
      fetcher,
    });
    await expect(tool.execute({ prompt: 'hi' })).rejects.toThrow(/JWT rejected/i);
    expect(invalidateToken).toHaveBeenCalledTimes(1);
  });

  it('invokes invalidateToken on 401 from the SSE GET as well', async () => {
    const invalidateToken = vi.fn();
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(makeJsonResponse(401, { statusCode: 401 }));

    const tool = createGenerateReactCodeTool({
      recipesBackendBaseUrl: baseUrl,
      getToken,
      invalidateToken,
      fetcher,
    });
    await expect(tool.execute({ prompt: 'hi' })).rejects.toThrow(/JWT rejected/i);
    expect(invalidateToken).toHaveBeenCalledTimes(1);
  });

  it('does NOT invoke invalidateToken on non-401 errors (e.g. 500)', async () => {
    const invalidateToken = vi.fn();
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(500, { statusCode: 500, message: 'boom' }));

    const tool = createGenerateReactCodeTool({
      recipesBackendBaseUrl: baseUrl,
      getToken,
      invalidateToken,
      fetcher,
    });
    await expect(tool.execute({ prompt: 'hi' })).rejects.toThrow(/500/);
    expect(invalidateToken).not.toHaveBeenCalled();
  });

  it('translates 401 (JWT expired mid-run) into a retry hint', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(makeJsonResponse(401, { statusCode: 401 }));

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await expect(tool.execute({ prompt: 'hi' })).rejects.toThrow(/JWT rejected.*retry/i);
  });

  it('translates 403 token_scope_not_allowed into an api-key-scope message', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(
      makeJsonResponse(403, {
        statusCode: 403,
        data: { code: 'token_scope_not_allowed' },
      }),
    );

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await expect(tool.execute({ prompt: 'hi' })).rejects.toThrow(/not authorized for codegen/);
  });

  it('translates 404 thread_not_found into a thread-level message', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(
      makeJsonResponse(404, {
        statusCode: 404,
        data: { code: 'thread_not_found' },
      }),
    );

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await expect(tool.execute({ prompt: 'hi', threadId: 'chat-x' })).rejects.toThrow(
      /Thread not found/,
    );
  });

  it('translates 404 codegen_stream_not_found into a re-issue message', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(
        makeJsonResponse(404, {
          statusCode: 404,
          data: { code: 'codegen_stream_not_found' },
        }),
      );

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await expect(tool.execute({ prompt: 'hi' })).rejects.toThrow(
      /Run state is no longer available/,
    );
  });

  it('translates 5xx backend errors and surfaces the upstream message when present', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(502, { statusCode: 502, message: 'bad gateway' }));

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    // Both the HTTP status and the upstream message should be in the surfaced error.
    await expect(tool.execute({ prompt: 'hi' })).rejects.toThrow(/502.*bad gateway/i);
  });

  it('translates 5xx with Fastify-shape body (error.message) and surfaces the upstream message', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        makeJsonResponse(500, { error: { message: 'Cannot read undefined' } }),
      );

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await expect(tool.execute({ prompt: 'hi' })).rejects.toThrow(/500.*Cannot read undefined/);
  });

  it('falls back to the generic 5xx message when no upstream body is present', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(new Response('', { status: 503 }));
    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await expect(tool.execute({ prompt: 'hi' })).rejects.toThrow(
      /Backend error \(HTTP 503\)\. Retry shortly\./,
    );
  });

  it('surfaces Fastify-style nested error.message (e.g., bare 404 from missing route)', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(
      makeJsonResponse(404, {
        error: { message: 'Not Found', statusCode: 404 },
      }),
    );

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await expect(tool.execute({ prompt: 'hi' })).rejects.toThrow(/Not Found/);
  });

  it('falls back to body.message for an unknown error code', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(
      makeJsonResponse(418, {
        statusCode: 418,
        message: "I'm a teapot",
        data: { code: 'some_future_code_we_dont_know' },
      }),
    );

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await expect(tool.execute({ prompt: 'hi' })).rejects.toThrow(/I'm a teapot/);
  });

  it('exposes the expected default name / publicName / description (MCP contract)', () => {
    const tool = createGenerateReactCodeTool({
      recipesBackendBaseUrl: baseUrl,
      getToken,
      fetcher: vi.fn(),
    });

    expect(tool.name).toBe('generate_react_code');
    expect(tool.publicName).toBe('generateReactCode');
    // A/B test in progress: description temporarily reverted to descriptive wording.
    // Tighten back to prescriptive + `muiPairing` assertions when restoring.
    expect(tool.description).toMatch(/Material UI|MUI/);
  });

  it('honors overrides for name and description', () => {
    const tool = createGenerateReactCodeTool({
      recipesBackendBaseUrl: baseUrl,
      getToken,
      fetcher: vi.fn(),
      overrides: { name: 'custom_codegen', description: 'restricted variant' },
    });

    expect(tool.name).toBe('custom_codegen');
    expect(tool.description).toBe('restricted variant');
    // publicName is not in ToolOverrides, so it stays at the default.
    expect(tool.publicName).toBe('generateReactCode');
  });

  it('fires onProgress for each file-update chunk with running filesSeen, and a final `done`', async () => {
    const onProgress = vi.fn();
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(
        makeSseResponse([
          sseFrame({ type: 'reasoning', text: 'thinking...' }),
          sseFrame({ type: 'file-update', fileName: 'App.tsx', contents: 'v1' }),
          sseFrame({ type: 'file-update', fileName: 'Quantity.tsx', contents: 'v1' }),
          sseFrame({ type: 'finish', finishReason: 'stop' }),
          sseFrame('[DONE]'),
        ]),
      );

    const tool = createGenerateReactCodeTool({
      recipesBackendBaseUrl: baseUrl,
      getToken,
      onProgress,
      fetcher,
    });
    await tool.execute({ prompt: 'hi' });

    expect(onProgress).toHaveBeenCalledTimes(3);
    expect(onProgress).toHaveBeenNthCalledWith(1, {
      kind: 'file',
      filename: 'App.tsx',
      filesSeen: 1,
    });
    expect(onProgress).toHaveBeenNthCalledWith(2, {
      kind: 'file',
      filename: 'Quantity.tsx',
      filesSeen: 2,
    });
    expect(onProgress).toHaveBeenNthCalledWith(3, { kind: 'done', filesSeen: 2 });
  });

  it('calls the optional logger when onProgress throws, so host bugs are observable', async () => {
    const logger = vi.fn();
    const onProgress = vi.fn(async () => {
      throw new Error('host crashed');
    });
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(
        makeSseResponse([
          sseFrame({ type: 'file-update', fileName: 'App.tsx', contents: 'v1' }),
          sseFrame('[DONE]'),
        ]),
      );

    const tool = createGenerateReactCodeTool({
      recipesBackendBaseUrl: baseUrl,
      getToken,
      onProgress,
      logger,
      fetcher,
    });
    await tool.execute({ prompt: 'hi' });

    // One log per failing event (file + done). Message + the original error are forwarded.
    expect(logger).toHaveBeenCalledTimes(2);
    expect(logger.mock.calls[0][0]).toMatch(/onProgress hook failed/);
    expect(logger.mock.calls[0][1]).toBeInstanceOf(Error);
    expect((logger.mock.calls[0][1] as Error).message).toBe('host crashed');
  });

  it('does NOT crash the run when onProgress throws synchronously (host bug isolation)', async () => {
    const onProgress = vi.fn(() => {
      throw new Error('host crashed');
    });
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(
        makeSseResponse([
          sseFrame({ type: 'file-update', fileName: 'App.tsx', contents: 'v1' }),
          sseFrame('[DONE]'),
        ]),
      );

    const tool = createGenerateReactCodeTool({
      recipesBackendBaseUrl: baseUrl,
      getToken,
      onProgress,
      fetcher,
    });
    await expect(tool.execute({ prompt: 'hi' })).resolves.toMatchObject({
      files: [{ filename: 'App.tsx', contents: 'v1' }],
    });
    // Called for both the file-update AND the done events, both threw, both swallowed.
    expect(onProgress).toHaveBeenCalledTimes(2);
  });

  it('does NOT crash the run when onProgress returns a rejected Promise', async () => {
    const onProgress = vi.fn(async () => {
      throw new Error('async host crash');
    });
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(
        makeSseResponse([
          sseFrame({ type: 'file-update', fileName: 'App.tsx', contents: 'v1' }),
          sseFrame('[DONE]'),
        ]),
      );

    const tool = createGenerateReactCodeTool({
      recipesBackendBaseUrl: baseUrl,
      getToken,
      onProgress,
      fetcher,
    });
    await expect(tool.execute({ prompt: 'hi' })).resolves.toMatchObject({
      files: [{ filename: 'App.tsx', contents: 'v1' }],
    });
    expect(onProgress).toHaveBeenCalledTimes(2);
  });

  it('awaits async onProgress before resolving the tool (no fire-and-forget on the final done event)', async () => {
    const progressCalls: string[] = [];
    let resolveLastProgress: () => void = () => {};
    const lastProgressBlock = new Promise<void>((r) => {
      resolveLastProgress = r;
    });
    const onProgress = vi.fn(async (event: { kind: string; filename?: string }) => {
      if (event.kind === 'done') {
        // Block the done event until we explicitly release it.
        await lastProgressBlock;
      }
      progressCalls.push(event.kind === 'file' ? `file:${event.filename}` : event.kind);
    });
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(
        makeSseResponse([
          sseFrame({ type: 'file-update', fileName: 'App.tsx', contents: 'v1' }),
          sseFrame('[DONE]'),
        ]),
      );

    const tool = createGenerateReactCodeTool({
      recipesBackendBaseUrl: baseUrl,
      getToken,
      onProgress,
      fetcher,
    });
    const executePromise = tool.execute({ prompt: 'hi' });

    // Give the stream parser a tick to process chunks AND queue the chained progress.
    await new Promise((r) => {
      setTimeout(r, 10);
    });
    // At this point the file event has fired but done is blocked, so the tool can't have
    // resolved yet.
    expect(progressCalls).toEqual(['file:App.tsx']);

    // Release the blocked done event; the tool result should now arrive.
    resolveLastProgress();
    await executePromise;

    expect(progressCalls).toEqual(['file:App.tsx', 'done']);
    expect(onProgress).toHaveBeenCalledTimes(2);
  });

  it('does NOT throw if onProgress is not provided (default no-op behavior)', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(
        makeSseResponse([
          sseFrame({ type: 'file-update', fileName: 'App.tsx', contents: 'v1' }),
          sseFrame('[DONE]'),
        ]),
      );

    const tool = createGenerateReactCodeTool({ recipesBackendBaseUrl: baseUrl, getToken, fetcher });
    await expect(tool.execute({ prompt: 'hi' })).resolves.toMatchObject({
      threadId: 'chat-1',
      files: [{ filename: 'App.tsx', contents: 'v1' }],
    });
  });

  it('strips trailing slashes from the base URL when composing request URLs', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makeJsonResponse(202, { threadId: 'chat-1', runId: 'msg-1' }))
      .mockResolvedValueOnce(makeSseResponse([sseFrame('[DONE]')]));

    const tool = createGenerateReactCodeTool({
      recipesBackendBaseUrl: `${baseUrl}/`,
      getToken,
      fetcher,
    });
    await tool.execute({ prompt: 'hi' });

    expect(fetcher.mock.calls[0][0]).toBe(`${baseUrl}/v1/codegen/generate`);
    expect(fetcher.mock.calls[1][0]).toBe(`${baseUrl}/v1/codegen/runs/msg-1`);
  });
});

describe('formatCodegenText', () => {
  const threadId = 'chat-test';

  it('serializes explanation + fenced files with extension-derived lang + threadId footer', () => {
    const text = formatCodegenText({
      threadId,
      explanation: "Here's a card.",
      files: [
        { filename: 'App.tsx', contents: 'export default () => null;' },
        { filename: 'theme.css', contents: ':root { color: red; }' },
      ],
    });

    expect(text).toBe(
      `${[
        "Here's a card.",
        '### App.tsx\n\n```tsx\nexport default () => null;\n```',
        '### theme.css\n\n```css\n:root { color: red; }\n```',
      ].join(
        '\n\n',
      )}\n\n---\nthreadId: \`chat-test\` (pass on follow-up calls to continue this conversation).`,
    );
  });

  it('omits the explanation block when explanation is empty/whitespace', () => {
    const text = formatCodegenText({
      threadId,
      explanation: '   ',
      files: [{ filename: 'App.tsx', contents: 'x' }],
    });

    expect(text.startsWith('### App.tsx')).toBe(true);
  });

  it('falls back to "Generated code." (still followed by threadId) when explanation and files are empty', () => {
    const text = formatCodegenText({ threadId, explanation: '', files: [] });
    expect(text).toBe(
      'Generated code.\n\n---\nthreadId: `chat-test` (pass on follow-up calls to continue this conversation).',
    );
  });

  it('always appends the threadId footer so MCP clients reading only `content` can continue the conversation', () => {
    const text = formatCodegenText({
      threadId: 'chat-xyz',
      explanation: 'done',
      files: [],
    });
    expect(text).toContain('threadId: `chat-xyz`');
    expect(text.endsWith('continue this conversation).')).toBe(true);
  });

  it('uses a longer fence when the file contents contain triple backticks (MDX / code samples)', () => {
    const mdx = 'Title\n\n```ts\nconst x = 1;\n```\n\nMore text.';
    const text = formatCodegenText({
      threadId,
      explanation: '',
      files: [{ filename: 'README.mdx', contents: mdx }],
    });

    // Outer fence must be 4 backticks to safely wrap the inner ```ts ... ``` block.
    expect(text).toContain('````mdx\n');
    expect(text).toContain('\n````\n\n---\nthreadId:');
  });

  it('escalates fence length to N+1 when the longest backtick run in the file is N', () => {
    const contents = 'a\n``````\nb'; // run of 6 backticks
    const text = formatCodegenText({
      threadId,
      explanation: '',
      files: [{ filename: 'x.md', contents }],
    });

    expect(text).toContain('```````md\n'); // 7 backticks opening
    expect(text).toContain('\n```````\n\n---'); // 7 backticks closing then footer
  });

  it('falls back to plain fenced block when filename has no extension', () => {
    const text = formatCodegenText({
      threadId,
      explanation: '',
      files: [{ filename: 'Dockerfile', contents: 'FROM node:22' }],
    });

    expect(text).toContain('```Dockerfile'); // last segment used as lang hint
  });
});
