# Detailed Findings

## P1 - `ChatBox` advertises slots and children it does not render

`ChatBox.types.ts` exposes `slots.root` and `slotProps.root` (`ChatBox.types.ts:56-72`) and the main `slots` docs include `root` in the layout section (`ChatBox.types.ts:357-381`). The implementation destructures `slots` and `slotProps`, but always renders `ChatBoxStyled` directly (`ChatBox.tsx:155-175`). There is no `RootSlot`, no `useSlotProps`, and no merge for `slotProps.root`.

The same implementation drops consumer children. `children` is not destructured (`ChatBox.tsx:62-105`), so it lives in `...other`, but the explicit children passed to `ChatBoxStyled` replace any `other.children`. The PropTypes and docs both imply children are valid, and the docs explicitly say hooks work inside components rendered as children of `ChatBox` (`chatbox.md:47-50`).

Missing edge cases:

- `<ChatBox slots={{ root: 'section' }} />`
- `<ChatBox slotProps={{ root: { 'data-testid': 'root' } }} />`
- `<ChatBox><HookConsumer /></ChatBox>`
- Theme `MuiChatBox.defaultProps.slotProps.root`

Expected fix direction: render a real root slot and deliberately place `children` somewhere in the provider subtree, or remove the public children/root API and update docs.

## P1 - Callback-form `slotProps` support is inconsistent

`mergeSlotProps.ts` says the problem clearly: spreading callback-form slot props drops them (`mergeSlotProps.ts:3-14`). But several major components still spread maybe-functions directly:

- `ChatMessageList.tsx:201-217` spreads `listSlotProps?.messageList`, `messageListScroller`, and `messageListContent`.
- `ChatConversationList.tsx:736-785` handles only `item` as a callback; the rest are object spreads.
- `ChatMessage.tsx:284-289` spreads `slotProps?.root`.
- `ChatComposer.tsx:265-276` spreads `slotProps?.root`.

This is the kind of bug users will hit immediately when they follow the Material slot API pattern:

```tsx
<ChatMessageList
  slotProps={{
    messageListContent: (ownerState) => ({
      className: ownerState.itemCount > 0 ? 'has-items' : 'empty',
    }),
  }}
/>
```

In the current implementation, that callback is flattened to `{}`.

Missing edge cases:

- Callback slot props on list root/scroller/content.
- Callback slot props on conversation title/avatar/actions.
- Callback `composerRoot` and `messageRoot` props via `ChatBox`.
- Theme-level callback slot props, where users are less likely to notice silent loss.

Expected fix direction: use `mergeSlotProps` consistently wherever a `SlotComponentProps` can be object or function, and add tests for every public slot family.

## P1 - `mergeSlotProps` itself clobbers base `className`, `sx`, and sometimes `ref`

Even where `mergeSlotProps` is used, the merge is a plain `{ ...base, ...consumer }` in both callback and object branches (`mergeSlotProps.ts:24-29`). That preserves callback shape, but it does not preserve the wrapper's own slot props.

Examples:

- `ChatMessageError` puts the utility class and top-level `sx` in `base` (`ChatMessageError.tsx:149-156`).
- `ChatUnreadMarker` does the same for root and label slots (`ChatUnreadMarker.tsx:75-86`).
- `ChatConversationHeader` puts the forwarded `ref` and utility class in `base` (`ChatConversationHeader.tsx:52-58`).

If a consumer supplies `slotProps.root.className`, the wrapper utility class is dropped. If they supply `slotProps.root.sx`, the top-level component `sx` is dropped. If they supply a slot ref on a header slot, the forwarded ref can be replaced.

Missing edge cases:

- `slotProps.root.className` plus theme `styleOverrides` that rely on the utility class.
- Top-level `sx` plus nested slot `sx`.
- Consumer slot refs on wrappers that also forward refs.
- Callback-form slot props returning `className` or `sx`.

Expected fix direction: merge `className` with `clsx`, layer `sx` arrays, and fork refs instead of value-spreading them.

## P1 - `ChatConversationList` slot spread order defeats its own fallbacks

`ChatConversationList` resolves Material defaults and then spreads raw `...slots` last (`ChatConversationList.tsx:709-724`). That makes the explicit `slots?.x ?? Default` entries dead for any provided key. If a consumer builds a slots object with an `undefined` key, the wrapper passes `undefined` through to the headless layer.

This is dangerous for `viewport`, `scrollbar`, and `scrollbarThumb`: the wrapper comments say it must replace the headless `ScrollArea` slots with a plain viewport and no-op scrollbars because the scroller is not `ScrollArea.Root` (`ChatConversationList.tsx:87-105`). The headless fallback is `ScrollViewport`, `ScrollScrollbar`, and `ScrollThumb` (`ConversationListRoot.tsx:366-369`). So a harmless `slots={{ scrollbar: undefined }}` can resurrect the exact SSR/context crash the wrapper is avoiding.

