# PR #22484 — Review Response, batch 2 (fresh codex pass, 2026-06-06)

A new codex review posted 5 P2 threads. Thread 6 (groupAuthorName leak) already fixed+resolved in
`d3c37af83c`. All 5 new ones touch `packages/x-chat` source (lives in #22482's base, not #22484's
docs commits).

| id         | path:line                          | summary                                          | verdict                 |
| ---------- | ---------------------------------- | ------------------------------------------------ | ----------------------- |
| 3365561356 | ChatMessageGroup.tsx:131           | classes prop dropped                             | RE-LITIGATES Option B   |
| 3365561366 | ChatMessageAvatar.tsx:51           | classes dropped on leaf parts                    | RE-LITIGATES Option B   |
| 3365561360 | ChatMessageGroup.tsx:193           | legacy group/authorName slot keys gone           | RE-LITIGATES flat vocab |
| 3365561370 | ChatComposerAttachmentList.tsx:127 | standalone attachment list never renders         | REAL bug (intent Q)     |
| 3365561372 | ChatBoxContent.tsx:521             | function-form suggestions root slotProps dropped | REAL bug                |

## 356 + 366 — challenge Option B (drop `classes` from sub-parts)

Factually correct: `useChatMessageUtilityClasses(undefined)`, `classes` no longer destructured →
`classes={{ group/avatar/... }}` is ignored. **But this is exactly the Option B change the user
approved last session** (sub-parts share the `MuiChatMessage-*` namespace and their `classes`
advertised wrong-prefixed classes). Verified **no demo passes `classes=`** to these parts, so no
doc breakage. Styling still available via theme `styleOverrides` + `slotProps` + `className`.
→ Lean **REJECT** (explain Option B rationale). User owns the call.

## 360 — challenge flat-slot vocab on Material ChatMessageGroup

Factually correct: standalone `ChatMessageGroup` only reads flat `messageGroup`/`messageAuthorName`;
old headless `group`/`authorName` keys no longer map. **But flat vocab is the intentional design
(never published / alpha), and docs use `messageGroup`** (slots-and-composition.md). No demo uses
`group`/`authorName` on the Material component. → Lean **REJECT** (by-design, alpha, documented).
User owns the call.

## 370 — REAL: standalone attachment list never renders

`DefaultAttachmentListContent` was changed to read from the store (`useChatComposer()`) so it works
"outside a ChatComposer" (its own comment). BUT the headless `ComposerAttachmentList` wrapper gates
on `useComposerContext()` whose default `attachments: []` → `if (length === 0) return null`. So
outside a `ChatComposer` the wrapper returns null and never renders the store-backed content. The
change is **incompletely applied** — confirmed contradiction. → **ACCEPT**, but needs the user's
intent: is "attachment list usable standalone" actually a goal? If yes, gate the wrapper on store
attachments (or drop the null-gate when no ComposerContext). If no, revert the store-read in
`DefaultAttachmentListContent`.

## 372 — REAL: function-form suggestions root slotProps dropped

`AboveComposerSuggestions` (active-thread path) does `consumerRootSlotProp.sx` and
`{ ...consumerRootSlotProp, sx: mergedRootSx }`. If `slotProps.suggestions.slotProps.root` is the
supported **function** form `(ownerState) => props`, `.sx` is undefined and spreading a function
yields `{}` → the function is silently dropped and replaced with `{ sx }`. The empty-state path
forwards it intact. → **ACCEPT**: handle the function form (wrap so the consumer fn runs and the
default sx is merged onto its result).

## Where fixes land

All in `packages/x-chat` source → fix in **#22482** + cascade (same as the prior two fixes).
