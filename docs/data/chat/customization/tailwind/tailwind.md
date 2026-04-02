---
productId: x-chat
title: Tailwind CSS
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatRoot
---

# Chat - Tailwind CSS

<p class="description">Style chat components using Tailwind CSS utility classes with the unstyled primitives from <code>@mui/x-chat/unstyled</code>.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

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
{/* The send button sets data-disabled when the composer is empty or streaming */}
<Composer.SendButton className="bg-blue-600 text-white data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed" />;

{/* Message root sets data-author="self" or data-author="other" */}
<Message.Root className="flex gap-3 data-[author=self]:flex-row-reverse" />;

{/* Typing indicator sets data-visible when the assistant is responding */}
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

## When to use unstyled vs. styled

| Scenario                                      | Recommendation                                 |
| :-------------------------------------------- | :--------------------------------------------- |
| Material UI project, minimal customization    | Use `@mui/x-chat` (styled)                     |
| Material UI project, heavy slot customization | Use `@mui/x-chat` with `slots` and `slotProps` |
| Tailwind CSS project                          | Use `@mui/x-chat/unstyled` + Tailwind classes  |
| Custom design system / CSS Modules            | Use `@mui/x-chat/unstyled`                     |
| Headless state only, fully custom rendering   | Use `@mui/x-chat/headless` hooks               |

## API

## See also

- [Unstyled Components](/x/react-chat/customization/unstyled/) for the full unstyled layer overview.
- [Headless Hooks](/x/react-chat/customization/headless/) for building fully custom UIs with hooks only.
- [Styling](/x/react-chat/customization/styling/) for Material UI theme-based customization.
