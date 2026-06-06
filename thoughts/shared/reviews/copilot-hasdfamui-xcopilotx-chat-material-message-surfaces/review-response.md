# PR #22670 Review Analysis — [x-chat] Material message surfaces

PR: https://github.com/mui/mui-x/pull/22670
Branch: `copilot/hasdfamui-xcopilotx-chat-material-message-surfaces`
Reviewers: chatgpt-codex-connector[bot], Copilot

9 inline comments + 1 review-level suggestion → 7 distinct issues (Codex & Copilot overlap on 3).

---

## A. Named container query never matches — VALID (accept)

- Comments: `3342304847` (Codex P2), `3342353215` (Copilot)
- `ChatConversationList.tsx:78` uses `@container chatbox (max-width: 599.95px)`, but `ChatBox.tsx:24` sets only `containerType: 'inline-size'` — no `containerName: 'chatbox'` anywhere in `packages/x-chat/src` (verified). The named query never matches → desktop sidebar not hidden on narrow layouts; user can see both inline list and drawer.
- Intended pattern is the **anonymous** query (see `ChatBoxContent.tsx:50` comment + JS `useContainerNarrow` mirror).
- Fix: change line 78 to `@container (max-width: 599.95px)`.

## B. `slots.message.root` hoisted as the entire row component — VALID (accept)

- Comments: `3342348680`, `3342402964` (Codex P2, duplicate)
- `ChatMessageGroup.tsx:134` does `MessageRootSlot = innerMessageSlots?.root ?? ChatMessage`, then renders it directly with `messageId`/`slots`/`slotProps`. With `slots={{ message: { root: 'section' } }}`, a raw `<section>` can't interpret those props → avatar/content/error/actions tree disappears.
- `ChatMessage` already interprets its own `root` slot (`ChatMessage.tsx:266`).
- Fix: always render `<ChatMessage messageId slots={innerMessageSlots} slotProps={innerMessageSlotProps} />`; drop the `MessageRootSlot` indirection and the redundant `{...slotProps.root}` spread (ChatMessage applies `slotProps.root` to its root at line 272).

## C. Default grouping ignores `index`/`items` of the rendered list — VALID (accept, edge case)

- Comment: `3342348691` (Codex P2)
- `MessageListRoot` accepts a custom `items` subset (`MessageListRoot.tsx:59`) and passes subset-relative `index` to `renderItem` (line 159). `ChatMessageList`'s `defaultRenderItem` (line 156) drops `index` and forwards only `messageId`. `MessageGroup` then falls back to `useMessageIds()` (full conversation) → first item of a filtered list can be marked grouped against an off-list previous message and lose avatar/author label.
- Regression introduced by this PR's `DefaultMessageItem`/`defaultRenderItem`.
- Fix: thread `index` + the resolved `items` through `defaultRenderItem` → `DefaultMessageItem` → `ChatMessageGroup` → `MessageGroup` (latter already accepts `index`/`items`).

## D. Tool section doesn't reopen on state change (`approval-requested`/`output-available`) — VALID (accept)

- Comments: `3342348698` (Codex P2), `3342353349` (Copilot)
- `ChatMessageContent.tsx:640` `useState(initialOpen)` reads `initialOpen` only on first render. `initialOpen` is memoized to react to `state` (line 631), but `open` never syncs on post-mount transitions (e.g. `input-available → approval-requested`, `streaming → output-available`).
- Fix: sync `open` when `initialOpen` transitions false→true (track previous value via ref; only force-open, don't force-close, to respect manual collapse).

## E. `noAvatar` documented on `ChatMessageContent` API page but never emitted — P3 (NEEDS DISCUSSION, lean reject/out-of-scope)

- Comment: `3342348704` (Codex P3)
- True: `ChatMessageContent` emits only `content`/`bubble`; `.MuiChatMessageContent-noAvatar` is never produced.
- BUT this is a **pre-existing** doc-generation pattern: all chat-message-family components share one `MuiChatMessage` classes interface (`chatMessageClasses.ts`), so `chat-message-content.json` already documents `meta`, `roleUser`, `roleAssistant` etc. — none emitted by `ChatMessageContent` either. `noAvatar` follows the same (flawed) pattern.
- Fixing only `noAvatar` would be inconsistent; a proper fix means splitting the shared classes interface per component (larger refactor, out of scope).
- Recommendation: reject as pre-existing/out-of-scope, OR open a follow-up. **User decision.**

## F. `children` path ignores `slots.error`/`slotProps.error` — VALID (accept, minor)

- Comment: `3342353299` (Copilot)
- `ChatMessage.tsx:220` hardcodes `<ChatMessageError />` in the `children` branch, while the slot-driven branch honors `slots?.error ?? ChatMessageError` + `slotProps?.error` (lines 227, 250).
- Fix: use `(slots?.error ?? ChatMessageError)` with `{...(slotProps?.error ?? {})}` in the children branch too.

## G. Partial part-slot override drops Material default slots — VALID (accept)

- Review-level suggestion `4411186769` (Codex P2), `ChatMessageContent.tsx:1157` (+ file/dynamic-tool/reasoning/source-url/source-document)
- `{ slots: toolPartSlots, ...userPartProps?.tool }` — a user's partial `slots` (e.g. `{ slots: { sectionSummary: Custom } }`) replaces the whole map, dropping the other Material defaults.
- Fix: `{ ...userPartProps?.tool, slots: { ...toolPartSlots, ...userPartProps?.tool?.slots } }` for each part type with a default `slots` map.

---

## Summary

- Distinct issues: 7
- To fix (accept): A, B, C, D, F, G (6)
- Needs discussion / lean reject: E (1)
- Scope: all changes confined to `packages/x-chat/src` ✅ (matches x-chat scope constraint)
