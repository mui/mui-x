import axe from 'axe-core';
import * as React from 'react';
import { act, createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter } from '../adapters/chatAdapter';
import type { ChatMessage } from '../types/chat-entities';
import { ComposerTextArea, ComposerRoot } from '../composer';
import { ConversationListRoot } from '../conversation-list';
import { ScrollToBottomAffordance, TypingIndicator, UnreadMarker } from '../indicators';
import {
  MessageActions,
  MessageAvatar,
  MessageContent,
  MessageMeta,
  MessageRoot,
} from '../message';
import { MessageGroup } from '../message-group';
import {
  MessageListDateDivider,
  MessageListRoot,
  type MessageListRootProps,
} from '../message-list';
import {
  ConversationHeader,
  ConversationHeaderInfo,
  ConversationRoot,
  ConversationSubtitle,
  ConversationTitle,
} from '../conversation';
import { ChatLayout } from './ChatLayout';
import { ChatRoot } from './ChatRoot';

const { render } = createRenderer();
const isJSDOM = /jsdom/.test(window.navigator.userAgent);
const isChrome = /chrome/i.test(window.navigator.userAgent);

function logViolations(violations: axe.Result[]) {
  if (violations.length !== 0) {
    violations.forEach((violation) => {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(violation, null, 2));
    });
  }
}

function createAdapter(overrides: Partial<ChatAdapter> = {}): ChatAdapter {
  return {
    async sendMessage() {
      return new ReadableStream({
        start(controller) {
          controller.close();
        },
      });
    },
    ...overrides,
  };
}

function createMessage(
  id: string,
  role: ChatMessage['role'],
  options: Partial<ChatMessage> = {},
): ChatMessage {
  return {
    id,
    role,
    createdAt: '2026-03-15T09:00:00.000Z',
    parts: [{ type: 'text', text: `${role}:${id}` }],
    ...options,
  };
}

const conversations = [
  {
    id: 'c1',
    title: 'Alpha',
    subtitle: 'First thread',
    participants: [{ id: 'u1', displayName: 'Alice' }],
    unreadCount: 1,
  },
  {
    id: 'c2',
    title: 'Beta',
    subtitle: 'Second thread',
    participants: [{ id: 'u2', displayName: 'Bob' }],
  },
];

const initialMessagesByConversation: Record<string, ChatMessage[]> = {
  c1: [
    createMessage('c1-m1', 'assistant', {
      author: { id: 'u1', displayName: 'Alice' },
    }),
    createMessage('c1-m2', 'user', {
      author: { id: 'user', displayName: 'You' },
    }),
  ],
  c2: [
    createMessage('c2-m1', 'assistant', {
      author: { id: 'u2', displayName: 'Bob' },
    }),
  ],
};

