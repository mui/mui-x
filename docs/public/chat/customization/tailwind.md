---
productId: x-chat
title: Tailwind CSS
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatRoot
---

# Chat - Tailwind CSS

<p class="description">Style chat components using Tailwind CSS utility classes with the structural primitives from <code>@mui/x-chat</code>.</p>

The chat primitives ship structural components with zero built-in styles.
Each component renders semantic HTML elements with `data-*` attributes that reflect component state, making them a natural fit for Tailwind CSS utility classes.

## Installation

Install the package alongside Tailwind:

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

## Namespace API

Structural primitives are available as namespace exports for clean dot-notation usage:

```tsx
import {
  Chat,
  Composer,
  Message,
  MessageList,
  Conversation,
  ConversationList,
  Indicators,
} from '@mui/x-chat-headless';

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

Pass `className` to any structural primitive:

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

Every structural primitive exposes `data-*` attributes that reflect its current state.
Use Tailwind's attribute selectors to style state variations without JavaScript:

```tsx
{
  /* The send button sets data-disabled when the composer has the disabled prop */
}
<Composer.SendButton className="bg-blue-600 text-white data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed" />;

{
  /* Message root sets data-role="user" or data-role="assistant" */
}
<Message.Root className="flex gap-3 data-[role=user]:flex-row-reverse" />;

{
  /* Typing indicator sets data-count when users are typing; returns null when count=0 */
}
<Indicators.TypingIndicator className="flex items-center gap-1 text-sm text-gray-500" />;
```

### Common data attributes

| Component               | Attribute           | Values                                                                                | Description                      |
| :---------------------- | :------------------ | :------------------------------------------------------------------------------------ | :------------------------------- |
| `Message.Root`          | `data-role`         | `"user"`, `"assistant"`                                                               | Message sender role              |
| `Message.Root`          | `data-status`       | `"pending"`, `"sending"`, `"streaming"`, `"sent"`, `"read"`, `"error"`, `"cancelled"` | Message delivery status          |
| `Composer.SendButton`   | `data-disabled`     | present / absent                                                                      | Composer has the `disabled` prop |
| `Composer.Root`         | `data-is-streaming` | present / absent                                                                      | Response in progress             |
| `ConversationList.Item` | `data-selected`     | present / absent                                                                      | Currently selected conversation  |

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

## See also

- [Styling](/x/react-chat/customization/styling/) for Material UI theme-based customization.
- [Slots & Composition](/x/react-chat/customization/slots-and-composition/) for replacing sub-components entirely.
