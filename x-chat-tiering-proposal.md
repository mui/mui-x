# MUI X Chat — Tiering Proposal

## Overview

This document proposes a feature distribution strategy for `@mui/x-chat` across three commercial tiers: **Community (MIT)**, **Pro**, and **Premium**. The proposal follows established MUI X tiering conventions (as seen in Data Grid, Charts, Tree View) and is informed by an audit of all current x-chat capabilities plus suggested new features.

### Guiding Principles

| Principle                             | Description                                                                                                                                                                                  |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Community = table stakes**          | Features every chat UI needs. What open-source competitors offer for free. Enough to ship a simple AI chatbot or support widget.                                                             |
| **Pro = professional apps**           | Advanced capabilities needed by production SaaS products: multi-conversation management, file handling, real-time collaboration, and AI tool integration. Covers ~80% of business use cases. |
| **Premium = enterprise & power-user** | Niche, high-value features: extensible message types, advanced AI orchestration, analytics, moderation, and collaborative workflows.                                                         |

### Proposed Package Structure

```
@mui/x-chat-headless          (MIT)        — Core logic, adapters, store
@mui/x-chat-unstyled          (MIT)        — Unstyled composable components
@mui/x-chat                   (MIT)        — Material Design styled components

@mui/x-chat-headless-pro      (Commercial) — Pro logic extensions
@mui/x-chat-unstyled-pro      (Commercial) — Pro unstyled components
@mui/x-chat-pro               (Commercial) — Pro styled components

@mui/x-chat-headless-premium  (Commercial) — Premium logic extensions
@mui/x-chat-unstyled-premium  (Commercial) — Premium unstyled components
@mui/x-chat-premium           (Commercial) — Premium styled components
```