Missing edge cases:

- Conditional slots objects with `undefined` values.
- `ChatBox` forwarding nested `slotProps.conversationList.slots`.
- SSR rendering of a conversation list whose scrollbar slot fell back to the headless default.
- Regression tests that assert no Base UI scrollbar is rendered by the Material wrapper.

Expected fix direction: spread `...slots` first, then assign each resolved fallback after it.

## P1 - Tool-part `onToggle` is still clobbered

`ChatToolPartRoot` spreads `rest`, then overwrites `onToggle` with its internal handler (`ChatMessageContent.tsx:342-350`). Any `partProps.tool.slotProps.root.onToggle` or `partProps['dynamic-tool'].slotProps.root.onToggle` is silently discarded. That contradicts the apparent branch intent to preserve consumer tool-section toggle callbacks.

Missing edge cases:

- Analytics on tool expand/collapse.
- Consumer-controlled detail state.
- Consumers relying on `event.defaultPrevented`.
- Dynamic tool parts, not just static `tool` parts.

Expected fix direction: destructure `onToggle` from `rest`, call it, and then update internal state in a defined order.

## P2 - Keyboard overlay close still misses already-active selection

`ChatBoxContent` closes the narrow conversation overlay when `activeConversationId` changes (`ChatBoxContent.tsx:761-774`). The pointer path closes via the item `onClick` merge (`ChatBoxContent.tsx:351-364`), but the headless keyboard Enter path calls `setActiveConversation(id)` directly (`ConversationListRoot.tsx:552-555`).

If the overlay opens with conversation A already active and focus starts on A, pressing Enter calls `setActiveConversation(A)`. The id did not change, so the effect does not close the overlay. The focus trap remains open even though the user committed a selection.

Missing edge cases:

- Open overlay while the active conversation is already focused, press Enter.
- Re-select current conversation with keyboard.
- Controlled active conversation where the parent ignores a duplicate id update.

Expected fix direction: close on keyboard selection/commit, not on inferred id change alone.

## P2 - `useContainerWidth` is node-swap fragile

The container-width hook takes a ref object and its effect depends on `[ref]` (`ChatBoxContent.tsx:52-92`). A `RefObject` is stable, so the effect observes whichever node is current on the first run and never reattaches if the root node changes. `ChatBox` forwards a ref to the root element (`ChatBox.tsx:109-120`, `ChatBox.tsx:155-168`), so this is currently hidden by a stable root, but it is a regression-prone hook contract.

Missing edge cases:

- Root slot support replacing the root element.
- Parent toggles a `key` and the DOM node is swapped.
- Future conditional wrapper or portal refactor.
- Width remains frozen after observing a detached node.

Expected fix direction: track the actual node with a callback ref or state and observe/unobserve on node changes.

## P2 - `MessageGroup` injects private props into arbitrary children

The custom-children path clones every non-DOM React element and injects `isGrouped` and `groupAuthorName` (`MessageGroup.tsx:211-228`). This includes `React.Fragment`, which only accepts `key` and `children`, and arbitrary consumer wrapper components that may forward unknown props to the DOM. The fallback also uses `children ? ... : ...`, so `children={null}` renders the default message instead of no children (`MessageGroup.tsx:211-236`).

Missing edge cases:

- `<MessageGroup><React.Fragment>...</React.Fragment></MessageGroup>`
- `children={null}` used intentionally to suppress default rendering.
- A consumer wrapper component that forwards all props to a DOM node.
- Multiple children where only actual message children should receive grouping props.

Expected fix direction: only inject grouping props into known message components or pass grouping through context. Use `children !== undefined` if "provided children" is the branch condition.

## P2 - Compact conversation item actions are hover-only

Compact item actions start at `opacity: 0` (`ChatConversationList.tsx:297-315`) and are revealed only by a hover selector (`ChatConversationList.tsx:165-171`). Keyboard focus and touch interaction do not reveal the actions. The item itself has focus styles, but the action visibility does not follow focus.

Missing edge cases:

- Keyboard user tabs to a compact conversation item and cannot discover its actions.
- Touch user cannot hover.
- Screen magnifier / switch control users relying on visible affordances.

Expected fix direction: reveal on `:focus-within`, consider persistent visibility on coarse pointers, and add an accessibility test or screenshot state.

## P2 - Playground tab semantics are incomplete

