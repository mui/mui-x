'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { useMessageContext } from '../../message/internals/MessageContext';
import type { UseRovingFocusReturn } from '../../internals/useRovingFocus';

/**
 * Roving focus state for the message list, published through an external-store
 * subscription instead of plain context values. Context identity changing on
 * every focus move would punch through `DefaultMessageItem`'s `React.memo` and
 * re-render every message (markdown trees included) per arrow press; with the
 * subscription only the one or two affected articles re-render.
 */
export interface MessageRovingState {
  /** The id holding the single `tabIndex={0}` stop. */
  focusedId: string | undefined;
  /** The message whose interior controls are currently drilled into (Enter). */
  actionableId: string | undefined;
}

export interface MessageRovingContextValue {
  subscribe(listener: () => void): () => void;
  getState(): MessageRovingState;
  registerItemRef(id: string, element: HTMLElement | null): void;
  onItemFocus(id: string): void;
  onItemKeyDown(event: React.KeyboardEvent<HTMLElement>, id: string): void;
  onItemBlur(event: React.FocusEvent<HTMLElement>, id: string): void;
}

const MessageRovingContext = React.createContext<MessageRovingContextValue | null>(null);

export const MessageRovingProvider = MessageRovingContext.Provider;

export function useMessageRovingContext(): MessageRovingContextValue | null {
  return React.useContext(MessageRovingContext);
}

const noopSubscribe = () => () => {};

/**
 * Per-article subscription to the roving state. Only re-renders the consuming
 * article when *its own* focused/actionable flags flip.
 */
export function useMessageRovingItem(messageId: string): {
  enabled: boolean;
  focused: boolean;
  actionable: boolean;
} {
  const context = React.useContext(MessageRovingContext);
  const focused = React.useSyncExternalStore(
    context?.subscribe ?? noopSubscribe,
    () => (context == null ? false : context.getState().focusedId === messageId),
    () => (context == null ? false : context.getState().focusedId === messageId),
  );
  const actionable = React.useSyncExternalStore(
    context?.subscribe ?? noopSubscribe,
    () => (context == null ? false : context.getState().actionableId === messageId),
    () => false,
  );

  return { enabled: context != null, focused, actionable };
}

/**
 * Whether interactive content inside the surrounding message should currently
 * be part of the tab order.
 *
 * Inside a roving message list, interior controls (links, copy buttons,
 * collapsible tool output, …) stay out of the tab order (`tabIndex={-1}`)
 * until the user drills into the focused message with Enter — this is what
 * keeps the whole list a single tab stop. They remain mouse-clickable
 * throughout.
 *
 * Outside a roving list (standalone message composition, `enableRovingFocus`
 * off), this returns `true` so controls keep their natural tab order.
 */
export function useMessageActionable(): boolean {
  const context = React.useContext(MessageRovingContext);
  const { messageId } = useMessageContext();
  const actionable = React.useSyncExternalStore(
    context?.subscribe ?? noopSubscribe,
    () => (context == null ? true : context.getState().actionableId === messageId),
    () => context == null,
  );

  return actionable;
}

/**
 * The managed `tabIndex` for an interactive element inside a message:
 * `undefined` (natural tab order) while the surrounding message is actionable
 * or outside a roving list, `-1` otherwise. Apply to links, buttons, and
 * `<summary>` elements rendered inside message content so the message list
 * stays a single Tab stop.
 */
export function useMessageContentTabIndex(): number | undefined {
  return useMessageActionable() ? undefined : -1;
}

// Elements that would naturally be focusable, regardless of the managed
// `tabindex="-1"` the roving list applies to them while not drilled in.
const FOCUSABLE_CANDIDATE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  'summary',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',');

export function hasFocusableContent(article: HTMLElement): boolean {
  return article.querySelector(FOCUSABLE_CANDIDATE_SELECTOR) != null;
}

/**
 * Focus the first focusable descendant. Iterates candidates and verifies the
 * focus took (visibility-hidden or otherwise unfocusable elements fail
 * silently), so no fragile computed-style visibility checks are needed.
 */
