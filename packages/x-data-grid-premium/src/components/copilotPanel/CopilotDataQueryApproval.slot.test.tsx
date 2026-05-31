import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import type { ChatMessage } from '@mui/x-chat-headless';
// Internal store + context — not part of the public surface, used here only to
// seed the chat store the way `GridCopilotPanel` does at runtime so the
// shared-panel `{ toolCallId }` path can resolve its owning message.
import {
  ChatStore,
  // eslint-disable-next-line import/no-relative-packages
} from '../../../../x-chat-headless/src/store';
import {
  ChatStoreContext,
  // eslint-disable-next-line import/no-relative-packages
} from '../../../../x-chat-headless/src/internals/useChatStoreContext';
// Internal grid context — `CopilotDataQueryApproval` calls `useGridApiContext()`,
// which throws without a provider. A stub apiRef is enough here since the
// preview computation is wrapped in a try/catch inside the component.
import {
  GridApiContext,
  // eslint-disable-next-line import/no-relative-packages
} from '../../../../x-data-grid/src/components/GridApiContext';
import { CopilotDataQueryApproval } from './CopilotDataQueryApproval';

const TOOL_CALL_ID = 'call-query-1';

const QUERY_MESSAGE: ChatMessage = {
  id: 'assistant-1',
  role: 'assistant',
  parts: [
    { type: 'text', text: 'Let me read the grid.' },
    {
      type: 'tool',
      toolInvocation: {
        toolCallId: TOOL_CALL_ID,
        toolName: 'queryGridData',
        state: 'output-available',
        input: { mode: 'rows', columns: ['name', 'age'], rowFilter: 'visible' },
      },
    },
  ],
};

// Minimal apiRef so `useGridApiContext()` resolves. `previewGridDataQuery` is
// wrapped in a try/catch inside the component, so a stub state is enough — the
// card falls back to the input's column count when the preview can't compute.
const apiRef = { current: { state: { columns: {} } } } as unknown;

function renderWithStore(
  ui: React.ReactElement,
  { messages }: { messages: ChatMessage[] } = { messages: [QUERY_MESSAGE] },
) {
  const store = new ChatStore({ initialMessages: messages });
  return {
    store,
    wrapper: (
      <GridApiContext.Provider value={apiRef}>
        <ChatStoreContext.Provider value={store}>{ui}</ChatStoreContext.Provider>
      </GridApiContext.Provider>
    ),
  };
}

describe('<CopilotDataQueryApproval /> slot prop shape', () => {
  const { render } = createRenderer();

  it('renders the approval card from the `toolCallId` prop (shared-panel slot path)', () => {
    const { wrapper } = renderWithStore(<CopilotDataQueryApproval toolCallId={TOOL_CALL_ID} />);
    render(wrapper);

    // The message owning `TOOL_CALL_ID` is resolved from the store; the card
    // surfaces the read-rows heading for a completed `rows` query.
    expect(screen.getByText(/Read .* row/)).not.to.equal(null);
    expect(screen.getByText(/values stayed in your browser/)).not.to.equal(null);
  });

  it('renders nothing when no message in the store owns the `toolCallId`', () => {
    const { wrapper } = renderWithStore(<CopilotDataQueryApproval toolCallId="missing-call" />);
    const { container } = render(wrapper);

    expect(container.textContent).to.equal('');
  });

  it('keeps the existing `ownerState.messageId` path working', () => {
    const { wrapper } = renderWithStore(
      <CopilotDataQueryApproval
        ownerState={{
          messageId: QUERY_MESSAGE.id,
          toolName: 'queryGridData',
          toolCallId: TOOL_CALL_ID,
          state: 'output-available',
        }}
      />,
    );
    render(wrapper);

    expect(screen.getByText(/Read .* row/)).not.to.equal(null);
  });
});
