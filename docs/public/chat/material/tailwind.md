---
productId: x-chat
title: Chat - Tailwind CSS
packageName: '@mui/x-chat/unstyled'
githubLabel: 'scope: chat'
---

# Chat - Tailwind CSS

<p class="description">Style chat components using Tailwind CSS utility classes with the unstyled primitives from <code>@mui/x-chat/unstyled</code>.</p>

The unstyled layer (`@mui/x-chat/unstyled`) ships structural chat primitives with zero built-in styles.
Each component renders semantic HTML elements with `data-*` attributes that reflect component state, making them a natural fit for Tailwind CSS utility classes.

## Installation

Install the unstyled package alongside Tailwind:

<codeblock storageKey="package-manager">

```bash npm
npm install @mui/x-chat
```

```bash pnpm
pnpm add @mui/x-chat
```

```bash yarn
yarn add @mui/x-chat
```

</codeblock>

:::info
`@mui/x-chat/unstyled` is a subpath export of the main `@mui/x-chat` package. No separate package install is needed.
:::

## Namespace API

Unstyled components are available as namespace exports for clean dot-notation usage:

```tsx
import {
  Chat,
  Composer,
  Message,
  MessageList,
  Conversation,
  ConversationList,
  Indicators,
} from '@mui/x-chat/unstyled';

// Usage
<Chat.Root>
  <Chat.Layout>
    <MessageList.Root renderItem={...} />
    <Composer.Root>
      <Composer.TextArea />
      <Composer.Toolbar>
        <Composer.AttachButton />
        <Composer.SendButton />
      </Composer.Toolbar>
    </Composer.Root>
  </Chat.Layout>
</Chat.Root>
```

## Applying Tailwind classes

Pass `className` to any unstyled component:

```tsx
<Composer.Root className="flex flex-col gap-1 border-t border-gray-200 p-3 bg-white">
  <Composer.TextArea
    className="resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <Composer.Toolbar className="flex items-center justify-end gap-2">
    <Composer.AttachButton className="rounded p-1.5 text-gray-500 hover:bg-gray-100" />
    <Composer.SendButton
      className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white
                 hover:bg-blue-700 disabled:opacity-40"
    />
  </Composer.Toolbar>
</Composer.Root>
```

## Data attributes

Every unstyled component exposes `data-*` attributes that reflect its current state.
Use Tailwind's attribute selectors to style state variations without JavaScript:

```tsx
{
  /* The send button sets data-disabled when the composer is empty or streaming */
}
<Composer.SendButton className="bg-blue-600 text-white data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed" />;

{
  /* Message root sets data-author="self" or data-author="other" */
}
<Message.Root className="flex gap-3 data-[author=self]:flex-row-reverse" />;

{
  /* Typing indicator sets data-visible when the assistant is responding */
}
<Indicators.TypingIndicator className="hidden data-[visible]:flex items-center gap-1 text-sm text-gray-500" />;
```

### Common data attributes

| Component               | Attribute        | Values                           | Description                         |
| :---------------------- | :--------------- | :------------------------------- | :---------------------------------- |
| `Message.Root`          | `data-author`    | `"self"`, `"other"`              | Current user vs. other participants |
| `Message.Root`          | `data-status`    | `"sending"`, `"sent"`, `"error"` | Message delivery status             |
| `Composer.SendButton`   | `data-disabled`  | present / absent                 | Empty input or streaming            |
| `Composer.Root`         | `data-streaming` | present / absent                 | Response in progress                |
| `ConversationList.Item` | `data-active`    | present / absent                 | Currently selected conversation     |

## Slot props for custom elements

Use the `slots` and `slotProps` props to replace inner elements while keeping behavior intact:

```tsx
<MessageList.Root
  slots={{
    messageListContent: 'div',
  }}
  slotProps={{
    messageListContent: {
      className: 'flex flex-col gap-2 p-4',
    },
  }}
  renderItem={({ id }) => <MyMessage key={id} id={id} />}
/>
```

## Complete demo: chat shell

The following interactive demo shows a fully functional chat styled entirely with Tailwind CSS utility classes, using the unstyled primitives from `@mui/x-chat/unstyled`:

```tsx
import * as React from 'react';
import clsx from 'clsx';
import { TailwindDemoContainer } from '@mui/x-data-grid/internals';
import {
  Chat,
  Composer,
  Message,
  MessageList,
  Indicators,
} from '@mui/x-chat/unstyled';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import { minimalConversation, minimalMessages } from 'docsx/data/chat/material/examples/shared/demoData';

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

```

## When to use unstyled vs. styled

| Scenario                                      | Recommendation                                 |
| :-------------------------------------------- | :--------------------------------------------- |
| Material UI project, minimal customization    | Use `@mui/x-chat` (styled)                     |
| Material UI project, heavy slot customization | Use `@mui/x-chat` with `slots` and `slotProps` |
| Tailwind CSS project                          | Use `@mui/x-chat/unstyled` + Tailwind classes  |
| Custom design system / CSS Modules            | Use `@mui/x-chat/unstyled`                     |
| Headless state only, fully custom rendering   | Use `@mui/x-chat/headless` hooks               |

## API

- [ChatRoot](/x/api/chat/chat-root/)
