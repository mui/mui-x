# PR #22484 — Review Response, batch 3 (third codex pass, all ChatBoxContent.tsx)

codex re-reviews on every force-push; this is the 3rd wave. All on `ChatBoxContent.tsx`.

| id         | line | summary                                                           | verdict                               |
| ---------- | ---- | ----------------------------------------------------------------- | ------------------------------------- |
| 3365638002 | 920  | function-form emptyState slotProps dropped                        | REAL bug — ACCEPT (same class as 372) |
| 3365638011 | 437  | composerRoot whole-composer demo breaks under wrapper-only wiring | contract/regression — user call       |
| 3365638008 | 288  | back-nav trapped when conversationHeader disabled                 | real UX trap — user call              |

## 002 — emptyState function slotProps (CLEAR ACCEPT)

`emptyState?: SlotComponentProps<'div', { sx }, {}>` (ChatBox.types.ts:233) — the type **allows the
callback form**. But `<CustomEmptyStateComponent {...(slotProps.emptyState ?? {})} />` (line ~921)
spreads it as an object → a `(ownerState) => props` callback is flattened to `{}` and its
className/sx/handlers dropped. Same bug class as 372. Fix: resolve with `useSlotProps` (or call the
fn) before rendering. Note: sibling spreads `suggestions`/`scrollToBottom`/`messageList` are typed
`Partial<…Props>` (NOT SlotComponentProps), so their object-spread is correct — only `emptyState` is
function-typed here.

## 011 — composerRoot used as whole-composer replacement (USER CALL)

Confirmed contract mismatch. Docs say `composerRoot` is **wrapper-only** (slots-and-composition.md:117:
"\*Root slots are wrapper-only… swap the styled root element while the default children still render
inside. To replace a region entirely, compose it yourself with the headless hooks"). Wiring matches:
line 437 forwards `slots.composerRoot` as ChatComposer's `slots.root`, and `ComposerRoot` injects
`ref` + form/data props into it. **But** the documented demo `docs/data/chat/material/hooks/CustomComposer.tsx`
does `composerRoot: CustomComposerContent`, where `CustomComposerContent` is a **plain (non-forwardRef)
function** that builds a whole composer from `useChatComposer()` and renders neither `children` nor
the injected props. Result: a React ref warning + dropped form/data props. May be a regression from
the flat-slots rewiring (the comment "this now forwards it as the low-level form root slot").
Options: (a) fix the demo to not use `composerRoot` for whole-composer replacement (compose its own
composer region via hooks, per the documented guidance); (b) make the demo content `forwardRef` +
spread props (keeps composerRoot wrapper-only, silences warning, but it's still a wrapper not a
replacement); (c) add a real whole-composer replacement slot/contract. Needs user decision.

## 008 — back-nav trapped when header disabled (USER CALL)

Confirmed UX trap. `showBackButton = hasConversationList && isMobileSplitView && activeConversationId`
(line 754), but the back IconButton is rendered **inside** `DefaultConversationHeader`, which
`return null`s when `features.conversationHeader === false` (line 272). So in split layout with
`features={{ conversationList: true, conversationHeader: false }}` on a narrow screen with a
conversation open, there's no built-in way back to the list. Fix is a design decision on placement:
render the back affordance independent of the optional header chrome (e.g. always in
split+mobile+active), or document that disabling the header in split mode requires a custom back
control. Needs user decision.

## Meta

codex keeps generating new threads on each push. After this batch, suggest pausing the per-push
re-review (or batching) to converge.
