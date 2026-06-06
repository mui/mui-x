# Cluster 4 review — ConversationList / Composer / MessageList / Suggestions / Confirmation

Branch: `x-chat-docs-overview-gallery`. Base for branch's own work: `bd49bce7cf^2`.
Reviewer stance: hostile. Every claim below was checked against the actual code on disk
(and the headless primitives the wrappers delegate to). File:line references are to the
current working-tree state.

Scope note: chat-only. Findings are about `packages/x-chat/*` wrappers (and the headless
files only insofar as they prove or disprove a wrapper claim). No cross-package audit.

---

## BLOCKER / HIGH

### H1 — `ChatConversationList` spreads `...slots` LAST, killing every default-slot fallback and resurrecting the SSR scrollbar crash

File: `packages/x-chat/src/ChatConversationList/ChatConversationList.tsx:709-724`

```ts
const resolvedSlots: Partial<ConversationListRootSlots> = {
  root: slots?.root ?? ChatConversationListStyled,
  ...
  scrollbar: slots?.scrollbar ?? NoopScrollbar,
  scrollbarThumb: slots?.scrollbarThumb ?? NoopScrollbar,
  item: slots?.item ?? ChatConversationListItemSlot,
  ...
  itemActions: slots?.itemActions ?? ChatConversationListItemActionsStyled,
  ...slots,            // <-- spread AFTER the resolved defaults
};
```

Problem: `...slots` is spread _after_ the per-key `slots?.x ?? Default` lines. For any key
that exists on `slots`, the raw value re-wins. So:

- The entire block of `?? Default` fallbacks (lines 710–722) is **dead code** for any key
  the consumer supplied — the resolved value is immediately overwritten by `...slots`.
- If the consumer passes a key set to `undefined` (extremely common when building a slots
  object conditionally, e.g. `slots={{ item: cond ? Custom : undefined }}` or
  `slotProps={{ conversationList: { slots: { scrollbar: undefined } } }}` through
  `ChatBoxContent`), the default is reset to `undefined`. The headless
  `ConversationListRoot` then falls back to its OWN defaults: `ScrollScrollbar` /
  `ScrollThumb` (`ConversationListRoot.tsx:366-369`) instead of `NoopScrollbar`.

Why it's serious: the wrapper deliberately replaces `scrollbar`/`scrollbarThumb` with
`NoopScrollbar` _because the scroller is a plain `<div>` (not `ScrollArea.Root`)_. The
code comments at lines 86-89 and 103-104 spell out that rendering
`ScrollArea.Scrollbar`/`Thumb` without a `ScrollArea.Root` context **throws during SSR**.
This spread-order bug provides a direct path to re-trigger exactly that crash from a
benign `undefined` slot value. Same hazard for `viewport` (plain-div viewport vs
`ScrollArea.Viewport`).

Proof this is isolated to this file: every _other_ wrapper in the cluster spreads
`...slots` FIRST and then overrides each key (`ChatSuggestions.tsx:72`,
`ChatComposer.tsx:262`, `ChatComposerAttachmentList.tsx:168`, all `ChatConversation*`
header files at :46-49, `ChatComposerToolbar.tsx:41`, etc.). `ChatConversationList` is the
lone inverted one — almost certainly a copy/paste regression.

Fix: move `...slots` to the TOP of the object literal so the `?? Default` resolutions win:

```ts
const resolvedSlots: Partial<ConversationListRootSlots> = {
  ...slots,
  root: slots?.root ?? ChatConversationListStyled,
  scroller: slots?.scroller ?? ChatConversationListScrollerStyled,
  viewport: slots?.viewport ?? ChatConversationListViewportStyled,
  scrollbar: slots?.scrollbar ?? NoopScrollbar,
  scrollbarThumb: slots?.scrollbarThumb ?? NoopScrollbar,
  ...
};
```

(The `slotProps` object below at :736-785 already does it the correct way — `...slotProps`
first — which makes the `slots` side stick out as wrong.)

---

### H2 — Keyboard "Enter on the already-active conversation" still leaves the narrow overlay open (the fix it claims to make is incomplete)

File: `packages/x-chat/src/ChatBox/ChatBoxContent.tsx:761-774` (this is the body of the
"Close the narrow conversation overlay on keyboard selection" commit `d596389bc7`, which
the task flagged for scrutiny).

```ts
const previousActiveConversationIdRef = React.useRef(activeConversationId);
React.useEffect(() => {
  const changed = previousActiveConversationIdRef.current !== activeConversationId;
  previousActiveConversationIdRef.current = activeConversationId;
  if (changed && drawerOpen) {
    handleDrawerClose();
  }
}, [activeConversationId, drawerOpen, handleDrawerClose]);
```

The drawer now closes when `activeConversationId` _changes_. But the headless Enter path
(`ConversationListRoot.tsx:552-555`) calls `setActiveConversation(id)` unconditionally,
including when `id === activeConversationId`. Scenario:

1. Conversation A is active. User opens the overlay (menu button).
2. Focus lands on A (focused === active, see `getInitialFocusedConversationId`).
3. User presses Enter on A. `setActiveConversation(A)` runs → no id change → `changed`
   is false → effect does not close → **overlay stays open, focus still trapped**.

