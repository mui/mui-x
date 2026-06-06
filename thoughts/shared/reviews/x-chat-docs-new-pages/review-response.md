# PR #22483 — Review Response (x-chat-docs-new-pages)

"[docs] Add chat docs page shells" — stacked on #22482.

## Thread inventory (9 inline review threads)

| #   | id         | author   | path                                          | status         | disposition              |
| --- | ---------- | -------- | --------------------------------------------- | -------------- | ------------------------ |
| 1   | 3259210160 | Copilot  | scripts/x-chat.exports.json                   | RESOLVED       | stack-noise, replied     |
| 2   | 3259210216 | Copilot  | api/chat/message-error.json (dup imports)     | RESOLVED       | fixed lower (9941d6e3dc) |
| 3   | 3259225091 | codex P1 | sendMessageActions.ts (reconnect floor)       | RESOLVED       | fixed lower (1dba6392bf) |
| 4   | 3259225098 | codex P2 | createAiSdkAdapter.ts (attachments)           | RESOLVED       | fixed lower (849b199246) |
| 5   | 3363437500 | codex P2 | DefaultMessageItem.tsx (messageGroup)         | RESOLVED       | fixed e6a68662a4         |
| 6   | 3363464576 | Copilot  | chat-message-meta.json (noAvatar)             | RESOLVED       | fixed e6a68662a4         |
| 7   | 3363712977 | codex P1 | DefaultMessageItem.tsx (messageGroup)         | RESOLVED       | fixed e6a68662a4         |
| 8   | 3363712985 | codex P2 | ChatMessage.tsx (compact children)            | RESOLVED       | fixed e6a68662a4         |
| 9   | 3364226170 | codex P2 | ChatMessageContent.tsx:660 (section onToggle) | **UNRESOLVED** | analysis below           |

Issue-level comments: only CI/bot conflict notices + `@codex review` triggers — no action.
Review summaries: bot overviews — no extra inline items.

## Thread 9 — the only open item

**Claim (codex P2):** In `ChatToolPartSection`, the `<details>` is controlled (`open={open}`)
with an internal `onToggle` that calls `setOpen`. `{...rest}` is spread _after_ `open`/`onToggle`.
A consumer-supplied `slotProps.section.onToggle` (or per-tool `toolSlotProps`) flows through
`useSlotProps` into `rest`, clobbering the internal updater. Because `open` is React-controlled,
clicking the summary then no longer updates state → the section is stuck.

**Verification — CONFIRMED:**

- `ToolPart.tsx:123` `useSlotProps({ elementType: Section, externalSlotProps: slotProps?.section })`
  merges consumer `onToggle` into `sectionProps`, spread as `<Section {...sectionProps} />`.
- `ChatMessageContent.tsx:627` `ChatToolPartSection({ ownerState, ...rest })` → `rest` carries it.
- `:653-661` renders `<ChatToolPartSectionDetails open={open} onToggle={internal} {...rest} />` —
  `{...rest}` last, so consumer `onToggle` wins, internal `setOpen` never fires. A consumer
  `open` would also override the controlled state.

**Provenance:** introduced by `285865c405 [x-chat] Harden material message surfaces`, which lives
**below #22482's tip** — i.e. in the base shared by the whole stack. #22483's own commits
(`6db1d219e2..HEAD`) do **not** touch `ChatMessageContent.tsx`. So, like threads 2–8, the source
fix belongs in **#22482** (then cascade), not in the docs page-shell PR.

**Proposed fix (small, safe):** compose instead of clobber — pull `onToggle`/`open` out of `rest`,
keep `open={open}` after `{...rest}` so the control can't be overridden, and chain the consumer's
handler:

```tsx
function ChatToolPartSection({ ownerState, onToggle: onToggleProp, open: _openProp, ...rest }) {
  ...
  return (
    <ChatToolPartSectionDetails
      ownerState={ownerState}
      {...rest}
      open={open}
      onToggle={(event) => {
        setOpen(event.currentTarget.open);
        onToggleProp?.(event);
      }}
    />
  );
}
```

Keeps internal disclosure controlled, lets consumers _observe_ toggling, ignores an attempt to
override `open`. Add a regression test (consumer `slotProps.section.onToggle` fires AND section
still toggles).

**Disposition: ACCEPT** — valid edge-case regression, low-risk fix. Open question: fix in #22482 +
re-cascade (consistent with threads 2–8), vs. reply-and-resolve as a known follow-up.
