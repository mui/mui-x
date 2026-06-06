# Cluster 1 — Slot/Customization Infrastructure & Slot Vocabulary

Branch: `x-chat-docs-overview-gallery` · Base: `bd49bce7cf^2`

Files in scope:

- `packages/x-chat/src/internals/mergeSlotProps.ts` (+ `.test.ts`)
- `packages/x-chat/src/internals/ChatSlotsContext.tsx`
- `packages/x-chat/src/internals/useCopyToClipboard.ts`
- `packages/x-chat/src/ChatBox/ChatBox.types.ts`
- `packages/x-chat/src/index.ts`, `ChatBox/index.ts`
- `packages/x-chat/src/themeAugmentation/*`

I traced the full data path: leaf wrapper builds `base = {className, sx, ...}` → `mergeSlotProps(base, consumer)` → passed as a _single_ `externalSlotProps` into the headless component's `useSlotProps` (`@mui/utils`). Crucially, the headless `useSlotProps` is called WITHOUT a `getSlotProps`, so MUI's own merge takes the "simpler case" branch (`node_modules/@mui/utils/mergeSlotProps/mergeSlotProps.js:31-55`): it does NOT chain event handlers and only clsx's `className` _between_ its own additionalProps/forwardedProps and this one `externalSlotProps` — it does NOT re-merge the two things our `mergeSlotProps` already collapsed. **Whatever `mergeSlotProps` produces for `className`/`sx`/handlers is final on the consumer seam.** That makes the merge semantics below load-bearing, not cosmetic.

---

## BLOCKER / HIGH

### [HIGH] `mergeSlotProps` clobbers `className` instead of chaining — drops the component's own utility classes

`packages/x-chat/src/internals/mergeSlotProps.ts:24-29`