The pointer path doesn't have this hole because the item `onClick` close in
`mergeConversationListItemSlotProps` (`ChatBoxContent.tsx:351-364`) fires regardless of
whether the id changed. The commit message explicitly claims it "covers both the pointer
and keyboard paths"; it doesn't cover keyboard re-selection of the current conversation.

Why it matters: this is the precise failure mode (overlay open + focus trapped) the commit
set out to kill; it's just been narrowed from "all keyboard selection" to "keyboard
selection that changes the id."

Fix options:

- Have the headless fire a selection callback (or the item `onSelect`) on Enter so the same
  `onItemClick` drawer-close path runs for keyboard, instead of inferring close from an
  id _change_. Cleanest — unifies pointer and keyboard.
- Or, in the overlay, also close on a keyboard "commit" event from the list regardless of
  id delta.

Severity HIGH because it's an a11y focus-trap that the dedicated fix was supposed to
remove, and it's trivially reproducible (open overlay on the active conversation, press
Enter).

---

## MEDIUM

### M1 — Consumer `slotProps.item.className` clobbers the wrapper's utility classes on the list item

File: `packages/x-chat/src/ChatConversationList/ChatConversationList.tsx:743-756`

```ts
item: (ownerState) => {
  const externalItemProps =
    typeof slotProps?.item === 'function' ? slotProps.item(ownerState) : slotProps?.item;
  return {
    className: clsx(classes.item, ownerState.selected && classes.itemSelected, ...),
    ...externalItemProps,     // <-- a consumer className here REPLACES classes.*
  };
},
```

If a consumer passes `slotProps={{ item: { className: 'mine' } }}` (or the callback form
returning a `className`), the spread overwrites the wrapper's `MuiChatConversationList-item`
/ `-itemSelected` / `-itemUnread` / `-itemFocused` classes entirely, breaking selection /
unread / focus styling and any theme `styleOverrides` keyed on those classes.

