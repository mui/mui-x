---
productId: x-chat
title: Suggestions
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatSuggestions
---

# Chat - Suggestions

<p class="description">Display prompt suggestions that help users start a conversation or pick their next prompt.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Interactive playground

Suggestions are clickable prompts.
While the conversation is empty they appear as centered pills in the message area; once it has messages, `ChatBox` keeps them as a scrollable row above the composer.
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

While the conversation is empty, suggestions render as centered pills in the message area.
Once the first message appears, `ChatBox` moves them to a row above the composer — see [Suggestions in active conversations](#suggestions-in-active-conversations).

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

## Suggestions in active conversations

When the conversation already has messages, `ChatBox` keeps the suggestions visible as a horizontal, scrollable row above the composer — useful for offering follow-up prompts.

{{"demo": "SuggestionsAboveComposer.js", "defaultCodeOpen": false, "bg": "inline"}}

`ChatBox` switches between the two placements automatically and has no `alwaysVisible` prop.
When composing a custom layout with the standalone `ChatSuggestions` component, suggestions only render while the thread is empty by default — set `alwaysVisible` to render them regardless of message count:

```tsx
<ChatRoot adapter={adapter}>
  {/* ...message list and composer... */}
  <ChatSuggestions
    suggestions={['Refine the answer', 'Give an example']}
    alwaysVisible
  />
</ChatRoot>
```

:::info
When you provide a custom `emptyState` slot, `ChatBox` also renders the suggestions above the composer in the empty state, leaving the message area to your slot.
:::

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

Because `suggestions` is a standard React prop, you can compute it dynamically.
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

Updates to the array apply in both placements: the centered empty-state pills and the above-composer row both re-render with the new suggestions.

## Building a custom suggestions layout

When building a custom layout, use `ChatSuggestions` directly inside a `ChatRoot` provider:

```tsx
import { ChatSuggestions } from '@mui/x-chat';
import { ChatRoot } from '@mui/x-chat/headless';

<ChatRoot adapter={adapter}>
  <ChatSuggestions suggestions={['Option A', 'Option B']} autoSubmit={false} />
</ChatRoot>;
```

The component renders a `role="group"` container with a localizable `aria-label` (locale key `suggestionsLabel`, default "Suggested prompts").
Each suggestion is a regular `<button>` in the Tab order — activate it with <kbd>Enter</kbd> or <kbd>Space</kbd>.
For the chat-wide keyboard model, see the [Message List keyboard navigation](/x/react-chat/material/message-list/#keyboard-navigation) section.

To take over item rendering entirely, pass `children` instead of the `suggestions` prop — when `children` are provided, `suggestions` is ignored and the component only contributes the group container and selection context.

```tsx
<ChatSuggestions>
  <MyCustomSuggestionButton value="Option A" />
  <MyCustomSuggestionButton value="Option B" />
</ChatSuggestions>
```

### Slots

| Slot   | Default    | Description                     |
| :----- | :--------- | :------------------------------ |
| `root` | `'div'`    | The container element           |
| `item` | `'button'` | Each individual suggestion chip |

## See also

- See [Composer](/x/react-chat/basics/composer/) for details on how the pre-filled value flows into the text area.
- See [Adapter](/x/react-chat/backend/adapters/) for details on how submitted suggestions reach your backend.