> Dependency chain: Premium → Pro → Community (mirroring Data Grid's pattern).

---

## Tier Breakdown

### Community (MIT) — Free

> _"Everything you need to ship a basic AI chat or support widget."_

These are foundational features that already exist (or are trivially derived from the current codebase). They make the library usable out of the box and competitive with open-source alternatives like `ai-chatbot`, `chatscope`, or Vercel's AI SDK UI.

| Feature                      | Status | Description                                                                                                                                                                                     |
| ---------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Text messaging**           | Exists | Send and receive text messages with full streaming support (text deltas, buffering, batched flushing).                                                                                          |
| **ChatBox component**        | Exists | One-liner high-level component that composes all sub-components with Material Design styling.                                                                                                   |
| **ChatProvider**             | Exists | Root context provider wiring adapter, store, and callbacks.                                                                                                                                     |
| **Composer**                 | Exists | Text area input with send button, helper text, label. Handles submit-on-enter, disabled states, and streaming-aware UX.                                                                         |
| **Message list**             | Exists | Renders messages with auto-scroll behavior (configurable buffer). Includes date dividers.                                                                                                       |
| **Message display**          | Exists | Renders individual messages with avatar, author label, content, metadata (timestamps), and role-based styling.                                                                                  |
| **Message grouping**         | Exists | Groups consecutive messages from the same author (same-sender bubbles).                                                                                                                         |
| **Streaming**                | Exists | First-class streaming via `ReadableStream` chunks: `text-start`, `text-delta`, `text-end`, `finish`. Batched flushing at 16ms intervals.                                                        |
| **ChatAdapter interface**    | Exists | `sendMessage()` required method. Clean contract for backend integration.                                                                                                                        |
| **Store & selectors**        | Exists | Centralized `ChatStore` with memoized selectors (`selectMessages`, `selectIsStreaming`, etc.).                                                                                                  |
| **Core hooks**               | Exists | `useChat()`, `useChatComposer()`, `useChatStatus()`, `useChatStore()`.                                                                                                                          |
| **Single conversation**      | Exists | View and interact with one conversation at a time (no multi-conversation switching).                                                                                                            |
| **Slot-based customization** | Exists | Every sub-component replaceable via `slots` / `slotProps` pattern.                                                                                                                              |
| **Variants**                 | Exists | `'default'` (full layout) and `'compact'` (messenger-style) variants.                                                                                                                           |
| **Localization (i18n)**      | Exists | Locale context with `enUS` template. All UI strings customizable.                                                                                                                               |
| **Theme augmentation**       | Exists | Full MUI Material theme integration (`components`, `overrides`, `props`).                                                                                                                       |
| **CSS class system**         | Exists | `chatBoxClasses`, per-component class utilities for styling hooks.                                                                                                                              |
| **Suggestions**              | Exists | Prompt suggestion chips (`SuggestionsRoot`, `SuggestionItem`).                                                                                                                                  |
| **Code blocks**              | Exists | `ChatCodeBlock` component for rendering code with syntax context.                                                                                                                               |
| **Loading skeletons**        | Exists | `ChatMessageSkeleton` for loading states.                                                                                                                                                       |
| **Error handling**           | Exists | `ChatStreamError`, error states on messages, `onError` callback.                                                                                                                                |
| **Tool calls display**       | Exists | `ToolPart` component, `ChatToolMessagePart` with basic states (`input-streaming`, `input-available`, `output-available`, `output-error`). Shows what tools the AI is calling and their results. |
| **Reasoning display**        | Exists | `ReasoningPart` component, `ChatReasoningMessagePart` with streaming state. Shows AI "thinking" process (chain-of-thought).                                                                     |
| **Source references**        | Exists | `SourceUrlPart`, `SourceDocumentPart`, `ChatMessageSources` — renders citation links and document references from RAG pipelines.                                                                |

#### Why these are Community

- **They're expected for free.** No developer will pay for basic text chat — open-source alternatives cover this.
- **They drive adoption.** A strong free tier builds community, ecosystem, and pipeline to paid tiers.
- **They're already built.** All of the above exist today in the current MIT-licensed packages.
- **AI chat is the primary use case.** Tool calls, reasoning, and source references are fundamental to AI chat UX — gating them behind a paywall would severely limit Community adoption for the product's core audience.

---

### Pro (Commercial License)

> _"Production-ready chat for SaaS products: multi-conversation, file attachments, real-time collaboration, and AI tool approval workflows."_

These features transform a basic chatbot into a professional communication platform. They require more sophisticated backend integration (adapter methods) and address the needs of products like customer support platforms, team collaboration tools, and AI assistant interfaces.

#### Existing Features to Move to Pro

| Feature                          | Status | Description                                                                                                                                                                                     | Justification                                                                                                                                                                                         |
| -------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **File attachments**             | Exists | `ComposerAttachButton`, `ComposerAttachmentList`, `ChatDraftAttachment` with upload progress tracking, preview URLs, and `ChatFileMessagePart` rendering.                                       | File handling adds significant complexity (upload management, preview generation, MIME type handling). Competitors like Intercom and Zendesk charge for this.                                         |
| **Multi-conversation**           | Exists | `ConversationListRoot`, `ConversationListItem`, conversation switching, `listConversations()` adapter method, `selectConversations` selectors, `activeConversationId` management.               | Single-conversation is free; managing multiple conversations (inbox-style) is a professional workflow. Data Grid analogy: single table is free, master-detail is Pro.                                 |
| **Message history loading**      | Exists | `loadMoreHistory()`, `hasMoreHistory` state, `listMessages()` adapter method with cursor-based pagination.                                                                                      | Infinite scroll / paginated history requires server-side cursor management. Basic chat shows only the current session.                                                                                |
| **Real-time: typing indicators** | Exists | `TypingIndicator` component, `setTyping()` adapter method, `selectTypingUserIds` selector, `typingByConversation` state.                                                                        | Real-time presence is a premium collaboration feature requiring WebSocket infrastructure.                                                                                                             |
| **Real-time: unread tracking**   | Exists | `UnreadMarker` component, `ConversationListUnreadBadge`, `unreadCount` on conversations, `markRead()` adapter method, `readState`.                                                              | Unread management requires server-side tracking and real-time sync.                                                                                                                                   |
| **Real-time: subscribe**         | Exists | `subscribe()` adapter method returning cleanup function for real-time event streams.                                                                                                            | The infrastructure for push-based updates (WebSockets, SSE) is an advanced integration.                                                                                                               |
| **Tool approval workflow**       | Exists | `approval-requested` / `approval-responded` tool states, `addToolApprovalResponse()` method, human-in-the-loop confirmation for AI tool execution.                                              | Builds on the Community tool display with interactive approval gates. Professional AI products need governance over which tool actions the AI can take autonomously vs. which require human sign-off. |
| **Message actions**              | Exists | `MessageActions`, `MessageActionsMenu` — contextual actions on messages (copy, etc.).                                                                                                           | Action menus add UX polish expected in professional products.                                                                                                                                         |
| **Presence indicators**          | New    | Show online/offline/away/busy status for conversation participants. `ChatUser.isOnline` already exists — build real-time presence UI with status dots, last-seen timestamps, and away messages. | Natural extension of the real-time feature set (typing, unread, subscribe). All real-time collaboration features belong in the same tier.                                                             |
| **Scroll-to-bottom**             | Exists | `ScrollToBottomAffordance` component — floating button when user scrolls up.                                                                                                                    | Small but professional UX feature that enhances long conversation usability.                                                                                                                          |
| **Confirmation dialogs**         | Exists | `ChatConfirmation` component for confirming destructive or important actions.                                                                                                                   | Professional workflow feature (e.g., "Are you sure you want to delete this conversation?").                                                                                                           |
| **Conversation header**          | Exists | `ConversationHeader`, `ConversationTitle`, `ConversationSubtitle` — header bar with conversation metadata.                                                                                      | Part of the multi-conversation professional layout.                                                                                                                                                   |

#### New Features to Build for Pro

| Feature                      | Status | Description                                                                                                                                                                                                                                                                                                                                          | Justification                                                                                                                                                                                    |
| ---------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Virtualized message list** | New    | Opt-in virtualization via `features={{ virtualization: {} }}`. Renders only visible messages in the DOM (similar to Data Grid's row virtualization). Critical for conversations with thousands of messages. Activated explicitly rather than automatically, giving developers control over the trade-off between rendering fidelity and performance. | Performance optimization for production apps. Data Grid Pro has virtualization as a core Pro feature. Chat histories can grow unbounded — virtualization prevents DOM bloat and janky scrolling. |
| **Message search**           | New    | Search through message history with keyword highlighting and jump-to-message navigation. Adapter method: `searchMessages(query)`.                                                                                                                                                                                                                    | Essential for professional support/collaboration tools. Users need to find past messages in long histories. Slack, Teams, and Intercom all offer this.                                           |
| **Keyboard shortcuts**       | New    | Configurable keyboard shortcuts for common actions: send message (`Cmd+Enter`), new conversation (`Cmd+N`), search (`Cmd+F`), navigate conversations (`Cmd+↑/↓`).                                                                                                                                                                                    | Power-user productivity feature expected in professional tools.                                                                                                                                  |
| **Markdown rendering**       | New    | Out-of-the-box Markdown support in messages: bold, italic, lists, tables, links, images, headings. With sanitization for security. Community users can achieve Markdown rendering by overriding the message content slot with their own renderer — Pro provides it built-in so teams don't have to wire it up themselves.                            | AI assistants frequently respond in Markdown. Community gives the escape hatch (slot override); Pro gives the polished, zero-config experience.                                                  |
| **Message editing**          | New    | Edit sent messages with edit history tracking. Adapter method: `editMessage(id, newContent)`. Shows "edited" badge with `editedAt` timestamp (field already exists on `ChatMessage`).                                                                                                                                                                | Standard feature in Slack, Teams, Discord. Professional communication requires the ability to correct mistakes.                                                                                  |
| **Message deletion**         | New    | Soft-delete messages with adapter method: `deleteMessage(id)`. Visual indicator for deleted messages ("This message was deleted").                                                                                                                                                                                                                   | Professional moderation and privacy feature. Required for compliance in many industries.                                                                                                         |
| **Read receipts**            | New    | Per-message delivery and read status indicators (sent → delivered → read). Extends `ChatMessage.status` with `'delivered'` and `'read'` states.                                                                                                                                                                                                      | Professional communication feature (WhatsApp, iMessage pattern). Critical for customer support to know if messages were seen.                                                                    |
| **Drag & drop file upload**  | New    | Drop zone overlay on the message list area for drag-and-drop file attachment. Visual feedback during drag-over.                                                                                                                                                                                                                                      | UX enhancement for file attachments. Expected in modern professional chat interfaces.                                                                                                            |
| **Clipboard paste upload**   | New    | Paste images and files directly from clipboard into the composer. Auto-creates attachment from clipboard data.                                                                                                                                                                                                                                       | Power-user feature that significantly improves productivity. Standard in Slack, Discord, Teams.                                                                                                  |
| **Retry & regenerate**       | New    | Retry failed messages and regenerate AI responses. `retry()` method exists on `useChat()` — build UI affordances (retry button on error messages, regenerate button on AI messages).                                                                                                                                                                 | Essential for AI chat products where responses may fail or be unsatisfactory.                                                                                                                    |

---

### Premium (Commercial License)

> _"Enterprise-grade chat: custom message types, AI agent orchestration, analytics, moderation, and collaborative workflows."_

Premium features serve large organizations and power users who need extensibility, compliance, and advanced AI workflows. These are high-value, niche capabilities that justify Premium pricing.

#### Existing Features to Move to Premium

| Feature                      | Status | Description                                                                                                                                                                                    | Justification                                                                                                                                     |
| ---------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dynamic tool definitions** | Exists | `ChatDynamicToolMessagePart` — tools defined at runtime rather than statically. Allows AI to discover and use tools dynamically.                                                               | Advanced AI agent orchestration pattern. Only needed by sophisticated AI platforms, not typical chat apps.                                        |
| **Custom data parts**        | Exists | `ChatDataMessagePart` with `data-*` type pattern, `ChatDataPartMap` type augmentation, `onData` callback, `transient` flag for ephemeral data.                                                 | Enterprise integration feature: inject custom structured data into the message stream for dashboards, live updates, etc.                          |
| **Type augmentation system** | Exists | `ChatCustomMessagePartMap`, `ChatUserMetadata`, `ChatConversationMetadata`, `ChatMessageMetadata`, `ChatToolDefinitionMap`, `ChatDataPartMap` — extend all core types via declaration merging. | Enterprise extensibility: allows organizations to add domain-specific types without forking. The extensibility framework itself is Premium value. |

#### New Features to Build for Premium

| Feature                                            | Status | Description                                                                                                                                                                                                                                                | Justification                                                                                                                                                                                                                           |
| -------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Custom message types (Polls, Cards, Carousels)** | New    | Extensible message part system for rich interactive content: polls (vote on options), cards (structured data with actions), carousels (swipeable content), forms (inline data collection). Leverages the existing `ChatCustomMessagePartMap` augmentation. | Telegram, Slack, and Teams offer these as platform differentiators. Building a plugin-like message type system is complex and high-value. Enterprise products (internal tools, customer engagement) need domain-specific message types. |
| **Message threading / replies**                    | New    | Reply to specific messages creating threaded conversations (Slack-style threads). `ChatMessage.parentId` field, thread view component, reply count badges on parent messages.                                                                              | Threading is an advanced conversation management pattern. Simple chat is linear; threaded chat is enterprise collaboration. Significantly increases UI and state complexity.                                                            |
| **Emoji reactions**                                | New    | React to messages with emoji. `ChatMessage.reactions` field, reaction picker component, reaction badges on messages. Adapter method: `addReaction(messageId, emoji)`.                                                                                      | Engagement feature used heavily in Slack, Teams, Discord. Requires real-time sync and additional server-side storage.                                                                                                                   |
| **Message pinning / bookmarking**                  | New    | Pin important messages to a conversation. Pinned messages panel, pin/unpin actions. Adapter method: `pinMessage(messageId)`.                                                                                                                               | Professional knowledge management: surface important information in long conversations. Enterprise compliance use case.                                                                                                                 |
| **Conversation export**                            | New    | Export conversation history to JSON, CSV, PDF, or plain text. `exportConversation(id, format)` utility. Configurable: include/exclude metadata, attachments, tool calls.                                                                                   | Enterprise compliance and auditing requirement. Legal hold, record-keeping, and reporting needs.                                                                                                                                        |
| **Multi-agent orchestration UI**                   | New    | Visualize multi-agent AI workflows: agent handoffs, parallel tool execution, agent collaboration graphs. Extends the tool/step-start parts with agent identity and workflow state.                                                                         | Advanced AI feature for platforms running multiple specialized agents (coding agent + research agent + planning agent). Enterprise AI platforms need visibility into agent orchestration.                                               |
| **Voice / audio messages**                         | New    | Record and send voice messages. `ChatAudioMessagePart` with audio player component, waveform visualization, playback speed control. Adapter method for audio upload/transcription.                                                                         | Rich media communication feature. Used in WhatsApp, Telegram, and increasingly in enterprise tools. Requires audio recording APIs and potentially transcription integration.                                                            |
| **Conversation analytics hooks**                   | New    | Hooks and callbacks for tracking chat usage: `onMessageSent`, `onMessageReceived`, `onConversationStarted`, `onToolUsed`, `onAttachmentUploaded`. Integrates with analytics platforms (Segment, Mixpanel, etc.).                                           | Enterprise observability: understand how users interact with chat/AI features. Product analytics for AI applications.                                                                                                                   |
| **Content moderation**                             | New    | Built-in content filtering and moderation pipeline: pre-send validation, post-receive scanning, flagged message UI, moderation queue component. Adapter method: `moderateMessage(content)`.                                                                | Enterprise compliance: prevent inappropriate content, PII leakage, or policy violations. Critical for customer-facing chat and AI applications.                                                                                         |
| **Mentions & user tagging**                        | New    | `@mention` users in messages with autocomplete dropdown. Parse mentions in message text, highlight mentioned users, trigger notifications.                                                                                                                 | Collaborative communication feature (Slack, Teams pattern). Requires user directory integration and notification infrastructure.                                                                                                        |
| **Rich media embeds**                              | New    | Auto-expand URLs into rich previews: link cards with title/description/image (Open Graph), video players (YouTube, Vimeo), tweet embeds, etc.                                                                                                              | Professional UX polish. Slack and Teams unfurl links automatically. Requires server-side URL scraping or client-side OEmbed integration.                                                                                                |
| **End-to-end encryption support**                  | New    | Adapter-level hooks for E2EE: `encryptMessage()` / `decryptMessage()` lifecycle, key exchange utilities, encrypted attachment handling, visual lock indicators.                                                                                            | Enterprise security requirement for regulated industries (healthcare, finance, legal). High-value compliance feature.                                                                                                                   |
| **Saved / canned responses**                       | New    | Library of pre-written responses that agents can quickly insert. Template management UI, variable substitution (`{{customerName}}`), keyboard shortcut to trigger (`/`-commands).                                                                          | Customer support workflow optimization. Used by Intercom, Zendesk, Freshdesk. Enterprise productivity feature.                                                                                                                          |

---

## Feature Comparison Matrix

| Feature                               | Community | Pro | Premium |
| ------------------------------------- | :-------: | :-: | :-----: |
| 👉 **Messaging**                      |           |     |         |
| Text messages with streaming          |    ✅     | ✅  |   ✅    |
| Message grouping                      |    ✅     | ✅  |   ✅    |
| Date dividers                         |    ✅     | ✅  |   ✅    |
| Code blocks                           |    ✅     | ✅  |   ✅    |
| Suggestions                           |    ✅     | ✅  |   ✅    |
| Loading skeletons                     |    ✅     | ✅  |   ✅    |
| Markdown rendering                    |           | ✅  |   ✅    |
| Message editing                       |           | ✅  |   ✅    |
| Message deletion                      |           | ✅  |   ✅    |
| Message search                        |           | ✅  |   ✅    |
| Message threading / replies           |           |     |   ✅    |
| Emoji reactions                       |           |     |   ✅    |
| Message pinning                       |           |     |   ✅    |
| Voice / audio messages                |           |     |   ✅    |
| Custom message types (polls, cards)   |           |     |   ✅    |
| Rich media embeds                     |           |     |   ✅    |
| Mentions & user tagging               |           |     |   ✅    |
| Saved / canned responses              |           |     |   ✅    |
| 👉 **Composer**                       |           |     |         |
| Text input with send button           |    ✅     | ✅  |   ✅    |
| File attachments                      |           | ✅  |   ✅    |
| Drag & drop upload                    |           | ✅  |   ✅    |
| Clipboard paste upload                |           | ✅  |   ✅    |
| Keyboard shortcuts                    |           | ✅  |   ✅    |
| 👉 **Conversations**                  |           |     |         |
| Single conversation                   |    ✅     | ✅  |   ✅    |
| Multi-conversation (list + switching) |           | ✅  |   ✅    |
| Conversation header                   |           | ✅  |   ✅    |
| Conversation export                   |           |     |   ✅    |
| 👉 **Real-time**                      |           |     |         |
| Typing indicators                     |           | ✅  |   ✅    |
| Unread tracking & badges              |           | ✅  |   ✅    |
| Real-time subscribe                   |           | ✅  |   ✅    |
| Read receipts                         |           | ✅  |   ✅    |
| Presence indicators                   |           | ✅  |   ✅    |
| 👉 **AI Features**                    |           |     |         |
| Tool calls display                    |    ✅     | ✅  |   ✅    |
| Reasoning display                     |    ✅     | ✅  |   ✅    |
| Source references (RAG citations)     |    ✅     | ✅  |   ✅    |
| Retry & regenerate                    |           | ✅  |   ✅    |
| Confirmation dialogs                  |           | ✅  |   ✅    |
| Tool approval workflow                |           | ✅  |   ✅    |
| Dynamic tool definitions              |           |     |   ✅    |
| Custom data parts                     |           |     |   ✅    |
| Multi-agent orchestration UI          |           |     |   ✅    |
| 👉 **Performance**                    |           |     |         |
| Auto-scroll                           |    ✅     | ✅  |   ✅    |
| Scroll-to-bottom affordance           |           | ✅  |   ✅    |
| Virtualized message list              |           | ✅  |   ✅    |
| 👉 **Customization**                  |           |     |         |
| Slot-based component overrides        |    ✅     | ✅  |   ✅    |
| Variants (default / compact)          |    ✅     | ✅  |   ✅    |
| Localization (i18n)                   |    ✅     | ✅  |   ✅    |
| Theme augmentation                    |    ✅     | ✅  |   ✅    |
| CSS class system                      |    ✅     | ✅  |   ✅    |
| Type augmentation (extend core types) |           |     |   ✅    |
| 👉 **Enterprise**                     |           |     |         |
| Content moderation                    |           |     |   ✅    |
| Conversation analytics hooks          |           |     |   ✅    |
| End-to-end encryption support         |           |     |   ✅    |
| 👉 **Infrastructure**                 |           |     |         |
| ChatAdapter interface                 |    ✅     | ✅  |   ✅    |
| ChatStore & selectors                 |    ✅     | ✅  |   ✅    |
| Core hooks                            |    ✅     | ✅  |   ✅    |
| Error handling                        |    ✅     | ✅  |   ✅    |
| Message actions menu                  |           | ✅  |   ✅    |
| Message history loading               |           | ✅  |   ✅    |

> Legend: ✅ = included in tier. Features cascade upward (Pro includes all Community features, Premium includes all Pro features).

---

## Implementation Notes

### Following Existing MUI X Patterns

Based on the established patterns in Data Grid, Charts, and Tree View:

1. **Package dependency chain:**

   ```
   x-chat-premium → x-chat-pro → x-chat (community)
   ```

2. **License enforcement:** Use `useLicenseVerifier()` hook + `<Watermark />` component in Pro/Premium root components. Visual enforcement (watermark), not functional blocking.

3. **Export strategy:** Each tier re-exports everything from lower tiers and adds its own exports. Users import from a single package (`@mui/x-chat-pro`) and get the full API.

4. **Feature hooks:** Each Pro/Premium feature lives in its own directory (`hooks/features/[featureName]/`) with dedicated hook, types, and selectors.

5. **Extended types:**

   ```typescript
   // Community
   export type ChatApi = ChatApiCommunity;

   // Pro
   export type ChatApi = ChatApiPro; // extends ChatApiCommunity

   // Premium
   export type ChatApi = ChatApiPremium; // extends ChatApiPro
   ```

6. **Register in license system:** Add `'x-chat-pro'` and `'x-chat-premium'` to `commercialPackages.ts` in `@mui/x-license`.

### Migration Path for Existing Users

Since all features are currently in the Community tier, moving features to Pro/Premium is a breaking change. Recommended approach:

1. **Phase 1 (v9 alpha/beta):** Introduce `@mui/x-chat-pro` package with new Pro-only features (virtualization, search, keyboard shortcuts, Markdown). Keep existing features in Community during alpha.
2. **Phase 2 (v9 RC):** Move existing features (attachments, multi-conversation, real-time, tool calls, etc.) to Pro with deprecation warnings in Community.
3. **Phase 3 (v9 stable):** Features fully gated behind Pro/Premium tiers.

---

## Competitive Analysis

| Feature              | MUI X Chat (Proposed) | Stream Chat | Sendbird  | Intercom |
| -------------------- | --------------------- | ----------- | --------- | -------- |
| Text messaging       | Community             | Free tier   | Free tier | Paid     |
| File attachments     | Pro                   | Free tier   | Free tier | Paid     |
| Typing indicators    | Pro                   | Free tier   | Free tier | Paid     |
| Threads              | Premium               | Paid        | Paid      | Paid     |
| Reactions            | Premium               | Paid        | Paid      | Paid     |
| Read receipts        | Pro                   | Paid        | Paid      | Paid     |
| AI tool integration  | Pro                   | N/A         | N/A       | Paid     |
| Custom message types | Premium               | Paid        | Paid      | Paid     |
| Moderation           | Premium               | Paid        | Paid      | Paid     |
| Analytics            | Premium               | Paid        | Paid      | Paid     |

> **Key differentiator:** MUI X Chat is the only offering with first-class AI/LLM integration (streaming, tool calls, reasoning, RAG citations) as a core feature rather than an afterthought. This should be emphasized in positioning.

---

## Revenue Impact Estimate

| Tier          | Target Audience                                                    | Conversion Driver                                                                                        |
| ------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| **Community** | Individual developers, startups, open-source projects, prototyping | Adoption funnel — gets developers using and loving the API                                               |
| **Pro**       | SaaS products, customer support platforms, AI assistant products   | Attachments + multi-conversation + real-time + AI tools — the features that make chat "production-ready" |
| **Premium**   | Enterprise, regulated industries, platform builders                | Custom message types + moderation + analytics + E2EE — the features that satisfy enterprise procurement  |

---

## Open Questions

1. **Headless tier separation:** Should `x-chat-headless-pro` exist as a separate package, or should all headless logic stay in one package with runtime tier checks? The Data Grid uses separate packages; the same approach is recommended for consistency.

## Resolved Decisions

1. **Markdown rendering in Community vs Pro:** Community does **not** include built-in Markdown rendering, but users can override the message content slot to plug in their own renderer. Pro provides out-of-the-box Markdown rendering so teams get a polished experience with zero configuration.

2. **Tool calls tier placement:** Basic tool calls display (input/output states), reasoning display, and source references stay in **Community** — they are fundamental to the AI chat use case. Tool **approval workflow** (human-in-the-loop gates) goes in **Pro**.

3. **Virtualization implementation:** Opt-in via `features={{ virtualization: {} }}`. Developers explicitly enable it rather than it being automatic, giving control over the trade-off between rendering fidelity and performance.

4. **Real-time feature granularity:** All real-time features — typing indicators, unread badges, subscribe, read receipts, **and** presence indicators — are bundled together in **Pro**. No split across tiers.
