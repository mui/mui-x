---
productId: x-chat
title: Suggestions
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatSuggestions
---

# Chat - Suggestions

<p class="description">Display prompt suggestions in the empty state to help users get started with a conversation.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

Suggestions are clickable prompts that appear when the message list is empty.
Clicking a suggestion pre-fills the composer with the suggestion text, giving users a starting point for the conversation.

## Basic usage

Pass an array of strings to the `suggestions` prop on `ChatBox`:

```tsx
<ChatBox
  adapter={adapter}
  suggestions={[
    'What can you help me with?',
    'Summarize my latest report',
    'Write a follow-up email',
  ]}
/>
```

Suggestions are hidden once the first message appears in the conversation.

## `ChatSuggestion` objects

For more control, pass `ChatSuggestion` objects instead of plain strings.
This lets you set a display label that differs from the value pre-filled into the composer:

```tsx
<ChatBox
  adapter={adapter}
  suggestions={[
    { value: 'Help me write a professional email to my manager about taking PTO next week', label: 'Write an email' },
    { value: 'Summarize the key points from my Q4 performance review', label: 'Summarize a document' },
    { value: 'What are the best practices for React state management in 2026?', label: 'Ask a question' },
  ]}
/>
```

### `ChatSuggestion` type

| Property | Type     | Description                                                   |
| :------- | :------- | :------------------------------------------------------------ |
| `value`  | `string` | The value to pre-fill into the composer when clicked.         |
| `label`  | `string` | Optional display label. Falls back to `value` if omitted.     |

You can mix strings and objects in the same array.
Strings are internally normalized to `{ value: string }`.

## Auto-submit

By default, clicking a suggestion only pre-fills the composer so the user can review or edit before sending.
Set `suggestionsAutoSubmit` to automatically submit the message when a suggestion is clicked:

```tsx
<ChatBox
  adapter={adapter}
  suggestions={['What can you help me with?', 'Tell me a joke']}
  suggestionsAutoSubmit
/>
```

## Disabling suggestions

Even when the `suggestions` prop is provided, you can disable the feature through the `features` prop:

```tsx
<ChatBox
  adapter={adapter}
  suggestions={['What can you help me with?']}
  features={{ suggestions: false }}
/>
```

This is useful when you want to conditionally show suggestions based on application state without removing the prop itself.

## Dynamic suggestions

Since `suggestions` is a standard React prop, you can compute it dynamically:

```tsx
function App() {
  const [suggestions, setSuggestions] = React.useState([
    'Get started',
    'View recent activity',
  ]);

  return (
    <ChatBox
      adapter={adapter}
      suggestions={suggestions}
    />
  );
}
```

Suggestions are only displayed in the empty state (when the message list has no messages), so dynamic updates only take effect before the first message is sent.

## The `ChatSuggestions` component

When building a custom layout, use `ChatSuggestions` directly inside a `ChatRoot` provider:

```tsx
import { ChatSuggestions } from '@mui/x-chat';

<ChatSuggestions
  suggestions={['Option A', 'Option B']}
  autoSubmit={false}
/>
```

The component renders a `role="group"` container with `aria-label` derived from the locale text system.
Each suggestion renders as a `<button>` element.

### Slots

| Slot   | Default    | Description                      |
| :----- | :--------- | :------------------------------- |
| `root` | `'div'`    | The container element            |
| `item` | `'button'` | Each individual suggestion chip  |

## API

- [`ChatSuggestions`](/x/api/chat/chat-suggestions/)

## See also

- [Composer](/x/react-chat/basics/composer/) for how the pre-filled value flows into the text area.
- [Adapter](/x/react-chat/backend/adapters/) for how submitted suggestions reach your backend.
