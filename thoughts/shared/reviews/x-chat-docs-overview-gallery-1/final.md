# Hostile Code Review — `x-chat-docs-overview-gallery`

**Reviewer stance:** Senior dev who does _not_ like this PR and wants it to earn the merge.
**Date:** 2026-06-06
**Base for review:** `bd49bce7cf^2` (the upstream that was merged in). Do **not** use local `master` — it is stale and `master...HEAD` mixes in hundreds of unrelated upstream commits (charts/scheduler/date-pickers/releases). See "Process problems" below.
**Scope of this branch's own work:** ~49 `packages/x-chat/src` source files (**+3410 / −923**) + docs gallery/playground infrastructure. Cluster detail files live alongside this one (`cluster-1`…`cluster-5`).

---

## TL;DR verdict — Request changes

The _headline_ docs work is good — the gallery, the playground, and especially the **"parse `sx` without executing it"** parser are well done and genuinely safe (verified: hand-written recursive-descent parser, no `eval`/`new Function`/`innerHTML`, fails closed). The markdown content renderer is also better than expected — no `dangerouslySetInnerHTML`, the URL sanitizer blocks `javascript:`/`data:`, no ReDoS.

**The customization layer underneath it is the problem, and it's structural, not a typo.** This PR introduces a shared slot-merge helper (`mergeSlotProps`) that is the new spine of ~20 components — and it is **wrong in the one way that matters**: it clobbers instead of merges. Meanwhile the most important component (`ChatBoxContent`) _doesn't use it_ — it hand-rolls four _correct_ merge helpers inline. So the PR ships **two contradictory merge contracts**, makes the broken one the shared/public one, and writes unit tests that lock in the broken behavior as "correct." That's the thing I'd block on.

**Would I approve?** No — not until the merge contract is fixed and unified, the ConversationList slot-fallback inversion is fixed, and the repo-root junk is removed. The rest are normal review nits.

---

## Meta-critique (the part I actually care about)

1. **The central new abstraction is the buggy one, and everything depends on it.**
   `internals/mergeSlotProps.ts` does `{ ...base, ...consumer }`. `base` is always the component's own `{ className: clsx(classes.x, className), sx, ref }`. A consumer who sets `slotProps.x.className` / `.sx` / `.ref` **silently deletes the component's own utility class / top-level `sx` / forwarded `ref`.** Used at ~20 call sites. The correct version exists _in this same PR_ — `ChatBoxContent` does `clsx(...)` and array-layers `sx`. The wrong version became the shared export.

2. **Two merge contracts is worse than one bad one.** `ChatBoxContent.tsx` (~351–430) reimplements callback-or-object slot-prop resolution **four times** and gets className/sx right; `mergeSlotProps` gets them wrong. A reader can't trust either by inspection. Pick one, make it correct, delete the rest.

3. **The tests cement the bug.** `mergeSlotProps.test.ts:14` asserts `{className:'custom'}` _replaces_ `{className:'base'}`. The suite is green _because_ it encodes the defect. Any correct fix now has to fight the tests — "tested into a corner."

4. **Half-applied fixes are a recurring pattern.** Three places fix a bug in the "section" path but miss the structurally identical "root" path:
   - `onToggle` chaining fixed for `ChatToolPartSection` (`:669`) but **not** `ChatToolPartRoot` (`:347` still clobbers).
   - `...slots` spread-first (correct) in `ChatConversationHeader` but spread-**last** (wrong) in `ChatConversationList`.
   - `className` clobber "fixed" by hand in `ChatBoxContent` but left broken in the shared helper.
     When you fix a slot-forwarding bug, grep for the sibling and fix it too.

---

## BLOCKER / HIGH (verified against code)

### H1 — `mergeSlotProps` clobbers `className`, `sx`, and `ref` (shared, ~20 call sites)

`internals/mergeSlotProps.ts:24-29` — `{...base, ...consumer}`.