`mergeSlotProps` is a pure spread: `{ ...base, ...consumer }`. `base.className` is `clsx(classes.root, className)` (the component's utility class + the top-level `className` prop) at ~20 call sites (e.g. `ChatMessageError.tsx:151`, `ChatUnreadMarker.tsx:64`, `ChatMessageActions.tsx:80`). When a consumer supplies `slotProps.<x> = { className: 'custom' }`, the spread makes the consumer win and **`classes.root` is silently dropped**.

Why it matters: the slot loses its own `chat*Classes.*` hook, so (a) the component's own styleOverrides / theme variants stop applying, and (b) any CSS/test targeting `.MuiChatX-root` breaks — purely by the consumer adding a className via slotProps. The downstream `@mui/utils` merge does NOT save you here because our helper already collapsed both classNames into one string. The test even _encodes_ this as intended (`mergeSlotProps.test.ts:9-15` asserts `className: 'custom'`, base className gone), so it's deliberate but wrong.

Fix: clsx the classNames instead of clobbering:

```ts
const merged = { ...base, ...resolved };
merged.className = clsx(base.className, resolved.className) || undefined;
```

Apply in both the object and callback branches.

### [HIGH] `mergeSlotProps` clobbers `sx` — top-level `sx` prop is dropped when the consumer also uses `slotProps`

`packages/x-chat/src/internals/mergeSlotProps.ts:24-29`; bases at e.g. `ChatMessageError.tsx:152`, `ChatMessageActions.tsx:81`, `ChatUnreadMarker.tsx:65` (14 call sites pass `sx` into the base).

Same clobber problem for `sx`. The wrapper forwards the user's top-level `<ChatMessageActions sx={...}>` into `base.sx`. If the consumer _also_ sets `slotProps.actions = { sx: {...} }`, the spread drops the top-level `sx` entirely (last-wins). Two supported ways to set `sx`, one silently wipes the other. MUI convention is to merge into an array so both layer.

Fix: `merged.sx = [base.sx, resolved.sx].flat().filter(Boolean)` (or the standard `[...(Array.isArray(base.sx)?base.sx:[base.sx]), ...]` pattern). The local `mergeLayoutSlotProps`/`mergeRootSx` in `ChatBoxContent.tsx` already do array-style sx layering — the shared helper is the inconsistent one.

### [HIGH] `ref` routed through `mergeSlotProps` → ref-forwarding silently broken if a consumer sets `slotProps.header.ref`

`packages/x-chat/src/ChatConversation/ChatConversationHeader.tsx:52-58`

`base` includes `ref`. `mergeSlotProps` spreads consumer over base, so a consumer `slotProps.header = { ref: myRef }` makes the consumer ref win and the component's forwarded `ref` is dropped (only one ref survives into `useSlotProps`, which then `useForkRef`s just that survivor — `node_modules/@mui/utils/useSlotProps/useSlotProps.js:36`). The component's own ref forwarding is defeated by a consumer slotProp. `ref` should never be merged by a value-spread helper; it should be forked. Either keep `ref` out of `mergeSlotProps` and pass it via `additionalProps`/headless ref forking, or have the helper fork refs explicitly.

---

## MEDIUM

### [MEDIUM] Two divergent merge helpers with inconsistent semantics — the shared one is the worse one

`packages/x-chat/src/internals/mergeSlotProps.ts` vs `packages/x-chat/src/ChatBox/ChatBoxContent.tsx:366-397` (`mergeConversationListLayoutSlotProps`, `mergeLayoutSlotProps`) and `:610-619` (`rootSlotProp`), `:657-660` (emptyState).

`ChatBoxContent` reimplements callback-form resolution four times locally, and its versions correctly join `className` and deep-merge `style`/layer `sx` — i.e. they do the right thing that the _shared_ `mergeSlotProps` does not. So the codebase has two merge vocabularies with different precedence rules, and the exported "canonical" helper used by ~20 leaf components is the one with the className/sx clobber bugs above. This is an API-design smell: fix `mergeSlotProps` to be the single correct implementation, then collapse the bespoke `ChatBoxContent` helpers onto it. Until then, behavior depends on which code path a slot happens to take.

### [MEDIUM] `mergeSlotProps` does not chain event handlers, but its doc claims it preserves them

`packages/x-chat/src/internals/mergeSlotProps.ts:11-14`

The docstring says spreading "drops owner-state-driven className/sx/**handlers**", implying the helper preserves handlers. It does not — it spreads, so if a base ever sets `onClick` and a consumer sets `onClick`, one clobbers the other (no chaining, no `defaultPrevented` short-circuit). Today no `base` passes an event handler (verified across all 20 call sites: bases carry only `className`/`sx`/`ref`/`*ClassName`), so this is latent, not live. But the project already has a correct chaining primitive (`x-chat-headless/src/internals/mergeReactProps.ts`) and `ChatBoxContent.tsx:358-361` hand-chains `onClick` for the drawer — proving the need exists. The shared helper should chain `on[A-Z]*` keys (or the doc should stop claiming it does). As written it's a trap for the next person who adds a handler to a base.

### [MEDIUM] `emptyState` slot type says `'div'` but is rendered as an arbitrary consumer component with `sx` spread onto it

`ChatBox.types.ts:238` (`emptyState?: SlotComponentProps<'div', { sx }, {}>`) vs `ChatBoxContent.tsx:653-660, 999` (`<CustomEmptyStateComponent {...customEmptyStateProps} />`).

`slots.emptyState` is a user component (any element type), but its slotProps are typed against `'div'`, and the resolved props (which may include `sx`) are spread directly onto the user component. If the user's emptyState is a plain DOM element or a non-sx-aware component, `sx` (and any other non-DOM prop) leaks to the DOM and React warns. Either type it honestly (`React.ElementType`-agnostic) and document that `sx` requires an sx-aware component, or render it through an sx-capable wrapper.

### [MEDIUM] Context value churns on every render unless the consumer memoizes `slots`/`slotProps`

`ChatBox.tsx:162` + `ChatSlotsContext.tsx:38-41`

`ChatBox` forwards `slots`/`slotProps` straight into `<ChatSlotsProvider>`, whose `useMemo` is keyed on `[slots, slotProps]`. Docs/examples pass inline object literals (`slots={{...}}`), which have a fresh identity each render, so the memo recomputes → new context value → every `useChatSlots()` consumer (`ChatBoxContent` x3, `DefaultMessageItem`) re-renders on every ChatBox render. The `useMemo` gives a false sense of stability. This is the conventional MUI footgun, but worth a `useFirstRender`-style structural memo or at least a comment that consumers should memoize. Low severity in practice, real in streaming chat where ChatBox re-renders frequently.

---

## LOW / NIT

### [LOW] `useCopyToClipboard` can call `setState` after unmount (async race)

`packages/x-chat/src/internals/useCopyToClipboard.ts:34-41`

`navigator.clipboard.writeText(...).then(() => setCopyState('copied'))` can resolve after the component unmounts (clipboard write is async; user can navigate away). Cleanup clears the _timer_ (`:15-21`) but does not guard the success `setState`, so an unmounted-update warning is possible. Capture a mounted ref and bail in the resolve callback. Minor — React 18 downgrades this to a no-op warning, but it's sloppy.

### [LOW] `useCopyToClipboard` has no fallback for insecure contexts / missing Clipboard API — it silently no-ops with no user feedback

`useCopyToClipboard.ts:27-32`

The guard correctly avoids throwing when `navigator.clipboard.writeText` is unavailable (http origins, older browsers), but `copy()` then does nothing AND `copyState` never changes, so the UI gives zero feedback (no "Copied", no error). For a copy button that's a dead button on insecure origins. Consider a `document.execCommand('copy')` fallback or at least surfacing an unsupported state. Acceptable as a v1 limitation; flagging as a known gap.

### [LOW] `messageInlineMeta` / `messageAuthorName` slotProps typed as `Record<string, unknown>` while siblings are `Partial<...Props>`

`ChatBox.types.ts:178, 181`

Every other entry in `ChatBoxMessageSlotProps` is `Partial<ChatXProps>`; these two are `Record<string, unknown>`, which disables all prop type-checking/autocomplete for those slots. If there genuinely is no props interface for the inline-meta/author-name elements, say so with a comment; otherwise tighten to the real prop type. Inconsistent and weakens the "flat vocabulary is fully typed" promise.

### [NIT] Pervasive `as any` at every `mergeSlotProps` call site

e.g. `ChatMessageActions.tsx:84`, `ChatUnreadMarker.tsx:68`, `ChatSuggestions.tsx:82`, etc.

Every consumer casts the result `as any`. The helper's return type is `Record<string,unknown> | ((os)=>...)`, which doesn't line up with the headless `SlotComponentProps<...>`, forcing the cast everywhere. The cast erases type-safety exactly at the slot seam where mistakes are easy. Consider making `mergeSlotProps` generic over the slot's prop type and returning `SlotComponentProps<...>` so the casts disappear.

### [NIT] `SlotComponentProps<any, ...>` in the helper signature

`mergeSlotProps.ts:21`

`SlotComponentProps<any, Record<string, unknown>, OwnerState>` uses `any` for the element type, contributing to the `as any` cascade above. Parameterize the element type.

---

## What's actually good (so the team doesn't "fix" it)

- `null`-means-hide is correctly preserved by keeping default resolution inline (`slots.x ?? Default`) rather than pre-merging a defaults map — see the deliberate note in `ChatSlotsContext.tsx:7-13`. Don't refactor that into a merged map.
- `useChatSlots` returns a shared `EMPTY_SLOTS` singleton (`ChatSlotsContext.tsx:16,50`) — good, avoids a new object per standalone render.
- `useHasChatSlotsProvider` (`:58-60`) cleanly distinguishes "nested in ChatBox" vs "standalone" so `ChatMessageList` doesn't shadow ChatBox's provider.
- Callback-form (`(ownerState) => props`) IS handled by `mergeSlotProps` (`:23-28`) and the inline resolvers; the nullish-return case is covered (`:26`, test `:35-41`).
- `useCopyToClipboard` timer cleanup on unmount is present and correct (`:15-21`); the optional-chain Clipboard-API guard avoids SSR/test crashes.
- themeAugmentation changes (`MuiChatMessageError` across `components.ts`/`overrides.ts`/`props.ts`) are consistent and complete.
- Internals (`mergeSlotProps`, `ChatSlotsProvider`, `useChatSlots`, `useCopyToClipboard`) are correctly NOT re-exported from `src/index.ts` — they stay private.

## Note on `theme.alpha()` rule

No `styled` components live in this cluster, so the "use `theme.alpha()` not imported `alpha()`" rule has nothing to bite on here. (The styled wrappers that this infra feeds — `ChatMessageErrorSlot` et al. — are outside this cluster; verify there separately.)
