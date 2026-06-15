import * as React from 'react';
import { act, createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useRovingFocus, type UseRovingFocusParameters } from './useRovingFocus';

const { render } = createRenderer();

interface RovingListProps extends Omit<UseRovingFocusParameters, 'restoreKey' | 'scope'> {
  restoreKey?: object;
  scope?: string;
  prefix?: string;
}

const defaultRestoreKey = {};

function RovingList(props: RovingListProps) {
  const { prefix = 'item', restoreKey = defaultRestoreKey, scope = 'test', ...params } = props;
  const roving = useRovingFocus({ restoreKey, scope, ...params });

  return (
    <div>
      {params.itemIds.map((id) => (
        <button
          key={id}
          data-testid={`${prefix}-${id}`}
          onFocus={() => roving.setFocusedId(id)}
          onKeyDown={(event) => roving.handleKeyDown(event, id)}
          ref={(element) => roving.registerItemRef(id, element)}
          tabIndex={roving.effectiveFocusedId === id ? 0 : -1}
          type="button"
        >
          {id}
        </button>
      ))}
    </div>
  );
}

function ToggleableRovingList(props: RovingListProps) {
  const [open, setOpen] = React.useState(true);

  return (
    <React.Fragment>
      <button onClick={() => setOpen((value) => !value)} type="button">
        toggle
      </button>
      {open ? <RovingList {...props} /> : null}
    </React.Fragment>
  );
}

function getTabbableId(prefix = 'item') {
  const buttons = screen.getAllByTestId(new RegExp(`^${prefix}-`));
  const tabbable = buttons.filter((button) => button.getAttribute('tabindex') === '0');
  expect(tabbable).to.have.length(1);
  return tabbable[0].dataset.testid!.slice(prefix.length + 1);
}

