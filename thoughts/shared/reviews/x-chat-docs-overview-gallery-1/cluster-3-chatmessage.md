# Cluster 3 — ChatMessage rendering subsystem review

Branch: `x-chat-docs-overview-gallery`. Base for this branch's own work: `bd49bce7cf^2`.
Reviewer stance: hostile. Every claim below was verified against the actual source (file:line cited).

## Verdict

The subsystem is, annoyingly, mostly solid. The markdown renderer does **not** use
`dangerouslySetInnerHTML` anywhere (verified: `grep dangerouslySetInnerHTML` over
`packages/x-chat/src` returns nothing), so HTML/script injection is neutralized by React's
text-node escaping. The URL sanitizer actually blocks the obvious vectors
(`javascript:`, `data:`, and whitespace/control-char obfuscations — verified empirically).
No catastrophic backtracking in the inline regexes (lazy quantifiers keep them linear —
verified empirically against adversarial inputs). `mergeSlotProps` callback form is used
consistently, and custom props (`groupAuthorName`, `ownerState`, `classes`) are
destructured out before `...other` reaches the DOM in every sub-part I checked.

That said, there are real defects. Ranked below.

---

## HIGH

### H1 — `ChatToolPartRoot` clobbers a consumer's `onToggle` (the exact bug the section commit "fixed")

`packages/x-chat/src/ChatMessage/ChatMessageContent.tsx:324-352`

```tsx
function ChatToolPartRoot({ ownerState, ...rest }) {
  ...
  return (
    <ChatToolPartDetailsStyled
      {...(rest as ...)}              // rest can carry consumer onToggle (see below)
      ownerState={ownerState}
      open={open}
      onToggle={(event) => {         // <-- overwrites rest.onToggle entirely
        setOpen((event.currentTarget as HTMLDetailsElement).open);
      }}
    />
  );
}
```

The headless `ToolPart` builds `rootProps` via `useSlotProps({ externalSlotProps: resolvedSlotProps?.root, ... })`
(`packages/x-chat-headless/src/message/parts/ToolPart.tsx:204-213`), so a consumer override
`partProps.tool.slotProps.root.onToggle` flows into `rest`. `ChatToolPartRoot` then drops it on
the floor — its own `onToggle` is the last `onToggle` prop and wins.

**Why it matters:** This is precisely the defect that commit `1997fd0182`
("Forward consumer onToggle on tool sections without clobbering") fixed for `ChatToolPartSection`
(see lines 627-671, which correctly call `onToggleProp?.(event)`). The **root** disclosure was
missed, so the fix is half-applied. A consumer who wants to observe the tool card open/close
(analytics, controlled mirror) silently never receives the event from the root, while it works on
sections — an inconsistent, surprising API.

**Fix:** Mirror the section pattern — destructure `onToggle: onToggleProp` (and ignore a
consumer `open` the same way the section does) and call `onToggleProp?.(event)` after `setOpen`:

```tsx
function ChatToolPartRoot({ ownerState, onToggle: onToggleProp, open: _open, ...rest }) {
  ...
  onToggle={(event) => {
    setOpen((event.currentTarget as HTMLDetailsElement).open);
    onToggleProp?.(event);
  }}
```

Note: pre-existed at the base commit, but the branch's own onToggle sweep (`1997fd0182`) is what
makes the inconsistency glaring — converge it.

### H2 — `ChatToolPartRoot` auto-open never re-fires for `input-streaming`/output transitions

`packages/x-chat/src/ChatMessage/ChatMessageContent.tsx:332-340`

```tsx
const [open, setOpen] = React.useState(
  () => state === 'approval-requested' || state === 'input-streaming',
);
React.useEffect(() => {
  if (state === 'approval-requested') {
    // only this transition re-opens
    setOpen(true);
  }
}, [state]);
```

The lazy `useState` initializer captures the state at **mount only**. The element identity is
reused across streamed invocation-state updates (the headless renderer keeps the same component
instance — this is exactly the reasoning the _section_ code documents at lines 647-658). So:

- A tool that mounts in `input-available` and later transitions to `approval-requested` → handled
  by the effect (good).
- A tool that mounts in `input-available` and later transitions to `input-streaming` → the root
  stays **collapsed**, even though a freshly-mounted `input-streaming` tool auto-opens. Same
  inconsistency for a transition into `output-available` if the product wanted that.

The neighboring `ChatToolPartSection` solves the identical problem with an `initialOpen`-keyed
effect (lines 654-658). The root only special-cases `approval-requested`, contradicting its own
mount-time predicate (`input-streaming` is in the initializer but not the effect).

**Why it matters:** Streaming tool calls that arrive in `input-available` first and stream args
afterward render collapsed, hiding the live input the auto-open was designed to surface.