- **className:** consumer drops `clsx(classes.root, className)` → theme `styleOverrides`, `variants`, and any `.MuiChatX-*` targeting (consumer CSS _and_ the component's own overrides) stop matching. Styled base styles survive (separate styled-engine class), so it "looks fine until you theme it" — the worst kind.
- **sx:** when `base` carries the top-level `<ChatX sx>` (it does at 14 sites), a consumer `slotProps.x.sx` deletes it. Two ways to set `sx`, one silently wins.
- **ref:** `ChatConversationHeader.tsx:52-58` routes the **forwarded ref** through `base`; a consumer `slotProps.header.ref` clobbers it → ref forwarding silently breaks.
  **Fix:** `className: clsx(base.className, consumer.className)`; `sx: [base.sx, consumer.sx].flat()`; never route `ref` through the value-spread; chain handlers (H4). Then rewrite the tests.

### H2 — `ChatConversationList` spreads `...slots` LAST → dead fallbacks → SSR throw

`ChatConversationList/ChatConversationList.tsx:709-724`. Each line is `scrollbar: slots?.scrollbar ?? NoopScrollbar`, then **`...slots` at `:723` overwrites them all** with the raw consumer object.

- Every `?? Default` is dead/misleading.
- A consumer passing an **explicit `undefined`** (idiomatic conditional slots — exactly what `ChatBoxContent` forwards via `slotProps.conversationList.slots`) resets `scrollbar`/`scrollbarThumb`/`viewport` to `undefined`. The headless then falls back to `ScrollArea.Scrollbar`/`Viewport`, which — per this file's own comments at `:86-89`/`:103-104` — **throw during SSR** without a `ScrollArea.Root`. `NoopScrollbar` exists precisely to prevent that crash; this line defeats it. Lone inverted spread in the cluster.
  **Fix:** move `...slots` to the **top** of the literal.

### H3 — `ChatToolPartRoot` clobbers a consumer `onToggle` (half-applied fix)

`ChatMessage/ChatMessageContent.tsx:343-349`. Spreads `{...rest}` then hard-sets `onToggle`, overwriting any consumer handler from `slotProps.root`. The sibling `ChatToolPartSection` does it right at `:665-669` (`onToggleProp?.(event)`). Commit `1997fd0182` fixed the section, missed the root.
**Fix:** pull `onToggle` out of `rest`; call both — `setOpen(e.currentTarget.open); consumerOnToggle?.(e);`.

### H4 — `mergeSlotProps` doc claims handler preservation it does not do

`internals/mergeSlotProps.ts` doc says it prevents "dropping … handlers." It spreads, so a base `onClick` would be clobbered by a consumer `onClick`. Latent today (no base sets a handler) but H3 proves handlers flow through these paths, and the doc lies about the guarantee. **Fix:** chain known handlers in the merge; fix the doc.

---

## MEDIUM

- **M1 — `useContainerWidth` node-swap unsafe.** `ChatBoxContent.tsx:52-92`. Observes the mount-time node via a stable `RefObject` with deps `[ref]`; never re-attaches if the root node is replaced (slot swap, conditional remount) → width freezes → layout mode sticks. _Lower confidence — flagged by cluster 2, not independently reproduced._ Use a callback ref that re-observes.
- **M2 — Empty-state vs rendered-subset divergence.** `ChatBoxContent.tsx:702-706,796`. `isEmptyThread` uses full `messageIds`; the list renders `slotProps.messageList.items` (a possibly-filtered subset). A non-empty thread rendered with `items:[]` shows **neither** empty state **nor** centered suggestions. Derive emptiness from what is rendered.
- **M3 — Custom `slots.conversationList` loses its pane assignment.** `ChatBoxContent.tsx:778`. Consumer component isn't symbol-marked for `ChatLayout`'s pane resolver; correct placement is incidental on iteration order. Inject the pane marker explicitly.
- **M4 — Keyboard "Enter on already-active conversation" leaves the narrow overlay open.** `ChatBoxContent.tsx:767-774`. Close is driven by `activeConversationId` _changing_; re-selecting the active item via Enter calls `setActiveConversation(sameId)` → no change → overlay stays open. (Escape / other-item still close it, so not a hard trap — but contradicts commit `d596389bc7`'s "pointer and keyboard" claim.) Drive close off a real selection event.
- **M5 — Tool root auto-open stale on streamed transitions.** `ChatMessageContent.tsx:332-340`. Lazy `useState` captures `state` at mount; effect only re-opens for `approval-requested`, ignoring `input-streaming`→output on a reused element. The section path solves this (`:647-658`); the root contradicts its own init predicate.
- **M6 — `alpha()` imported instead of `theme.alpha()`.** `ChatMessageContent.tsx:5,257,264`. Violates the documented CSS-vars convention. **Real risk LOW here** (applied to `theme.palette.common.white`, a literal `#fff`, not a palette CSS-var), but it's the only file in `x-chat/src` breaking the rule and it'll be copy-pasted onto a palette color next. Switch to `theme.alpha()`.
- **M7 — `ChatMessageError` invisible to screen readers.** `ChatMessageError.tsx:108` — dynamic failures, no `role="alert"`/`aria-live`. Also `getErrorCardBackground` hardcodes Material red `244,67,54` in the non-vars branch (`:24-32`) → themed `palette.error.main` gives matching border/text but mismatched background.
- **M8 — Four overlapping bespoke merge helpers in `ChatBoxContent`** (`:351-430`) duplicate `mergeSlotProps`/`ChatSuggestions`. They're the _correct_ reference impl — fold their logic into the shared helper after H1.
- **M9 — Layout shell churns every resize tick.** `ChatBoxContent.tsx:833-992`. `<ChatLayout slotProps>` object, three `mergeLayoutSlotProps` closures, overlay Fragment, `conversationsPaneStyle` all rebuild per render; `ResizeObserver` fires per-pixel. Rows are insulated; the shell isn't. `useMemo` them.

---

## LOW / NIT

- **L1** — `ChatSlotsContext` value is `useMemo`'d but call sites pass inline `slots={{...}}` literals, defeating it → re-render churn under the provider.
- **L2** — `useCopyToClipboard` can `setState` after unmount (success path unguarded) and silently no-ops with zero feedback on insecure origins (no `navigator.clipboard`). Guard unmount; surface a fallback state.
- **L3** — Markdown link edge cases: URLs break on literal `)`; images render as `!`+link; link labels not inline-parsed. OK for v-alpha; document the limits.
- **L4** — Dead null-branch in `DefaultMessageItem.tsx:75-88`.
- **L5** — a11y: `ChatComposerAttachmentList` hard-codes English "Remove" + lacks labels for nameless attachments (`:141-147`); `ChatConfirmation` root lacks `alertdialog` role / `aria-describedby`; Classes-editor `<textarea>` in `PlaygroundCard.tsx:693-743` has no `aria-label`, no `aria-invalid`/`aria-describedby`.
- **L6** — Loose types: pervasive `as any` at every `mergeSlotProps` call; `messageInlineMeta`/`messageAuthorName` typed `Record<string, unknown>` while siblings are `Partial<...Props>`; `emptyState` typed `'div'` but rendered as arbitrary component with `sx` spread.
- **L7** — `generatedCodeSources.ts` not reproducible from its own generator (committed Prettier-wrapped vs single-line emit) → a "generated up to date" CI guard would churn.
- **N1** — `ChatMessageBubbleStyled` omits the explicit `shouldForwardProp` its 5 siblings have. No leak today; inconsistent.

---

## Process / hygiene problems

- **Untracked debug junk in the repo root** — `all-thumbs*.json`, `svg-dump.json`, `v3/v4-svgs.json`, `composer-v2.json`, `polish-check.json`, `suggestions.json`, `playground-props-variations.html`, a pile of `*.jpeg`, plus `thoughts/`. One `git add -A` from shipping. Delete or gitignore before this goes near a PR.
- **Stale local `master`.** The workspace `master` ref is far behind the upstream the branch merged, so `git diff master...HEAD` is unusable (hundreds of foreign files). Update/rebase so reviewers and CI diff against reality.
- **52 playground demos import from `docs/src/...`** → CodeSandbox/StackBlitz export is broken. Mitigated (established MUI X pattern) but export buttons should be disabled rather than producing a broken sandbox.

---

## Edge cases the implementation is missing (consolidated)

1. Consumer sets `slotProps.x.className`/`.sx`/`.ref` → silently dropped (H1).
2. Consumer passes a slot object with explicit `undefined` values to `ChatConversationList` → SSR throw (H2).
3. Consumer hooks `onToggle` on a tool **root** disclosure → never called (H3).
4. Non-empty thread rendered with an empty `items` subset → no empty state, no suggestions (M2).
5. Re-selecting the already-active conversation by keyboard in the narrow overlay → won't close (M4).
6. Tool element reused across streamed state transitions → auto-open stale (M5).
7. Root DOM node swapped → container width frozen, wrong layout mode (M1).
8. Copy on insecure origin / after unmount → silent failure / setState warning (L2).
9. Markdown link containing `)` / image syntax → mis-rendered (L3).

---

## What I'd require before approving

1. **Fix `mergeSlotProps`** — `clsx` className, array-layer `sx`, never clobber `ref`, chain handlers — and **rewrite its tests** (H1/H4).
2. **Unify** the four `ChatBoxContent` merge helpers with the shared helper (M8).
3. **Fix the `...slots` spread order** in `ChatConversationList` (H2).
4. **Converge the `onToggle` root path** with the section path (H3).
5. **Remove repo-root debug dumps** and update/rebase the stale `master` so the diff is reviewable.
6. Then triage M1/M2/M4/M5 (real behavioral edges) and the a11y LOWs.

Everything in the docs/gallery/playground layer (the actual feature title) I'm happy with — the criticism is almost entirely in the `x-chat` customization plumbing that rode along with it.