describe('useRovingFocus', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('puts the tab stop on preferredId when present, else the first item', () => {
    const { unmount } = render(
      <RovingList itemIds={['a', 'b', 'c']} preferredId="b" restoreKey={{}} />,
    );
    expect(getTabbableId()).toBe('b');
    unmount();

    render(<RovingList itemIds={['a', 'b', 'c']} restoreKey={{}} />);
    expect(getTabbableId()).toBe('a');
  });

  it('puts the tab stop on the last item with fallback="last" and tracks appends', () => {
    function Harness() {
      const [itemIds, setItemIds] = React.useState(['a', 'b']);
      return (
        <React.Fragment>
          <button onClick={() => setItemIds(['a', 'b', 'c'])} type="button">
            append
          </button>
          <RovingList fallback="last" itemIds={itemIds} restoreKey={{}} />
        </React.Fragment>
      );
    }
    render(<Harness />);
    expect(getTabbableId()).toBe('b');

    // Before any user interaction the derived tab stop follows the newest item.
    fireEvent.click(screen.getByRole('button', { name: 'append' }));
    expect(getTabbableId()).toBe('c');
  });

  it('keeps the tab stop on the interactively focused item across appends', () => {
    function Harness() {
      const [itemIds, setItemIds] = React.useState(['a', 'b']);
      return (
        <React.Fragment>
          <button onClick={() => setItemIds(['a', 'b', 'c'])} type="button">
            append
          </button>
          <RovingList fallback="last" itemIds={itemIds} restoreKey={{}} />
        </React.Fragment>
      );
    }
    render(<Harness />);
    act(() => {
      screen.getByTestId('item-a').focus();
    });
    fireEvent.click(screen.getByRole('button', { name: 'append' }));
    expect(getTabbableId()).toBe('a');
  });

  it('moves focus with ArrowDown/ArrowUp and clamps at the ends without wrapping', () => {
    render(<RovingList itemIds={['a', 'b', 'c']} restoreKey={{}} />);
    act(() => {
      screen.getByTestId('item-a').focus();
    });

    fireEvent.keyDown(screen.getByTestId('item-a'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByTestId('item-b'));

    fireEvent.keyDown(screen.getByTestId('item-b'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByTestId('item-c'));

    // Clamped: no wrap past the last item.
    fireEvent.keyDown(screen.getByTestId('item-c'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByTestId('item-c'));

    fireEvent.keyDown(screen.getByTestId('item-c'), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(screen.getByTestId('item-b'));

    fireEvent.keyDown(screen.getByTestId('item-b'), { key: 'Home' });
    expect(document.activeElement).toBe(screen.getByTestId('item-a'));

    // Clamped: no wrap past the first item.
    fireEvent.keyDown(screen.getByTestId('item-a'), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(screen.getByTestId('item-a'));

    fireEvent.keyDown(screen.getByTestId('item-a'), { key: 'End' });
    expect(document.activeElement).toBe(screen.getByTestId('item-c'));
  });

  it('moves by a page with PageDown/PageUp only when page keys are enabled', () => {
    const itemIds = Array.from({ length: 30 }, (_, index) => `i${index}`);
    const { unmount } = render(<RovingList itemIds={itemIds} restoreKey={{}} />);
    act(() => {
      screen.getByTestId('item-i0').focus();
    });

    // pageSize = max(1, floor(30 / 10)) = 3
    fireEvent.keyDown(screen.getByTestId('item-i0'), { key: 'PageDown' });
    expect(document.activeElement).toBe(screen.getByTestId('item-i3'));

    fireEvent.keyDown(screen.getByTestId('item-i3'), { key: 'PageUp' });
    expect(document.activeElement).toBe(screen.getByTestId('item-i0'));
    unmount();

    render(<RovingList enablePageKeys={false} itemIds={itemIds} restoreKey={{}} />);
    act(() => {
      screen.getByTestId('item-i0').focus();
    });
    const pageDownEvent = fireEvent.keyDown(screen.getByTestId('item-i0'), { key: 'PageDown' });
    // Focus untouched and the event not consumed — the native scrolling
    // behavior of PageDown is preserved for the consumer.
    expect(document.activeElement).toBe(screen.getByTestId('item-i0'));
    expect(pageDownEvent).toBe(true);
  });

  it('activates with Enter and Space only when onActivate is provided', () => {
    const onActivate = vi.fn();
    const { unmount } = render(
      <RovingList itemIds={['a', 'b']} onActivate={onActivate} restoreKey={{}} />,
    );
    act(() => {
      screen.getByTestId('item-a').focus();
    });
    fireEvent.keyDown(screen.getByTestId('item-a'), { key: 'Enter' });
    fireEvent.keyDown(screen.getByTestId('item-a'), { key: ' ' });
    expect(onActivate).toHaveBeenCalledTimes(2);
    expect(onActivate).toHaveBeenCalledWith('a');
    unmount();

    render(<RovingList itemIds={['a', 'b']} restoreKey={{}} />);
    act(() => {
      screen.getByTestId('item-a').focus();
    });
    const notPrevented = fireEvent.keyDown(screen.getByTestId('item-a'), { key: 'Enter' });
    // Without onActivate the key falls through (not preventDefault-ed) so the
    // consumer can layer its own Enter behavior (e.g. drill-in).
    expect(notPrevented).toBe(true);
  });

  it('supports type-ahead only when getTypeAheadLabel is provided, with buffer reset', () => {
    vi.useFakeTimers();
    const labels: Record<string, string> = { a: 'Alpha', b: 'Beta', c: 'Beak' };
    render(
      <RovingList
        getTypeAheadLabel={(id) => labels[id]}
        itemIds={['a', 'b', 'c']}
        restoreKey={{}}
      />,
    );
    act(() => {
      screen.getByTestId('item-a').focus();
    });

    fireEvent.keyDown(screen.getByTestId('item-a'), { key: 'b' });
    expect(document.activeElement).toBe(screen.getByTestId('item-b'));

    // Buffer grows to "be": the next match after Beta is Beak.
    fireEvent.keyDown(screen.getByTestId('item-b'), { key: 'e' });
    expect(document.activeElement).toBe(screen.getByTestId('item-c'));

    // After the reset window a fresh buffer starts.
    act(() => {
      vi.advanceTimersByTime(900);
    });
    fireEvent.keyDown(screen.getByTestId('item-c'), { key: 'a' });
    expect(document.activeElement).toBe(screen.getByTestId('item-a'));
  });

  it('restores the stored tab stop across remounts and actively refocuses with restoreFocusOnMount', async () => {
    const restoreKey = {};
    render(
      <ToggleableRovingList itemIds={['a', 'b']} restoreFocusOnMount restoreKey={restoreKey} />,
    );

    act(() => {
      screen.getByTestId('item-b').focus();
    });
    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.queryByTestId('item-b')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(document.activeElement).toBe(screen.getByTestId('item-b'));
  });

  it('restores the tab stop without stealing focus when restoreFocusOnMount is off', () => {
    const restoreKey = {};
    render(<ToggleableRovingList itemIds={['a', 'b']} restoreKey={restoreKey} />);

    act(() => {
      screen.getByTestId('item-a').focus();
    });
    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));
    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));

    expect(getTabbableId()).toBe('a');
    expect(document.activeElement).not.toBe(screen.getByTestId('item-a'));
  });

  it('namespaces focus restoration by scope so lists sharing a restore key cannot collide', () => {
    const restoreKey = {};
    render(
      <React.Fragment>
        <RovingList itemIds={['a', 'b']} prefix="one" restoreKey={restoreKey} scope="list-one" />
        <RovingList itemIds={['x', 'y']} prefix="two" restoreKey={restoreKey} scope="list-two" />
      </React.Fragment>,
    );

    act(() => {
      screen.getByTestId('one-b').focus();
    });
    act(() => {
      screen.getByTestId('two-y').focus();
    });
    // Focusing in list two must not clobber list one's stored focus.
    expect(getTabbableId('one')).toBe('b');
    expect(getTabbableId('two')).toBe('y');
  });

  it('falls back when the focused id leaves the list', () => {
    function Harness() {
      const [itemIds, setItemIds] = React.useState(['a', 'b', 'c']);
      return (
        <React.Fragment>
          <button onClick={() => setItemIds(['a', 'c'])} type="button">
            remove-b
          </button>
          <RovingList itemIds={itemIds} restoreKey={{}} />
        </React.Fragment>
      );
    }
    render(<Harness />);
    act(() => {
      screen.getByTestId('item-b').focus();
    });
    fireEvent.click(screen.getByRole('button', { name: 'remove-b' }));
    expect(getTabbableId()).toBe('a');
  });
});
