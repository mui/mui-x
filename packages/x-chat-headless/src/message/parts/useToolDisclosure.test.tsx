import * as React from 'react';
import { act, createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatToolInvocationState } from '../../types/chat-message-parts';
import type { ToolPartOwnerState } from './ToolPart';
import {
  type ChatToolGetExpanded,
  ToolDisclosureContext,
  useToolDisclosure,
} from './toolDisclosure';

const { render } = createRenderer();

function baseOwnerState(state: ChatToolInvocationState): ToolPartOwnerState {
  return {
    messageId: 'm1',
    pendingApproval: false,
    role: 'assistant',
    state,
    toolName: 'write',
    isMessageStreaming: true,
  };
}

/**
 * The disclosure itself — calls `useToolDisclosure` as a descendant of the
 * `ToolDisclosureContext.Provider`, exactly like the styled `<details>` slot does.
 */
function Disclosure({
  state,
  isMessageStreaming,
  builtInFor,
}: {
  state: ChatToolInvocationState;
  isMessageStreaming: boolean;
  builtInFor: (state: ChatToolInvocationState) => boolean;
}) {
  const ref = React.useRef<HTMLDetailsElement>(null);
  const ownerState = { ...baseOwnerState(state), isMessageStreaming };
  const [open, setOpen] = useToolDisclosure(ownerState, builtInFor(state), ref);
  return (
    <React.Fragment>
      <button type="button" onClick={() => setOpen(false)}>
        manual-collapse
      </button>
      <button type="button" onClick={() => setOpen(true)}>
        manual-open
      </button>
      <details ref={ref} open={open} data-testid="disc">
        <summary data-testid="summary" tabIndex={0}>
          summary
        </summary>
        <button type="button" data-testid="inside">
          inside
        </button>
      </details>
    </React.Fragment>
  );
}

/**
 * Drives `Disclosure` with state/streaming transitions, mirroring how the headless
 * `ToolPart` provides the resolver above the disclosure slots.
 */
function Harness({
  getExpanded,
  builtInFor,
}: {
  getExpanded?: ChatToolGetExpanded;
  // Maps the current tool state to the slot's built-in open value.
  builtInFor: (state: ChatToolInvocationState) => boolean;
}) {
  const [state, setState] = React.useState<ChatToolInvocationState>('input-streaming');
  const [isMessageStreaming, setIsMessageStreaming] = React.useState(true);

  return (
    <ToolDisclosureContext.Provider value={getExpanded}>
      <button type="button" onClick={() => setState('output-available')}>
        finish
      </button>
      <button type="button" onClick={() => setState('input-available')}>
        input-ready
      </button>
      <button type="button" onClick={() => setIsMessageStreaming(false)}>
        stop-stream
      </button>
      <Disclosure state={state} isMessageStreaming={isMessageStreaming} builtInFor={builtInFor} />
    </ToolDisclosureContext.Provider>
  );
}

const isOpen = () => screen.getByTestId('disc').hasAttribute('open');
const click = (name: RegExp | string) => fireEvent.click(screen.getByRole('button', { name }));

const rootBuiltIn = (state: ChatToolInvocationState) =>
  state === 'approval-requested' || state === 'input-streaming';

describe('useToolDisclosure', () => {
  describe('built-in (no policy)', () => {
    it('forces open on the rising edge and never auto-collapses', () => {
      render(<Harness builtInFor={rootBuiltIn} />);
      // input-streaming → built-in open
      expect(isOpen()).toBe(true);
      // → output-available: built-in would be false, but the built-in path never collapses
      act(() => click(/finish/));
      expect(isOpen()).toBe(true);
    });

    it('opens when built-in newly becomes true', () => {
      render(<Harness builtInFor={(state) => state === 'output-available'} />);
      expect(isOpen()).toBe(false);
      act(() => click(/finish/));
      expect(isOpen()).toBe(true);
    });
  });

  describe('authoritative policy (boolean result)', () => {
    it('drives both edges: open while running, collapse when the tool ends', () => {
      const getExpanded: ChatToolGetExpanded = (os) =>
        os.state === 'input-streaming' || os.state === 'input-available';
      render(<Harness getExpanded={getExpanded} builtInFor={rootBuiltIn} />);
      expect(isOpen()).toBe(true);
      act(() => click(/finish/)); // → output-available, resolver returns false
      expect(isOpen()).toBe(false);
    });

    it('stays open while the message streams, then collapses when streaming ends', () => {
      const getExpanded: ChatToolGetExpanded = (os) => os.isMessageStreaming;
      // Built-in would collapse output, but the policy keeps it open while streaming.
      render(<Harness getExpanded={getExpanded} builtInFor={() => false} />);
      expect(isOpen()).toBe(true);
      act(() => click(/finish/)); // tool ended, but message still streaming
      expect(isOpen()).toBe(true);
      act(() => click(/stop-stream/)); // message done → collapse
      expect(isOpen()).toBe(false);
    });

    it('respects a manual toggle until the next state transition', () => {
      const getExpanded: ChatToolGetExpanded = (os) => os.state === 'input-streaming';
      render(<Harness getExpanded={getExpanded} builtInFor={rootBuiltIn} />);
      expect(isOpen()).toBe(true);
      // User collapses manually; no state transition yet → stays collapsed.
      act(() => click(/manual-collapse/));
      expect(isOpen()).toBe(false);
      // A non-collapsing transition (still no change in resolved value true→...): move
      // to input-available where resolver returns false → next transition re-applies.
      act(() => click(/finish/)); // resolved input-streaming(true) → output-available(false)
      expect(isOpen()).toBe(false);
    });

    it('re-applies the policy on the next transition after a manual open', () => {
      const getExpanded: ChatToolGetExpanded = (os) =>
        os.state === 'input-streaming' || os.state === 'input-available';
      render(<Harness getExpanded={getExpanded} builtInFor={rootBuiltIn} />);
      act(() => click(/finish/)); // → output-available, policy false → collapsed
      expect(isOpen()).toBe(false);
    });
  });

  describe('authoritative → non-authoritative switch', () => {
    it('falls back to built-in (no auto-collapse) when the policy returns undefined', () => {
      // Authoritative `true` while input-streaming, then `undefined` afterwards.
      const getExpanded: ChatToolGetExpanded = (os) =>
        os.state === 'input-streaming' ? true : undefined;
      render(<Harness getExpanded={getExpanded} builtInFor={rootBuiltIn} />);
      expect(isOpen()).toBe(true);
      // → output-available: policy undefined, built-in false, but non-authoritative path
      // never auto-collapses, so it stays open.
      act(() => click(/finish/));
      expect(isOpen()).toBe(true);
    });
  });

  describe('focus safety', () => {
    it('moves focus to the summary when an authoritative collapse hides focused content', () => {
      const getExpanded: ChatToolGetExpanded = (os) => os.state === 'input-streaming';
      render(<Harness getExpanded={getExpanded} builtInFor={rootBuiltIn} />);
      const inside = screen.getByTestId('inside');
      act(() => {
        inside.focus();
      });
      expect(document.activeElement).toBe(inside);
      act(() => click(/finish/)); // resolver → false, collapse while focus is inside
      expect(isOpen()).toBe(false);
      expect(document.activeElement).toBe(screen.getByTestId('summary'));
    });
  });
});
