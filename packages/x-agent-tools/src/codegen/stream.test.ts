import { describe, expect, it, vi } from 'vitest';
import { consumeCodegenStream } from './stream';

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

describe('consumeCodegenStream', () => {
  it('buffers file-update chunks and explanation text, resolving on `[DONE]`', async () => {
    const response = makeSseResponse([
      sseFrame({ type: 'body', text: 'Here is ' }),
      sseFrame({ type: 'body', text: 'a card.' }),
      sseFrame({ type: 'file-update', fileName: 'App.tsx', contents: 'export default 1;' }),
      sseFrame('[DONE]'),
    ]);

    const result = await consumeCodegenStream(response);

    expect(result.explanation).toBe('Here is a card.');
    expect(result.files).toEqual([{ filename: 'App.tsx', contents: 'export default 1;' }]);
  });

  it('accepts the `[DONE]` sentinel in its JSON-encoded form (`"[DONE]"`)', async () => {
    const response = makeSseResponse([
      sseFrame({ type: 'file-update', fileName: 'A.tsx', contents: 'a' }),
      sseFrame('"[DONE]"'),
    ]);

    const result = await consumeCodegenStream(response);

    expect(result.files).toEqual([{ filename: 'A.tsx', contents: 'a' }]);
  });

  it('throws when the response has no body', async () => {
    const response = new Response(null, {
      status: 200,
      headers: { 'content-type': 'text/event-stream' },
    });

    await expect(consumeCodegenStream(response)).rejects.toThrow(
      /MUI X Agent Tools: Backend returned an SSE response with no body/,
    );
  });

  it('rejects when the stream closes without a `[DONE]` sentinel (truncated)', async () => {
    const response = makeSseResponse([
      sseFrame({ type: 'file-update', fileName: 'App.tsx', contents: 'partial' }),
    ]);

    await expect(consumeCodegenStream(response)).rejects.toThrow(/ended unexpectedly/);
  });

  it('rejects on an `error` chunk, surfacing the message', async () => {
    const response = makeSseResponse([sseFrame({ type: 'error', error: 'upstream exploded' })]);

    await expect(consumeCodegenStream(response)).rejects.toThrow(
      /Generation failed: upstream exploded/,
    );
  });

  it('rejects when the underlying stream errors mid-read', async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.error(new Error('socket reset'));
      },
    });
    const response = new Response(stream, {
      status: 200,
      headers: { 'content-type': 'text/event-stream' },
    });

    await expect(consumeCodegenStream(response)).rejects.toThrow(
      /SSE stream errored: socket reset/,
    );
  });

  it('reads the filename from `filename` when `fileName` is absent, and defaults empty contents', async () => {
    const response = makeSseResponse([
      sseFrame({ type: 'file-update', filename: 'B.tsx' }),
      sseFrame('[DONE]'),
    ]);

    const result = await consumeCodegenStream(response);

    expect(result.files).toEqual([{ filename: 'B.tsx', contents: '' }]);
  });

  it('ignores a file-update chunk with no filename', async () => {
    const response = makeSseResponse([
      sseFrame({ type: 'file-update', contents: 'orphan' }),
      sseFrame('[DONE]'),
    ]);

    const result = await consumeCodegenStream(response);

    expect(result.files).toEqual([]);
  });

  it('accepts text via the textDelta / delta / content aliases', async () => {
    const response = makeSseResponse([
      sseFrame({ type: 'text-delta', textDelta: 'a' }),
      sseFrame({ type: 'text', delta: 'b' }),
      sseFrame({ type: 'body', content: 'c' }),
      sseFrame('[DONE]'),
    ]);

    const result = await consumeCodegenStream(response);

    expect(result.explanation).toBe('abc');
  });

  it('skips reasoning chunks, unknown chunk types, and non-JSON data lines', async () => {
    const response = makeSseResponse([
      sseFrame({ type: 'reasoning', text: 'thinking' }),
      sseFrame({ type: 'finish', finishReason: 'stop' }),
      sseFrame('not json'),
      sseFrame({ type: 'body', text: 'kept' }),
      sseFrame('[DONE]'),
    ]);

    const result = await consumeCodegenStream(response);

    expect(result.explanation).toBe('kept');
    expect(result.files).toEqual([]);
  });

  it('keeps the last write for repeated filenames', async () => {
    const response = makeSseResponse([
      sseFrame({ type: 'file-update', fileName: 'App.tsx', contents: 'v1' }),
      sseFrame({ type: 'file-update', fileName: 'App.tsx', contents: 'v2' }),
      sseFrame('[DONE]'),
    ]);

    const result = await consumeCodegenStream(response);

    expect(result.files).toEqual([{ filename: 'App.tsx', contents: 'v2' }]);
  });

  it('fires onProgress per file with a running count and a final done event', async () => {
    const onProgress = vi.fn();
    const response = makeSseResponse([
      sseFrame({ type: 'file-update', fileName: 'A.tsx', contents: '1' }),
      sseFrame({ type: 'file-update', fileName: 'B.tsx', contents: '2' }),
      sseFrame('[DONE]'),
    ]);

    await consumeCodegenStream(response, onProgress);

    expect(onProgress).toHaveBeenNthCalledWith(1, {
      kind: 'file',
      filename: 'A.tsx',
      filesSeen: 1,
    });
    expect(onProgress).toHaveBeenNthCalledWith(2, {
      kind: 'file',
      filename: 'B.tsx',
      filesSeen: 2,
    });
    expect(onProgress).toHaveBeenNthCalledWith(3, { kind: 'done', filesSeen: 2 });
  });

  it('swallows an onProgress failure and reports it through the logger', async () => {
    const logger = vi.fn();
    const onProgress = vi.fn(() => {
      throw new Error('host bug');
    });
    const response = makeSseResponse([
      sseFrame({ type: 'file-update', fileName: 'A.tsx', contents: '1' }),
      sseFrame('[DONE]'),
    ]);

    const result = await consumeCodegenStream(response, onProgress, logger);

    expect(result.files).toEqual([{ filename: 'A.tsx', contents: '1' }]);
    expect(logger).toHaveBeenCalledWith('codegen.onProgress hook failed', expect.any(Error));
  });
});
