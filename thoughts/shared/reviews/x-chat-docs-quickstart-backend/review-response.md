# PR #22485 — Review Response (x-chat-docs-quickstart-backend)

"[docs] Update chat quickstart and backend adapters" — stacked on #22484.

8 inline threads, 5 resolved, **3 unresolved**:

| id         | path:line              | summary                               | verdict             |
| ---------- | ---------------------- | ------------------------------------- | ------------------- |
| 3365501457 | ai-sdk-adapter.md:36   | uses v4 `convertToCoreMessages`       | ACCEPT — docs fix   |
| 3365501459 | ChatBoxContent.tsx:287 | back control hidden when header off   | ALREADY FIXED (008) |
| 3365638943 | ChatBoxContent.tsx:421 | overlay not closed on keyboard select | ACCEPT — real bug   |

## 457 — AI SDK converter (docs, ACCEPT)

`ai-sdk-adapter.md` Pattern A snippet imports/calls `convertToCoreMessages` from `'ai'` (lines 36, 43)
alongside `result.toUIMessageStreamResponse()` (line 45, a **v5** API). `convertToCoreMessages` is the
**v4** converter — in AI SDK **v5** it's `convertToModelMessages` (UIMessage[] → ModelMessage[]).
Copying the snippet with the current `ai` package fails to import. 2 occurrences in one doc owned by
#22485 (commit `4d67157032`). Fix: rename both to `convertToModelMessages`. Docs-only → fix on #22485,
cascade #22486–88.

## 459 — split-view back control (ALREADY FIXED)

Same issue as #22484/008. Already fixed in `6a537305` ([x-chat] header-hidden back nav): when
`features.conversationHeader === false`, `DefaultConversationHeader` now renders the back/menu nav
in a minimal `ChatBoxHeaderNavBar` instead of returning null (present on this branch's base at
ChatBoxContent.tsx:314). The comment predates the fix. → reply + resolve, no code.

## 943 — overlay close on keyboard selection (source bug, ACCEPT)

Confirmed. The narrow overlay's close is wired only into the conversation item's `onClick`
(`mergeConversationListItemSlotProps`, ChatBoxContent.tsx:352). But `ConversationListRoot`'s Enter-key
handler calls `setActiveConversation(id)` directly (ConversationListRoot.tsx:554) without firing the
item `onClick`. So opening the overlay, focusing an item, and pressing Enter changes the conversation
but leaves the overlay open with focus trapped. Fix: close the drawer whenever `activeConversationId`
changes while the drawer is open (covers pointer AND keyboard paths), via an effect guarded on a
previous-id ref so opening the drawer with an already-active conversation doesn't self-close. Source →
fix on #22482, cascade all 6.

## Plan

1. Fix 943 on #22482 (+ regression test) → cascade all 6.
2. Fix 457 on #22485 (rebased) → cascade #22486–88.
3. Reply + resolve all three (459 points to the existing fix).
