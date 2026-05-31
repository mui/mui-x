import * as React from 'react';
import { spy } from 'sinon';
import { createRenderer, screen, fireEvent } from '@mui/internal-test-utils';
import { ChatRoot } from '@mui/x-chat-headless';
import type { ChatAdapter, ChatMessage } from '@mui/x-chat-headless';
// Internal grid context — `CopilotAbVariantTabs` calls `useGridApiContext()`,
// which throws without a provider. A stub apiRef is enough here: the
// shared-panel path routes variant switches through `onSwitchVariant` instead
// of the grid API.
import {
  GridApiContext,
  // eslint-disable-next-line import/no-relative-packages
} from '../../../../x-data-grid/src/components/GridApiContext';
import { CopilotAbVariantTabs } from './CopilotAbVariantTabs';

const AB_PAIR_ID = 'pair-1';

const VARIANT_A: ChatMessage = {
  id: 'variant-a',
  role: 'assistant',
  status: 'sent',
  parts: [{ type: 'text', text: 'Answer A' }],
  metadata: {
    abPairId: AB_PAIR_ID,
    abVariant: 'A',
    responseId: 'resp-a',
    modelId: 'model-a',
  },
};

const VARIANT_B: ChatMessage = {
  id: 'variant-b',
  role: 'assistant',
  status: 'sent',
  parts: [{ type: 'text', text: 'Answer B' }],
  metadata: {
    abPairId: AB_PAIR_ID,
    abVariant: 'B',
    responseId: 'resp-b',
    modelId: 'model-b',
  },
};

function createAdapter(): ChatAdapter {
  return {
    async sendMessage() {
      return new ReadableStream({
        start(controller) {
          controller.close();
        },
      });
    },
  };
}

// Minimal apiRef so `useGridApiContext()` resolves. The shared-panel path uses
// `onSwitchVariant`, so `copilot.switchToVariant` is never called here.
const apiRef = { current: {} } as unknown;

// `ChatRoot` provides the full headless runtime + store the way
// `GridCopilotPanel` does at runtime, so the active variant's message body
// (`ChatMessageContent`) and the store-derivation hooks resolve. The A/B pair
// is seeded as `initialMessages` so the `{ message }` path can locate siblings.
function renderWithChat(
  ui: React.ReactElement,
  { messages }: { messages: ChatMessage[] } = { messages: [VARIANT_A, VARIANT_B] },
) {
  return (
    <GridApiContext.Provider value={apiRef}>
      <ChatRoot adapter={createAdapter()} initialMessages={messages}>
        {ui}
      </ChatRoot>
    </GridApiContext.Provider>
  );
}

describe('<CopilotAbVariantTabs /> slot prop shape', () => {
  const { render } = createRenderer();

  it('renders both variant tabs from the `message` prop (shared-panel slot path)', () => {
    render(renderWithChat(<CopilotAbVariantTabs message={VARIANT_A} />));

    // The pair is derived from the store: both the A and B tabs are rendered
    // inside the tablist, each labelled with its variant.
    expect(screen.getByRole('tablist')).not.to.equal(null);
    const tabA = screen.getByText('Variant A').closest('button');
    const tabB = screen.getByText('Variant B').closest('button');
    expect(tabA).not.to.equal(null);
    expect(tabB).not.to.equal(null);
    expect(tabA).not.to.equal(tabB);
  });

  it('calls `onSwitchVariant` with the picked variant id when a tab is clicked', () => {
    const onSwitchVariant = spy();
    render(
      renderWithChat(
        <CopilotAbVariantTabs message={VARIANT_A} onSwitchVariant={onSwitchVariant} />,
      ),
    );

    // Variant A is the default active tab; clicking Variant B previews it and
    // must route through the host-supplied `onSwitchVariant`, not the grid API.
    const tabB = screen.getByText('Variant B').closest('button')!;
    fireEvent.click(tabB);

    expect(onSwitchVariant.callCount).to.equal(1);
    expect(onSwitchVariant.firstCall.firstArg).to.equal(VARIANT_B.id);
  });
});