**Fix:** Compute `shouldAutoOpen = state === 'approval-requested' || state === 'input-streaming'`
once, and run `useEffect(() => { if (shouldAutoOpen) setOpen(true); }, [shouldAutoOpen])` —
matching the section's pattern so manual collapses survive but auto-open re-fires on the relevant
transitions.

---

## MEDIUM

### M1 — Imported `alpha()` instead of `theme.alpha()` — violates the documented CSS-vars convention

`packages/x-chat/src/ChatMessage/ChatMessageContent.tsx:5, 257, 264, 344`

```tsx
import { alpha } from '@mui/material/styles';     // line 5
...
background: isOwn ? alpha(theme.palette.common.white, 0.15) : ...   // 257, 264
... : alpha(theme.palette[palette].main, 0.12);                      // 344
```

This is the **only** file in `packages/x-chat/src` that imports `alpha` from styles (verified:
`grep -rln "import { alpha }"` returns just this file). The project convention (and your own
prompt) is: styled components must use `theme.alpha()`, never the imported `alpha()`, because under
the CSS-vars theme `theme.palette.*.main` is a `var(--…)` string and `alpha()` chokes on it →
SSR 500 / broken color. The author was clearly aware of the hazard — line 341's comment reads
"Use theme.palette (not theme.vars) for alpha so we always get a real color string" — which is a
workaround for using the wrong `alpha`. Under a CSS-vars theme `theme.palette.success.main` may
still be a channel-backed value; `theme.alpha()` is the sanctioned escape hatch.

**Why it matters:** Exactly the SSR/CSS-vars breakage the convention exists to prevent. The
`common.white` cases (257/264) happen to be literal hex so they survive, but line 344's
`theme.palette[palette].main` is the risky one.

**Fix:** Drop the import; use `theme.alpha(theme.palette[palette].main, 0.12)` etc. Pre-existed at
base, but this file is in-cluster and the convention is explicit.

### M2 — `ChatMessageError` card has no `role="alert"` / `aria-live`

`packages/x-chat/src/ChatMessageError/ChatMessageError.tsx:108-129`

The error card (`ChatMessageErrorRoot`, a plain `div`) renders the failure message and a retry
button with no `role="alert"`, `aria-live`, or `role="status"`. When a streaming response fails,
the card appears dynamically but is **never announced** to screen-reader users. The retry button
itself is a real `<Button type="button">` (good), but the failure context is silent.

**Why it matters:** A core a11y expectation for inline async error surfaces. Streaming chat failures
are precisely the dynamic-content case `aria-live`/`role="alert"` exists for.

**Fix:** Add `role="alert"` (or `role="status"` + `aria-live="polite"` if "alert" is too assertive
for transient retries) to `ChatMessageErrorRoot`.

### M3 — `getErrorCardBackground` hardcodes the Material red instead of deriving from `palette.error.main`

`packages/x-chat/src/ChatMessageError/ChatMessageError.tsx:24-32`

```tsx
function getErrorCardBackground(theme) {
  if (theme.vars) return `rgba(${theme.vars.palette.error.mainChannel} / 0.08)`;
  if (theme.palette.mode === 'dark') return 'rgba(244, 67, 54, 0.16)';
  return 'rgba(244, 67, 54, 0.08)';
}
```

The non-CSS-vars branches hardcode `244, 67, 54` (Material default error red). A consumer who
themes `palette.error.main` to a brand red/orange gets a **border + text** in their custom color
(those use `palette.error.main`, lines 55/57/83) but a **background** stuck on stock Material red —
visually mismatched. The vars branch correctly uses `error.mainChannel`; the fallback should too.

**Fix:** Use `theme.alpha(theme.palette.error.main, theme.palette.mode === 'dark' ? 0.16 : 0.08)`
for the non-vars branch (per the convention in M1).

---

## LOW

### L1 — Markdown link/image gaps: URLs with `)` break; images render as `!`+link

`packages/x-chat/src/ChatMessage/renderMarkdown.tsx:54-61`

Link regex `/\[([^\]]+)\]\(([^)]+)\)/` stops the URL at the first `)`, so legitimate URLs
containing parentheses (Wikipedia article URLs, etc.) truncate. Image syntax `![alt](url)` is not
handled — the `!` renders as literal text followed by a link. Not a security issue (sanitizer still
applies), purely fidelity. Acceptable for a deliberately-minimal renderer, but worth a comment or a
known-limitation note.

### L2 — Link label is not inline-parsed

`packages/x-chat/src/ChatMessage/renderMarkdown.tsx:56-60`

The link renderer emits `{m[1]}` raw, so `[**bold** label](url)` shows literal asterisks inside the
anchor. Bold/italic recurse via `parseInline` (lines 36/46) but links don't. Minor inconsistency.