This is the same object-spread class-clobber the codebase introduced `mergeSlotProps` to
avoid (see `internals/mergeSlotProps.ts`), but the item path here is hand-rolled and does
NOT clsx-merge the consumer className. Note: `mergeSlotProps` itself also overwrites
`className` (it's `{ ...base, ...consumer }`), so swapping to it would not fix the clobber —
the correct fix is an explicit `clsx`:

```ts
return {
  ...externalItemProps,
  className: clsx(
    classes.item,
    ownerState.selected && classes.itemSelected,
    ownerState.unread && classes.itemUnread,
    ownerState.focused && classes.itemFocused,
    externalItemProps?.className,
  ),
};
```

Severity MEDIUM: silent loss of the item's stateful styling, and only on the item slot
(the most likely one a consumer customizes).

### M2 — Cluster-wide: every `mergeSlotProps`/object-spread wrapper drops the wrapper's own className when the consumer supplies one

Files (representative): `ChatSuggestions.tsx:78-82`, `ChatComposerToolbar.tsx:46-53`,
`ChatComposerAttachButton.tsx:78-85`, `ChatComposerAttachmentList.tsx:173-179`,
`ChatConversationHeader.tsx:52-59`, `ChatConversationHeaderActions.tsx:54-61`,
`ChatConversationHeaderInfo.tsx:51-58`, `ChatConversationTitle.tsx:53-60`,
`ChatConversationSubtitle.tsx:54-61`, and the non-merge variants
`ChatComposerSendButton.tsx:79-83`, `ChatComposerTextArea.tsx:71-81`,
`ChatConversation.tsx:54-58`, `ChatComposer.tsx:267-276`.

`mergeSlotProps(base, consumer)` returns `{ ...base, ...consumer }` (see
`internals/mergeSlotProps.ts:29`). `base.className` is the wrapper's
`clsx(classes.x, className)`. If `consumer.className` exists, it replaces the wrapper's
class string, dropping the `Mui*-*` utility class and any theme overrides bound to it.

This is consistent and pre-existing (the non-merge wrappers had the same behavior before),
so it's MEDIUM/by-current-design rather than a regression — but it's a real footgun and it
is inconsistent with M1's recommended fix. If the project's intent is "consumer slotProps
className _adds_ to the utility class" (the usual MUI contract), `mergeSlotProps` should
`clsx(base.className, consumer.className)` rather than letting the spread win. If the intent
is "consumer fully controls className," then M1 is actually correct-as-is and should be left
alone. Flagging so the team picks ONE contract and applies it uniformly; right now the item
path (M1) and the merge path disagree only by accident.

---

## LOW / NIT

### L1 — `DefaultMessageItem`: dead component-resolution when slot is `null`

File: `packages/x-chat/src/ChatMessageList/DefaultMessageItem.tsx:75-88`

```ts
const DateDividerComponent = (slots.dateDivider ?? ChatDateDivider) as React.ElementType;
...
{slots.dateDivider !== null && ( <DateDividerComponent .../> )}
```

When `slots.dateDivider === null`, `null ?? ChatDateDivider` evaluates to `ChatDateDivider`
(null is nullish), so `DateDividerComponent` is computed but then never rendered because of
the `!== null` guard. Functionally correct (null hides, undefined falls back), just a wasted
assignment / mildly confusing. NIT.

### L2 — Attachment chip a11y degrades for nameless files

File: `packages/x-chat/src/ChatComposer/ChatComposerAttachmentList.tsx:141-147`

`AttachmentFileName` renders `attachment.file.name` and the remove button's `aria-label` is
`` `Remove ${attachment.file.name}` ``. For an attachment whose `file.name` is empty (some
programmatic `File`/`Blob` constructions), the chip shows an empty name and the button reads
"Remove " with a trailing space and no target identity. Low impact (most real files have
names) but worth a fallback label like `localeText.attachmentRemoveLabel` or
`attachment.file.name || 'attachment'`. The remove label is also a hard-coded English string
(not routed through `useChatLocaleText`), unlike the composer's other labels in
`ChatBoxContent`. LOW.

### L3 — `ChatConfirmation`: action buttons have no `aria-label`/grouping, message not associated

File: `packages/x-chat/src/ChatConfirmation/ChatConfirmation.tsx:163-185`

The root is a plain `<div>` with no `role` (e.g. `role="alertdialog"`/`group`) and the
warning message is not linked to the buttons via `aria-describedby`. For a confirm/cancel
affordance that gates a tool action, screen-reader users get two unlabeled-by-context
buttons. The visible labels ("Confirm"/"Cancel") are readable, so it's not a blocker, but an
`alertdialog` role + `aria-describedby` pointing at the message id would make this
announce as the warning it is. The `WarningIcon` is correctly `aria-hidden`. LOW.

---

## Verified-OK (claims that held up — no action)

- **Standalone attachment list** (`ChatComposerAttachmentList.tsx:125-153`): the Material
  `DefaultAttachmentListContent` reads `useChatComposer()` directly from the store and keys
  on `attachment.localId`, so it renders outside a `ChatComposer`. Matches the fix in
  `dbb93bdb29` (headless gating moved off the empty ComposerContext). Correct.
- **Function-form suggestions root slotProps**: `ChatSuggestions.tsx:78-82` now uses
  `mergeSlotProps`, which preserves the `(ownerState) => props` callback
  (`mergeSlotProps.ts:23-28`). The headless `SuggestionsRoot` forwards `slotProps.item`
  into each `SuggestionItem` as `slotProps={{ root: ... }}` (`SuggestionsRoot.tsx:139`),
  and the wrapper's `item` mergeSlotProps also preserves callbacks. The earlier
  spread-a-function-into-`{}` bug from `dbb93bdb29` is gone. Correct.
- **`AboveComposerSuggestions` sx layering** (`ChatBoxContent.tsx:542-634`): top-level
  consumer `sx` is split out and folded into `slotProps.root.sx` so the injected
  above-composer layout doesn't clobber it; callback-form root slotProp is preserved
  (`:613-619`). Matches commit `0193799936`. Correct.
- **Row grouping against the rendered subset**: `DefaultMessageItem` forwards
  `index`/`items` into `ChatMessageGroup` so grouping is computed against the rendered list,
  not the full conversation (`DefaultMessageItem.tsx:78-111`,
  `ChatMessageList.tsx:163-188`). `renderItem` is kept stable via refs so scroll-driven
  re-renders short-circuit on the memoized row. Sound; `messageGroup` is intentionally NOT
  hoisted out of the row (comment at :96-103 explains the DOM-leak it would cause). Correct.
- **DOM prop leakage on list items**: `itemSlotShouldForwardProp`
  (`ChatConversationList.tsx:114-125`) filters `conversation`/`selected`/`unread`/`focused`/
  `variant` (plus the MUI internals it has to re-list because a custom `shouldForwardProp`
  replaces the default) so the headless `additionalProps` don't reach the DOM. Correct.
- **List a11y roles**: `role="listbox"` on root, `role="option"` + `aria-selected` +
  roving `tabIndex` on items, arrow/Home/End/PageUp/PageDown/type-ahead keyboard nav — all
  in the headless `ConversationListRoot.tsx:404-413, 164-180, 515-584`. The Material wrapper
  forwards these untouched. Adequate.
- **`styled` uses `theme.alpha()` / `theme.vars`**: spot-checked across the cluster — all
  color reads go through `(theme.vars || theme).palette.*`; no imported `alpha()` calls in
  these styled blocks. Consistent with the CSS-vars-alpha convention.

## Not applicable / not present

- **List virtualization for the conversation list**: `ConversationListRoot` renders all
  conversations with `conversations.map(...)` (no windowing). Out of cluster scope (headless),
  but noted: large conversation lists (1000s) will render every row. Not a regression on this
  branch.
- **IME composition / paste / empty-whitespace send in the textarea**: handled by the
  headless `ComposerTextArea`/`ComposerSendButton`, not the Material wrappers in this
  cluster — nothing in the wrapper diffs touches submit/whitespace logic. No finding.
