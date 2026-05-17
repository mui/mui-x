---
productId: x-chat
title: Suggestions
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatSuggestions
---

# Chat - Suggestions

<p class="description">Display prompt suggestions in the empty state to help users get started with a conversation.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Interactive playground

Suggestions are clickable prompts that appear when the message list is empty.
Clicking a suggestion pre-fills the composer with the suggestion text, giving users a starting point for the conversation.

Edit the suggestion list and toggle layout options:

{{"demo": "ChatSuggestionsPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

## Implementing suggestions

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

## Customizing suggestion labels

For more control, pass `ChatSuggestion` objects instead of plain strings.
This lets you set a display label that differs from the value pre-filled into the composer:

{{"demo": "SuggestionsWithLabels.js", "defaultCodeOpen": false, "bg": "inline"}}

### Suggestion object structure

| Property | Type     | Description                                               |
| :------- | :------- | :-------------------------------------------------------- |
| `value`  | `string` | The value to pre-fill into the composer when clicked.     |
| `label`  | `string` | Optional display label. Falls back to `value` if omitted. |

You can mix strings and objects in the same array.
Strings are internally normalized to `{ value: string }`.

## Submitting suggestions automatically

By default, clicking a suggestion pre-fills the composer so users can review or edit before sending.
Set `suggestionsAutoSubmit` to automatically submit the message when a suggestion is clicked:

{{"demo": "AutoSubmitSuggestions.js", "defaultCodeOpen": false, "bg": "inline"}}

## Disabling suggestions

Disable suggestions through the `features` prop even when the `suggestions` prop is provided:

```tsx
<ChatBox
  adapter={adapter}
  suggestions={['What can you help me with?']}
  features={{ suggestions: false }}
/>
```

This is useful when you want to conditionally show suggestions based on application state without removing the prop itself.

## Dynamic suggestions

Compute `suggestions` dynamically because it's a standard React prop.
The example below loads user-specific suggestions after sign-in and updates them once available:

```tsx
function App() {
  const [suggestions, setSuggestions] = React.useState([
    'Get started',
    'View recent activity',
  ]);

  React.useEffect(() => {
    fetchUserSuggestions().then((personalized) => {
      setSuggestions(personalized);
    });
  }, []);

  return <ChatBox adapter={adapter} suggestions={suggestions} />;
}
```

Suggestions are only displayed in the empty state (when the message list has no messages), so dynamic updates only take effect before the first message is sent.

## Building a custom suggestions layout

When building a custom layout, use `ChatSuggestions` directly inside a `ChatRoot` provider:

```tsx
import { ChatSuggestions } from '@mui/x-chat';
import { ChatRoot } from '@mui/x-chat/headless';

<ChatRoot adapter={adapter}>
  <ChatSuggestions suggestions={['Option A', 'Option B']} autoSubmit={false} />
</ChatRoot>;
```

The component renders a `role="group"` container with `aria-label` derived from the locale text system.
Each suggestion renders as a `<button>` element.

### Slots

| Slot   | Default    | Description                     |
| :----- | :--------- | :------------------------------ |
| `root` | `'div'`    | The container element           |
| `item` | `'button'` | Each individual suggestion chip |

## See also

- See [Composer](/x/react-chat/basics/composer/) for details on how the pre-filled value flows into the text area.
- See [Adapter](/x/react-chat/backend/adapters/) for details on how submitted suggestions reach your backend.
