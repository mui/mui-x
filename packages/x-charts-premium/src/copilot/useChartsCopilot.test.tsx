import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@mui/internal-test-utils';
import type { ChatAdapter, ChatMessageChunk, ChatSendMessageInput } from '@mui/x-chat-headless';
import { EMPTY_CHART_COPILOT_STATE, snapshotState, type ChartCopilotState } from './chartState';
import type { ChartCopilotDataset } from './resolveForRenderer';
import { useChartsCopilot } from './useChartsCopilot';

const DATASET: ChartCopilotDataset = {
  id: 'sales',
  columns: [
    { field: 'region', headerName: 'Region', type: 'string' },
    { field: 'revenue', headerName: 'Revenue', type: 'number' },
  ],
  rows: [
    { region: 'North', revenue: 100 },
    { region: 'South', revenue: 200 },
  ],
};

function streamOf(chunks: ChatMessageChunk[]): ReadableStream<ChatMessageChunk> {
  return new ReadableStream<ChatMessageChunk>({
    start(controller) {
      chunks.forEach((chunk) => controller.enqueue(chunk));
      controller.close();
    },
  });
}

function createMockAdapter(makeChunks: () => ChatMessageChunk[]): ChatAdapter {
  return {
    async sendMessage() {
      return streamOf(makeChunks());
    },
  };
}

async function drain(stream: ReadableStream): Promise<void> {
  const reader = stream.getReader();
  let done = false;
  while (!done) {
    // eslint-disable-next-line no-await-in-loop
    done = (await reader.read()).done;
  }
}

function setGridStateStream(patch: object): ChatMessageChunk[] {
  // Mirrors the proven chunk shapes from docs StudioCopilot mock stream.
  return [
    { type: 'start', messageId: 'msg-1' },
    { type: 'tool-input-start', toolCallId: 't1', toolName: 'setGridState' },
    {
      type: 'tool-input-available',
      toolCallId: 't1',
      toolName: 'setGridState',
      input: { patches: JSON.stringify(patch) },
    },
    { type: 'finish', messageId: 'msg-1', finishReason: 'stop' },
  ] as unknown as ChatMessageChunk[];
}

function renderCopilot(state: { current: ChartCopilotState }, inner: ChatAdapter) {
  return renderHook(() =>
    useChartsCopilot({
      inner,
      getChartState: () => state.current,
      setChartState: (next) => {
        state.current = next;
      },
      getDataset: () => DATASET,
      getFocus: () => ({}),
      setFocus: () => {},
    }),
  );
}

describe('useChartsCopilot', () => {
  it('applies an envelope to the controlled chart state (sync path)', () => {
    const state = { current: snapshotState(EMPTY_CHART_COPILOT_STATE) };
    const { result } = renderCopilot(
      state,
      createMockAdapter(() => []),
    );

    result.current.applyEnvelope({
      setGridState: JSON.stringify({ op: 'replace', path: '/type', value: 'line' }),
    });

    expect(state.current.type).to.equal('line');
  });

  it('skips a guard-disabled patch through the hook', () => {
    const state = { current: snapshotState(EMPTY_CHART_COPILOT_STATE) };
    const { result } = renderHook(() =>
      useChartsCopilot({
        inner: createMockAdapter(() => []),
        getChartState: () => state.current,
        setChartState: (next) => {
          state.current = next;
        },
        getDataset: () => DATASET,
        getFocus: () => ({}),
        setFocus: () => {},
        features: { chartsIntegration: false },
      }),
    );

    const outcome = result.current.applyEnvelope({
      setGridState: JSON.stringify({ op: 'replace', path: '/type', value: 'line' }),
    });

    expect(outcome.applied).to.have.length(0);
    expect(state.current.type).to.equal(EMPTY_CHART_COPILOT_STATE.type);
  });

  it('applies a streamed setGridState patch through the wrapped adapter', async () => {
    const state = { current: snapshotState(EMPTY_CHART_COPILOT_STATE) };
    const inner = createMockAdapter(() =>
      setGridStateStream({ op: 'replace', path: '/type', value: 'pie' }),
    );
    const { result } = renderCopilot(state, inner);

    const input = {
      message: { id: 'u1', role: 'user', parts: [{ type: 'text', text: 'make it a pie chart' }] },
      messages: [],
      signal: new AbortController().signal,
    } as unknown as ChatSendMessageInput;

    const stream = await result.current.adapter.sendMessage(input);
    await drain(stream);

    await waitFor(() => {
      expect(state.current.type).to.equal('pie');
    });
  });
});
