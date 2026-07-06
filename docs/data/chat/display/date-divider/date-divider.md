---
productId: x-chat
title: Date divider
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatDateDivider
---

# Chat - Date divider

<p class="description">Group messages by day with inline separators inside the chat thread.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Overview

Date dividers help users orient themselves in long conversations that span multiple days by grouping messages under a day label.
The date divider appears between messages whose `createdAt` values fall on different calendar days.
It is an opt-in feature: nothing renders until you enable it, and you can also embed the component directly in custom layouts.

:::info
A divider appears above a message only when its `createdAt` falls on a different **UTC calendar day** than the previous message's. The first message in a thread never gets a divider, and single-day conversations render no dividers at all — the component returns nothing rather than an empty rule.

Note that the boundary uses the UTC day while the default label is formatted with the viewer's locale. Use a custom `formatDate` to control the label, or override the placement rule itself with `shouldShowDivider` — see [Customizing divider placement](#customizing-divider-placement).

The divider renders with `role="separator"`, so assistive technology announces the day boundary without treating it as message content — see the [Accessibility](/x/react-chat/accessibility/) page for the full model.

When embedding `ChatDateDivider` directly, pass the `messageId` it should evaluate; `index` and `items` are optional and default to the message's position in the active conversation.
:::

## Enabling date dividers

Pass `features={{ dateDivider: true }}` to `ChatBox` (or to a standalone [`ChatMessageList`](/x/react-chat/basics/messages/)) to render dividers at every day boundary:

```tsx
<ChatBox adapter={adapter} features={{ dateDivider: true }} />
```

Once enabled, customize the rendered component with the `dateDivider` slot and forward props (such as a custom `formatDate`) through `slotProps.dateDivider`:

```tsx
<ChatBox
  adapter={adapter}
  features={{ dateDivider: true }}
  slotProps={{
    dateDivider: {
      formatDate: (date) =>
        date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    },
  }}
/>
```

`formatDate` receives a native `Date` (the message's `createdAt`) and can return any `ReactNode`. When omitted, the label defaults to `date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })` — for example _May 3, 2026_ in an `en-US` locale.

:::info
Divider slot customizations only take effect while the feature is enabled. Without `features.dateDivider`, `slots.dateDivider` and `slotProps.dateDivider` have no effect.
:::

The demo below enables the feature on a conversation spanning three days — a divider appears at each day boundary:

{{"demo": "../../material/message-list/DateDividerFormat.js", "bg": "inline", "defaultCodeOpen": false}}

## Customizing divider placement

By default a divider renders above a message whose `createdAt` falls on a different UTC calendar day than the previous message's (see [Overview](#overview)).
To group messages differently, pass a `shouldShowDivider` predicate through `slotProps.dateDivider`.
It receives `{ message, previousMessage, index, date, previousDate }` — where `date`/`previousDate` are the parsed `createdAt` values (`null` when missing or invalid) — and returns `true` to render a divider above the message.

### Divider by week

This recipe groups messages by ISO week instead of by day, labeling each group with the Monday that starts it:

```ts
function startOfWeekIso(date: Date) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); // back to Monday
  return d.toISOString().slice(0, 10);
}

const shouldShowDivider = ({ date, previousDate }) =>
  date != null &&
  previousDate != null &&
  startOfWeekIso(date) !== startOfWeekIso(previousDate);
```

{{"demo": "DateDividerByWeek.js", "bg": "inline", "defaultCodeOpen": false}}

### Divider every N messages

The predicate can ignore dates entirely. This rule inserts a divider every five messages:

```tsx
<ChatBox
  adapter={adapter}
  features={{ dateDivider: true }}
  slotProps={{
    dateDivider: {
      shouldShowDivider: ({ index }) => index > 0 && index % 5 === 0,
    },
  }}
/>
```

The label still derives from each message's own `createdAt`, so pair the predicate with a custom `formatDate` to relabel it.
When a message has no `createdAt`, its label renders empty — guard for that case in the predicate (or in `formatDate`) if your data can omit timestamps.

The same hook supports any rule: for example, group by the viewer's **local** day instead of the default UTC day by comparing local-date strings inside the predicate.

## Interactive playground

The playground below renders the divider between two messages and lets you change `formatDate` and the second message's `createdAt`:

{{"demo": "ChatDateDividerPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

## See also

- [Unread marker](/x/react-chat/display/unread-marker/) — the other opt-in inline separator.
- [Structure](/x/react-chat/customization/structure/) — the slot reference, including the `dateDivider` slot row.
- [Messages](/x/react-chat/basics/messages/) — feature flags on the message list.