export function focusFirstFocusableDescendant(article: HTMLElement): boolean {
  const candidates = article.querySelectorAll<HTMLElement>(FOCUSABLE_CANDIDATE_SELECTOR);

  for (let i = 0; i < candidates.length; i += 1) {
    const candidate = candidates[i];
    candidate.focus();
    if (document.activeElement === candidate) {
      return true;
    }
  }

  return false;
}

export interface UseMessageRovingControllerParameters {
  enabled: boolean;
  roving: UseRovingFocusReturn;
}

/**
 * Bridges a `useRovingFocus` instance into the subscription-based
 * `MessageRovingContext` value and layers the Enter-to-drill-in / Escape
 * interaction on top of the roving keyboard handling.
 *
 * The returned context value is referentially stable for the lifetime of the
 * list — handlers read the latest roving callbacks through refs.
 */
export function useMessageRovingController(
  params: UseMessageRovingControllerParameters,
): MessageRovingContextValue | null {
  const { enabled, roving } = params;

  // Latest-ref pattern (same idiom as ChatMessageList's slot refs): handlers
  // stay stable while always seeing the current roving callbacks.
  const rovingRef = React.useRef(roving);
  rovingRef.current = roving;

  const stateRef = React.useRef<MessageRovingState | null>(null);
  if (stateRef.current == null) {
    stateRef.current = { focusedId: roving.effectiveFocusedId, actionableId: undefined };
  }
  const listenersRef = React.useRef(new Set<() => void>());

  const contextValue = React.useMemo<MessageRovingContextValue>(() => {
    const notify = () => {
      listenersRef.current.forEach((listener) => listener());
    };

    const setState = (partial: Partial<MessageRovingState>) => {
      const current = stateRef.current!;
      const next = { ...current, ...partial };
      if (next.focusedId === current.focusedId && next.actionableId === current.actionableId) {
        return;
      }
      stateRef.current = next;
      notify();
    };

    return {
      subscribe: (listener: () => void) => {
        listenersRef.current.add(listener);
        return () => {
          listenersRef.current.delete(listener);
        };
      },
      getState: () => stateRef.current!,
      registerItemRef: (id: string, element: HTMLElement | null) => {
        rovingRef.current.registerItemRef(id, element);
      },
      onItemFocus: (id: string) => {
        // Any focus landing inside a message (keyboard or mouse) claims the
        // roving tab stop for that message.
        rovingRef.current.setFocusedId(id);
      },
      onItemKeyDown: (event: React.KeyboardEvent<HTMLElement>, id: string) => {
        if (event.target !== event.currentTarget) {
          // Focus is on a descendant (drilled in). Arrow keys & co. must not
          // move between messages; only Escape returns to the article.
          if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            setState({ actionableId: undefined });
            rovingRef.current.focusItem(id);
          }
          return;
        }

        if (event.key === 'Enter') {
          // Drill into the message's interior controls. No-op when the
          // message has no focusable content.
          const article = event.currentTarget as HTMLElement;
          if (hasFocusableContent(article)) {
            event.preventDefault();
            setState({ actionableId: id });
          }
          return;
        }

        rovingRef.current.handleKeyDown(event, id);
      },
      onItemBlur: (event: React.FocusEvent<HTMLElement>, id: string) => {
        if (stateRef.current!.actionableId !== id) {
          return;
        }

        // Focus left the article entirely (e.g. Tab to the composer): exit
        // drill-in so this message's controls leave the tab order again, but
        // do not steal focus back.
        const nextTarget = event.relatedTarget as Node | null;
        const article = event.currentTarget as HTMLElement;
        if (nextTarget == null || !article.contains(nextTarget)) {
          setState({ actionableId: undefined });
        }
      },
    };
  }, []);

  // Publish roving focus changes to subscribers (before paint, so the
  // tabindex topology is correct by the time the frame is shown).
  useEnhancedEffect(() => {
    const current = stateRef.current!;
    if (current.focusedId !== roving.effectiveFocusedId) {
      stateRef.current = { ...current, focusedId: roving.effectiveFocusedId };
      listenersRef.current.forEach((listener) => listener());
    }
  }, [roving.effectiveFocusedId]);

  return enabled ? contextValue : null;
}
