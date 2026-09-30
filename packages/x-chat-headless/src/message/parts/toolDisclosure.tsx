'use client';
import * as React from 'react';
import type { ToolPartOwnerState, ToolPartSectionOwnerState } from './ToolPart';

/**
 * Resolves the default expanded state of a tool disclosure (the card root or one
 * of its `input`/`output` sections).
 *
 * Return `true`/`false` to control the disclosure (applied on every state
 * transition — return `false` to collapse a card when its tool ends), or
 * `undefined` to defer to the built-in default for that disclosure.
 *
 * `ownerState.section` is `'input'` or `'output'` for a section, and `undefined`
 * for the card root — branch on it to scope a policy to the card or its sections.
 * @param {ToolPartOwnerState & { section?: 'input' | 'output' }} ownerState The disclosure's owner state.
 * @returns {boolean | undefined} `true`/`false` to control the disclosure, or `undefined` to use the built-in default.
 */
export type ChatToolGetExpanded = (
  ownerState: ToolPartOwnerState & { section?: 'input' | 'output' },
) => boolean | undefined;

/**
 * A per-tool default-expansion policy: a static `boolean` (applied to the card
 * and its sections) or a {@link ChatToolGetExpanded} resolver for finer control.
 */
export type ChatToolExpand = boolean | ChatToolGetExpanded;

/**
 * Carries the tool's resolved expansion policy (already bound to a single tool
 * name) from the headless `ToolPart` down to the disclosure slots. `undefined`
 * means "no policy — use the built-in default".
 * @ignore - internal
 */
export const ToolDisclosureContext = React.createContext<ChatToolGetExpanded | undefined>(
  undefined,
);

if (process.env.NODE_ENV !== 'production') {
  ToolDisclosureContext.displayName = 'ToolDisclosureContext';
}

/**
 * Owns the open/close state of a single tool disclosure (the card root or a
 * section) shared by `@mui/x-chat` and any custom `<details>`-based slot.
 *
 * Resolution per render:
 * - When the bound policy returns a `boolean` (authoritative), it is applied on
 *   every transition — both edges — so a consumer can expand while a tool runs
 *   and collapse it when the tool ends. A manual user toggle is respected until
 *   the next transition.
 * - When the policy returns `undefined` (or there is no policy), `builtInOpen`
 *   drives the state with rising-edge-only semantics: it forces the disclosure
 *   open when it becomes `true`, and never auto-collapses (the package default).
 *
 * Pass `disclosureRef` (a ref to the `<details>` element) to keep focus safe:
 * when the disclosure collapses while it holds focus, focus moves to its
 * `<summary>` instead of being dropped to `<body>`.
 *
 * @ignore - internal
 */
export function useToolDisclosure(
  ownerState: ToolPartOwnerState | ToolPartSectionOwnerState,
  builtInOpen: boolean,
  disclosureRef?: React.RefObject<HTMLDetailsElement | null>,
): readonly [boolean, (next: boolean) => void] {
  const getExpanded = React.useContext(ToolDisclosureContext);
  const resolved = getExpanded?.(ownerState);
  const authoritative = resolved !== undefined;
  const desired = authoritative ? (resolved as boolean) : builtInOpen;

  const [open, setOpen] = React.useState(desired);
  // Apply the policy on each `desired` transition by adjusting state during render
  // (no effect, no extra paint). Authoritative policies drive both edges so a
  // consumer can collapse a card when its tool ends; the built-in default only ever
  // forces open (rising edge) and never auto-collapses. A manual toggle is therefore
  // respected until the next transition.
  const [prevDesired, setPrevDesired] = React.useState(desired);
  if (desired !== prevDesired) {
    setPrevDesired(desired);
    if (authoritative || desired) {
      setOpen(desired);
    }
  }

  React.useEffect(() => {
    if (open || !disclosureRef?.current) {
      return;
    }
    const el = disclosureRef.current;
    const active = el.ownerDocument.activeElement;
    if (active && el.contains(active)) {
      const summary = el.querySelector('summary');
      if (summary && summary !== active) {
        (summary as HTMLElement).focus();
      }
    }
  }, [open, disclosureRef]);

  return [open, setOpen] as const;
}
