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

The date divider appears between messages whose `createdAt` values fall on different calendar days.
It is an opt-in feature: nothing renders until you enable it, and you can also embed the component directly in custom layouts.

## Enabling date dividers

Pass `features={{ dateDivider: true }}` to `ChatBox` (or to a standalone `ChatMessageList`) to render dividers at every day boundary:

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

:::info
Divider slot customizations only take effect while the feature is enabled—`slots.dateDivider` and `slotProps.dateDivider` have no effect without `features.dateDivider`.
:::

## Interactive playground

The demo below shows the date divider rendering between messages on different calendar days:

{{"demo": "ChatDateDividerPlayground.js", "bg": "inline", "defaultCodeOpen": false}}
