# PR #22484 — Review Response (x-chat-docs-playground-infra)

"[docs] Add chat playground infrastructure" — stacked on #22483.

## Thread inventory (6 inline threads)

| #   | id         | author   | path                                        | status         | disposition              |
| --- | ---------- | -------- | ------------------------------------------- | -------------- | ------------------------ |
| 1   | 3259194371 | codex P1 | sendMessageActions.ts (interim onFinish)    | RESOLVED       | fixed lower (1dba6392bf) |
| 2   | 3259194374 | codex P1 | sendMessageActions.ts (resume sequence)     | RESOLVED       | fixed lower (1dba6392bf) |
| 3   | 3259221543 | Copilot  | x-chat-headless/index.ts (scope)            | RESOLVED       | stack-noise reply        |
| 4   | 3259221613 | Copilot  | PaperBubble.tsx (.preview)                  | RESOLVED       | outdated (3fa4c60399)    |
| 5   | 3259221639 | Copilot  | SlotBasicReplacement.tsx (.preview)         | RESOLVED       | outdated (3fa4c60399)    |
| 6   | 3365462064 | codex P2 | MessageGroup.tsx:226 (compact author label) | **UNRESOLVED** | NEEDS DISCUSSION         |

## Thread 6 — the only open item (genuine design tension)

**Claim (codex P2):** In compact variant, `MessageGroup`'s children branch now passes the author
label via a `groupAuthorName` prop (cloned onto the child) instead of injecting it into the child's
`children`. Only the Material `ChatMessage` consumes `groupAuthorName`. Headless `Message.Root` /
arbitrary custom children ignore it → in compact, the group author label disappears, AND the unknown
`groupAuthorName` prop leaks to the DOM (React dev warning).

**Verification — CONFIRMED, but narrow:**

- `MessageGroup` is **public API** (`@mui/x-chat-headless`), and the documented headless pattern is
  exactly `<MessageGroup>…<Message.Root>…</Message.Root></MessageGroup>` (5 docs examples:
  intercom-style, custom-message-part-rendering, two-pane-inbox, indicators-in-context,
  grouped-message-timeline).
- `MessageRoot` destructures only known props and spreads `...other` to its root `<div>`, so a cloned
  `groupAuthorName` **does** reach the DOM → React "unrecognized prop" warning + label not rendered.
- **BUT** the clone guard (`typeof child.type === 'string'` → returned unmodified) means plain DOM
  children never get the prop — only component children (ChatMessage / MessageRoot) do.
- **AND** all 5 headless examples use the **default** variant. `compactAuthorName` is non-null only in
  compact, so none of the shipped examples trigger this today. It bites only: headless composition +
  `variant="compact"` + relying on the auto author label.

**Root tension (this is why it needs a decision):** the prop-based approach was introduced in
`e6a68662a4` specifically to satisfy **#22483 thread 8** (codex P2: "compact custom children must
render children-only — don't append built-in content"). The _old_ behavior (prepend
`compactAuthorName` into the child's `children`) worked for any child but violated children-only.
So the two codex asks are in direct tension:

- #22483/8 wants: custom children in compact render _only_ what the consumer passed.
- #22484/6 wants: custom children in compact still get the auto author label.

You can't fully satisfy both with one rule. Options:

- **A — Make safe, keep Material contract (recommended):** treat `groupAuthorName` as a documented
  Material-`ChatMessage` prop; stop it leaking by having headless `MessageRoot` swallow it (destructure
  - drop, don't forward). Headless compact composers render the author label themselves (they already
    pass `slots={{ authorName }}` and own the layout). Preserves #22483/8. Smallest, lowest-risk.
- **B — Restore label for non-consuming children:** render `compactAuthorName` as a fallback inside
  the group for children that don't consume it — but headless can't detect "did the child consume it",
  risks double-rendering for ChatMessage. Higher complexity/risk.
- **C — Reject:** prop approach is intentional; compact headless composition is undocumented today
  (all examples default variant); the leak is a dev-only warning. Reply + resolve, no code change.

**Disposition: NEEDS DISCUSSION** — pick A/B/C. If A, fix lives in #22482 (`MessageRoot.tsx`,
headless) then cascade, consistent with the toggle fix.
