import { describe, expect, it } from 'vitest';
import type { ChatMessageChunk } from '@mui/x-chat-headless';
import { consumeForExecutor } from './consumeForExecutor';
import type { Executor } from '../executor/createExecutor';
import type { ToolName } from './types';

function streamOf(chunks: ChatMessageChunk[]): ReadableStream<ChatMessageChunk> {
  return new ReadableStream<ChatMessageChunk>({
    start(controller) {
      chunks.forEach((chunk) => controller.enqueue(chunk));
      controller.close();
    },
  });
}

// Minimal executor double that records what the consumer dispatches.
function recordingExecutor() {
  const pushed: Array<{ toolName: ToolName; body: string }> = [];
  const executor = {
    results: { applied: [], skipped: [] },
    pushChunk(_toolIndex: number, toolName: ToolName, body: string) {
      pushed.push({ toolName, body });
    },
    onToolStop() {},
    onAllToolsStop() {},
  } as unknown as Executor;
  return { executor, pushed };
}

const PATCH = '{"op":"replace","path":"/type","value":"bar"}';

function toolStream(toolName: string): ReadableStream<ChatMessageChunk> {
  return streamOf([
    { type: 'start', messageId: 'm1' } as ChatMessageChunk,
    { type: 'tool-input-start', toolCallId: 't1', toolName } as unknown as ChatMessageChunk,
    {
      type: 'tool-input-available',
      toolCallId: 't1',
      input: { patches: PATCH },
    } as unknown as ChatMessageChunk,
    { type: 'finish', messageId: 'm1' } as ChatMessageChunk,
  ]);
}

describe('consumeForExecutor — toolNameAliases', () => {
  it('dispatches an aliased tool (updateChart) through the canonical setGridState path', async () => {
    const { executor, pushed } = recordingExecutor();

    await consumeForExecutor(toolStream('updateChart'), {
      executor,
      toolNameAliases: { updateChart: 'setGridState' },
    });

    expect(pushed).to.have.lengthOf(1);
    // The executor sees the canonical wire name + the patch body from `patches`.
    expect(pushed[0].toolName).to.equal('setGridState');
    expect(pushed[0].body).to.equal(PATCH);
  });

  it('ignores the host tool name when no alias maps it (unsupported name)', async () => {
    const { executor, pushed } = recordingExecutor();

    await consumeForExecutor(toolStream('updateChart'), { executor });

    // `updateChart` is not in SUPPORTED_TOOL_NAMES and no alias was provided.
    expect(pushed).to.have.lengthOf(0);
  });

  it('leaves the canonical names untouched (Grid / Studio unaffected)', async () => {
    const { executor, pushed } = recordingExecutor();

    await consumeForExecutor(toolStream('setGridState'), {
      executor,
      toolNameAliases: { updateChart: 'setGridState' },
    });

    expect(pushed).to.have.lengthOf(1);
    expect(pushed[0].toolName).to.equal('setGridState');
  });
});