### L3 — Tool section copy button extracts garbage if `sectionContent` children are elements

`packages/x-chat/src/ChatMessage/ChatMessageContent.tsx:781`

```tsx
const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
```

In the default path `children` is the formatted string from
`formatStructuredValue(value)` (headless `ToolPart.tsx:142`), so this works. But if a consumer
slots element children into `sectionContent`, `toArray(...).join('')` yields `"[object Object]"`
(verified empirically) — `text.length > 0` so the copy button renders and copies the literal string
`"[object Object]"`. Edge case, but a silent wrong-copy is worse than no button.

**Fix:** Guard `text` to only treat real strings as copyable, or recursively extract text nodes.

### L4 — `ChatMessageGroupAuthorNameStyled` `ownerState` typing but author label content not memoized

`packages/x-chat/src/ChatMessage/ChatMessageGroup.tsx:82-110` — cosmetic; no action needed beyond noting the styled object is recomputed per render (standard MUI, fine).

---

## NIT

### N1 — Inconsistent `shouldForwardProp` on `ownerState` styled components

`packages/x-chat/src/ChatMessage/ChatMessageContent.tsx:169` (`ChatMessageBubbleStyled`) omits the
explicit `shouldForwardProp: (prop) => prop !== 'ownerState'` that five sibling styled components
(lines 305/393/496/560/569) carry. Material's default slot `shouldForwardProp` already filters
`ownerState`, so there is **no actual DOM leak** here — but the inconsistency invites a future
reader to assume one of them is wrong. Make it uniform.

### N2 — `ChatToolPartSectionContent` ignores `ownerState` after destructuring (`_ownerState`)

`packages/x-chat/src/ChatMessage/ChatMessageContent.tsx:776-784` — correct (prevents leak), just
flagging the dead-named binding for clarity.

---

## Things I checked and found CLEAN (so the next reviewer doesn't redo them)

- **XSS via markdown:** no `dangerouslySetInnerHTML` anywhere in `packages/x-chat/src`. All parsed
  markdown becomes React children → text auto-escaped. `renderMarkdown.tsx`.
- **URL sanitizer:** `sanitizeUrl` (renderMarkdown.tsx:12-25) blocks `javascript:`, `data:`, and
  whitespace/tab/newline-obfuscated `javascript:` (URL parser strips control chars then protocol
  check rejects). Bare relative paths (no `:`) pass — correct and intended.
- **ReDoS:** all `INLINE_PATTERNS` use lazy `.+?`/negated char classes; no nested unbounded
  quantifiers. Verified linear on adversarial inputs (40+ asterisks, unterminated bold over 5k chars).
- **Streaming-partial markdown:** `normalizeMarkdownForRender` (partUtils.ts:49-57) auto-closes an
  odd trailing ``` fence — sensible.
- **Copy-to-clipboard race/failure:** `useCopyToClipboard` guards missing
  `navigator.clipboard.writeText`, clears prior reset timer before re-arming, and cleans up on
  unmount. No race. `ChatCodeBlock` copy button is `type="button"` with title feedback.
- **DOM prop leakage of custom props:** `groupAuthorName` destructured out in `ChatMessage.tsx:202`
  before `...other`; `classes` dropped (`void classesProp`) in every sub-part
  (Avatar/Meta/Actions/DateDivider/Content/Group); `ChatMessageErrorSlot` strips
  `ownerState`/`messageClassName`/`retryButtonClassName` before `...other` (ChatMessageError.tsx:88).
- **`groupKey` routing:** `ChatMessageGroup` correctly splits `messageGroup` slotProps so `groupKey`
  reaches the headless `<MessageGroup>` and non-DOM primitives don't leak onto the wrapper
  (ChatMessageGroup.tsx:150-156, 215-217).
- **Null slots hide + collapse layout:** `slots.avatar:null` → `noAvatar` class collapses the grid
  track (ChatMessage.tsx:218-219, 286; ChatMessageGroup.tsx:187, 226). `inlineMeta:null`/`meta:null`
  guarded (ChatMessage.tsx:252, 258). `authorName:null` → `HiddenAuthorName` returns null
  (ChatMessageGroup.tsx:112, 193-196). No null-slot crashes found.
- **ChatDateDivider:** no date formatting is done in this component — it delegates `formatDate` to the
  headless `MessageListDateDivider`. No locale/timezone bug introduced here.
- **Retry disable logic:** `ChatMessageErrorSlot` disables retry while streaming or message
  sending/streaming (ChatMessageError.tsx:102-106); headless returns null when no `chatError`, so
  `ownerState.retry`/`retryable` are always valid.
- **Sources missing url:** `ChatMessageSources` is a presentational list wrapper; per-source URL
  rendering lives in the headless `SourceUrlPart`/`ChatMessageSource`, out of this changeset's risk.