`PlaygroundCard` renders `role="tablist"` (`PlaygroundCard.tsx:1240-1264`), but `TabButton` is just a `button` with `aria-selected` (`PlaygroundCard.tsx:529-600`). It has no `role="tab"`, no `aria-controls`, no `id`/panel linkage, and no arrow-key tab behavior.

Missing edge cases:

- Screen reader announces a tablist whose children are not tabs.
- Keyboard users expect Left/Right navigation inside the tablist.
- Panels are not tied to tabs by accessible relationships.

Expected fix direction: implement the full tab pattern or remove `role="tablist"` and treat them as ordinary toggle buttons.

## P2 - Classes editor textarea is unlabeled and parse errors are not announced

The classes editor uses a raw textarea (`PlaygroundCard.tsx:693-729`). Its visible selector/name is a sibling `Typography`, not a label, and the textarea has no `aria-label`. Parse errors are rendered as a sibling error caption (`PlaygroundCard.tsx:730-743`), but the textarea does not set `aria-invalid` and does not reference the error with `aria-describedby`.

Missing edge cases:

- Screen reader focus lands on an unlabeled multiline input.
- Parse error appears visually but is not announced.
- Multiple class editors on the same card need distinct labels/error ids.

Expected fix direction: add a real label relationship or `aria-label`, plus `aria-invalid` and `aria-describedby` when a parse error exists.

## P2 - Playground copy button can lie about success

`handleCopy` sets `copied` to true even when `navigator.clipboard` is missing (`PlaygroundCard.tsx:815-827`). In iframe or insecure contexts, this can display success without writing anything.

Missing edge cases:

- Docs iframe with clipboard API unavailable.
- Browser permission denied.
- User copies code and pastes stale clipboard contents.

Expected fix direction: only show success after an actual write or provide a fallback copy mechanism.

## P2 - `parseSx` accepts dangerous object keys and malformed comments

The parser writes parsed keys into a normal object (`parseSx.ts:76-92`) and accepts any bare identifier (`parseSx.ts:141-155`). Keys like `__proto__`, `constructor`, and `prototype` should be blocked or stored in a null-prototype object. The block-comment scanner also advances past EOF when the comment is unterminated instead of throwing (`parseSx.ts:249-258`).

Missing edge cases:

- `{ __proto__: { polluted: true } }`
- `{ constructor: { prototype: { x: 1 } } }`
- Unterminated `/*` comment in the classes editor.
- Nested class override objects containing unsafe keys.

Expected fix direction: use `Object.create(null)` for parsed objects and reject prototype-sensitive keys. Throw on unterminated block comments.

## P2 - Dirty `ChatUnreadMarker` Chip label has runtime/type drift and hand-copied PropTypes

The current dirty working-tree edit changes the default unread-marker label to a `Chip` adapter (`ChatUnreadMarker.tsx:42-56`) and then manually copies a large `Chip` PropTypes block into a private component (`ChatUnreadMarker.tsx:58-161`). At runtime, the default label can now receive Chip props through `slotProps.label`, but the inherited headless slot type is still `SlotComponentProps<'div'>` (`UnreadMarker.tsx:24-27`). The API is therefore both under-typed and over-documented internally.

Missing edge cases:

- `slotProps.label={{ color: 'primary', variant: 'outlined' }}` is useful at runtime but not represented by the public TypeScript type.
- A future MUI `ChipProps` change will not update this hand-copied PropTypes block.
- The private wrapper claims generated PropTypes even though it is not an exported API component.

Expected fix direction: either type the Material wrapper's label slot as Chip-compatible, or do not expose Chip-specific runtime props. Remove the private copied PropTypes and rely on the package PropTypes generation workflow for exported API.

## P3 - The component gallery is mostly schematic, not grounded in actual components

The gallery adds many hand-authored thumbnail primitives. That is maintainable only if the thumbnails are treated as illustrations, not component truth. Several cards also link multiple components to the same broad page (`components.tsx:95-157`), which makes the "all components" gallery poor as a component lookup surface.

Missing edge cases:

- A component visual changes but the hand-authored thumbnail stays stale.
- A user clicks `ChatMessageAvatar` expecting avatar API/docs and lands on a general messages guide.
- New component status or composition rules drift from the static gallery metadata.

Expected fix direction: deep-link cards to API pages or focused docs anchors, and prefer rendered component examples for thumbnails where practical.

## P3 - Review state is polluted by root-level scratch files

The working tree has many untracked screenshots, JSON dumps, a temporary Vale config, and local HTML at the repo root. This is not a runtime bug, but it makes the change set harder to review and easier to accidentally publish.

Expected fix direction: delete them or move them into an ignored scratch folder before asking for review.
