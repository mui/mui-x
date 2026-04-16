import * as React from 'react';
import clsx from 'clsx';
import { TailwindDemoContainer } from '@mui/x-data-grid/internals';
import {
  Chat,
  Composer,
  Message,
  MessageList,
  Indicators,
} from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter({
  respond: (text) =>
    `Received: "${text}". This response is styled with Tailwind CSS utility classes.`,
});

function TailwindMessage({ id }: { id: string }) {
  return (
    <Message.Root
      messageId={id}
      className={clsx(
        // The group/msg class lets children style themselves based on the
        // parent's data-* attributes using `group-data-[…]/msg:` variants.
        'group/msg flex gap-3 px-4 py-1.5',
        'data-[role=user]:flex-row-reverse',
      )}
    >
      <Message.Avatar
        className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700"
        slotProps={{
          image: { className: 'h-full w-full object-cover' },
        }}
      />
      <Message.Content
        className="max-w-[75%] min-w-0"
        slotProps={{
          bubble: {
            className: clsx(
              'rounded-2xl px-4 py-2 text-sm leading-relaxed break-words',
              // User messages: blue bubble with white text
              'group-data-[role=user]/msg:bg-blue-600 group-data-[role=user]/msg:text-white',
              // Assistant messages
              'group-data-[role=assistant]/msg:bg-gray-100 group-data-[role=assistant]/msg:text-gray-900',
              'dark:group-data-[role=assistant]/msg:bg-gray-800 dark:group-data-[role=assistant]/msg:text-gray-100',
            ),
          },
        }}
      />
    </Message.Root>
  );
}

export default function TailwindChatDemo({ window }: { window?: () => Window }) {
  // This is used only for the example, you can remove it.
  const documentBody = window !== undefined ? window().document.body : undefined;

  return (
    <div style={{ height: 500, width: '100%' }}>
      <TailwindDemoContainer documentBody={documentBody}>
        <Chat.Root
          adapter={adapter}
          initialActiveConversationId={minimalConversation.id}
          initialConversations={[minimalConversation]}
          initialMessages={minimalMessages}
          className="flex h-full flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden"
        >
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Tailwind Chat
            </span>
          </div>

          <MessageList.Root
            slots={{
              messageList: 'div',
              messageListScroller: 'div',
            }}
            slotProps={{
              messageList: {
                className: 'flex-1 min-h-0 overflow-hidden relative',
              },
              messageListScroller: {
                className: 'h-full overflow-y-auto overflow-x-hidden',
              },
              messageListContent: {
                className: 'flex flex-col gap-1 py-3',
              },
            }}
            renderItem={({ id }) => <TailwindMessage key={id} id={id} />}
          />

          <Indicators.TypingIndicator className="hidden data-[visible]:flex items-center gap-1.5 px-4 py-1.5 text-xs text-gray-400 dark:text-gray-500" />

          <Composer.Root className="flex flex-col gap-2 border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
            <Composer.TextArea
              className={clsx(
                'resize-none rounded-lg border border-gray-300 dark:border-gray-600',
                'bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100',
                'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              )}
              placeholder="Type a message..."
            />
            <Composer.Toolbar className="flex items-center justify-end">
              <Composer.SendButton
                className={clsx(
                  'rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white',
                  'hover:bg-blue-700 active:bg-blue-800',
                  'disabled:opacity-40 disabled:cursor-not-allowed',
                  'transition-colors',
                )}
              >
                Send
              </Composer.SendButton>
            </Composer.Toolbar>
          </Composer.Root>
        </Chat.Root>
      </TailwindDemoContainer>
    </div>
  );
}