const RootWithAffordance = React.forwardRef(function RootWithAffordance(
  props: React.PropsWithChildren<MessageListRootProps> & {
    ownerState?: {
      isAtBottom: boolean;
      messageCount: number;
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    children,
    estimatedItemSize,
    getItemKey,
    items,
    onReachTop,
    renderItem,
    slotProps,
    slots,
    ownerState,
    ...other
  } = props;
  void estimatedItemSize;
  void getItemKey;
  void items;
  void onReachTop;
  void renderItem;
  void slotProps;
  void slots;
  void ownerState;

  return (
    <div ref={ref} {...other}>
      {children}
      <ScrollToBottomAffordance />
    </div>
  );
});

type ChatCompositionHandle = {
  appendAssistantMessage(): void;
  switchConversation(id: string): void;
};

const ChatCompositionHarness = React.forwardRef(function ChatCompositionHarness(
  props: {
    includeBeforeAfterButtons?: boolean;
  },
  ref: React.Ref<ChatCompositionHandle>,
) {
  const { includeBeforeAfterButtons = false } = props;
  const [activeConversationId, setActiveConversationId] = React.useState('c1');
  const [messagesByConversation, setMessagesByConversation] = React.useState(
    initialMessagesByConversation,
  );

  React.useImperativeHandle(
    ref,
    () => ({
      appendAssistantMessage() {
        setMessagesByConversation((previous) => {
          const currentMessages = previous[activeConversationId];
          const nextIndex = currentMessages.length + 1;

          return {
            ...previous,
            [activeConversationId]: [
              ...currentMessages,
              createMessage(`${activeConversationId}-m${nextIndex}`, 'assistant', {
                author:
                  activeConversationId === 'c1'
                    ? { id: 'u1', displayName: 'Alice' }
                    : { id: 'u2', displayName: 'Bob' },
              }),
            ],
          };
        });
      },
      switchConversation(id: string) {
        setActiveConversationId(id);
      },
    }),
    [activeConversationId],
  );

  const messages = messagesByConversation[activeConversationId];

  return (
    <ChatRoot
      activeConversationId={activeConversationId}
      adapter={createAdapter()}
      conversations={[...conversations]}
      messages={messages}
      onActiveConversationChange={(nextConversationId) => {
        if (nextConversationId != null) {
          setActiveConversationId(nextConversationId);
        }
      }}
    >
      <ChatLayout>
        <ConversationListRoot aria-label="Conversations" />
        <ConversationRoot>
          <ConversationHeader>
            <ConversationHeaderInfo>
              <ConversationTitle />
              <ConversationSubtitle />
            </ConversationHeaderInfo>
            <TypingIndicator />
          </ConversationHeader>
          {includeBeforeAfterButtons ? <button type="button">Before list</button> : null}
          <MessageListRoot
            estimatedItemSize={40}
            renderItem={({ id, index }) => (
              <React.Fragment key={id}>
                <UnreadMarker index={index} messageId={id} />
                <MessageListDateDivider index={index} messageId={id} />
                <MessageGroup index={index} messageId={id}>
                  <MessageRoot messageId={id}>
                    <MessageAvatar />
                    <MessageContent />
                    <MessageMeta />
                    <MessageActions>
                      <button data-testid={`message-action-${id}`} type="button">
                        Reply {id}
                      </button>
                    </MessageActions>
                  </MessageRoot>
                </MessageGroup>
              </React.Fragment>
            )}
            slots={{ messageList: RootWithAffordance }}
            style={{ height: 180, overflowY: 'auto' }}
          />
          {includeBeforeAfterButtons ? <button type="button">After list</button> : null}
          <ComposerRoot>
            <ComposerTextArea data-testid="composer-input" />
          </ComposerRoot>
        </ConversationRoot>
      </ChatLayout>
    </ChatRoot>
  );
});

describe('ChatComposition', () => {
  it.skipIf(isJSDOM)(
    'allows keyboard tab travel through the message list without trapping focus',
    async () => {
      const view = render(<ChatCompositionHarness includeBeforeAfterButtons />);

      const beforeButton = screen.getByRole('button', { name: 'Before list' });
      const firstMessageAction = screen.getByTestId('message-action-c1-m1');
      const secondMessageAction = screen.getByTestId('message-action-c1-m2');
      const afterButton = screen.getByRole('button', { name: 'After list' });

      beforeButton.focus();

      await view.user.keyboard('{Tab}');
      expect(firstMessageAction).toHaveFocus();

      await view.user.keyboard('{Tab}');
      expect(secondMessageAction).toHaveFocus();

      await view.user.keyboard('{Tab}');
      expect(afterButton).toHaveFocus();
    },
  );

  it.skipIf(isJSDOM)(
    'moves focus to the composer input when a conversation switch unmounts the focused thread action',
    async () => {
      const handleRef = React.createRef<ChatCompositionHandle>();

      render(<ChatCompositionHarness ref={handleRef} />);

      const actionButton = screen.getByTestId('message-action-c1-m1');
      const composerInput = screen.getByTestId('composer-input');

      actionButton.focus();
      expect(actionButton).toHaveFocus();

      act(() => {
        handleRef.current!.switchConversation('c2');
      });

      await waitFor(() => {
        expect(screen.getByTestId('message-action-c2-m1')).not.to.equal(null);
        expect(composerInput).toHaveFocus();
      });
    },
  );

  it.skipIf(isJSDOM)(
    'preserves focused message actions across same-thread rerenders when the action stays mounted',
    async () => {
      const handleRef = React.createRef<ChatCompositionHandle>();

      render(<ChatCompositionHarness ref={handleRef} />);

      const actionButton = screen.getByTestId('message-action-c1-m1');
      actionButton.focus();

      act(() => {
        handleRef.current!.appendAssistantMessage();
      });

      await waitFor(() => {
        expect(screen.getByTestId('message-action-c1-m1')).toHaveFocus();
        expect(screen.getByRole('log')).to.contain.text('assistant:c1-m3');
      });
    },
  );

  it.skipIf(isJSDOM)('keeps keyboard focus behavior stable under rtl direction', async () => {
    const handleRef = React.createRef<ChatCompositionHandle>();
    const view = render(
      <div dir="rtl">
        <ChatCompositionHarness includeBeforeAfterButtons ref={handleRef} />
      </div>,
    );

    const beforeButton = screen.getByRole('button', { name: 'Before list' });
    const composerInput = screen.getByTestId('composer-input');

    beforeButton.focus();
    await view.user.keyboard('{Tab}');
    expect(screen.getByTestId('message-action-c1-m1')).toHaveFocus();

    act(() => {
      handleRef.current!.switchConversation('c2');
    });

    await waitFor(() => {
      expect(composerInput).toHaveFocus();
    });
  });

  it('keeps live region semantics for incoming thread content', async () => {
    const handleRef = React.createRef<ChatCompositionHandle>();

    render(<ChatCompositionHarness ref={handleRef} />);

    const log = screen.getByRole('log');

    expect(log).to.have.attribute('aria-live', 'polite');
    expect(log).to.contain.text('assistant:c1-m1');

    act(() => {
      handleRef.current!.appendAssistantMessage();
    });

    await waitFor(() => {
      expect(log).to.contain.text('assistant:c1-m3');
    });
  });

  it.skipIf(isJSDOM || !isChrome)(
    'passes an axe audit for the composed unstyled chat',
    async () => {
      render(<ChatCompositionHarness includeBeforeAfterButtons />);

      axe.configure({
        disableOtherRules: true,
        rules: [
          { id: 'aria-required-parent', enabled: true },
          { id: 'aria-required-children', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'aria-input-field-name', enabled: true },
        ],
      });

      const results = await axe.run(document.body);

      logViolations(results.violations);
      expect(results.violations.length).to.equal(0);
    },
  );
});
