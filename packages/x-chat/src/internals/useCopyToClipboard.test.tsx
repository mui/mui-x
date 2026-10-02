import * as React from 'react';
import { createRenderer, screen, fireEvent, act } from '@mui/internal-test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCopyToClipboard } from './useCopyToClipboard';

const { render } = createRenderer();

function Harness({ value = 'hello', resetMs }: { value?: string; resetMs?: number }) {
  const { copyState, copy } = useCopyToClipboard(resetMs);
  return (
    <button type="button" data-testid="state" onClick={() => copy(value)}>
      {copyState}
    </button>
  );
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

/**
 * `createRenderer().render()` runs `userEvent.setup()`, which installs its own
 * clipboard polyfill — so any mock has to be applied AFTER `render()`.
 */
function setClipboard(value: { writeText: (text: string) => Promise<void> } | undefined) {
  Object.defineProperty(navigator, 'clipboard', {
    value,
    writable: true,
    configurable: true,
  });
}

describe('useCopyToClipboard', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts idle, reports "copied" on a successful async write, then resets', async () => {
    vi.useFakeTimers();
    render(<Harness resetMs={2000} />);
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });

    const button = screen.getByTestId('state');
    expect(button.textContent).toBe('idle');

    fireEvent.click(button);
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {});
    expect(writeText).toHaveBeenCalledWith('hello');
    expect(button.textContent).toBe('copied');

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(button.textContent).toBe('idle');
  });

  it('does not let a superseded copy() overwrite the newest result (token guard)', async () => {
    render(<Harness />);
    const first = deferred<void>();
    const second = deferred<void>();
    const writeText = vi
      .fn()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    setClipboard({ writeText });

    const button = screen.getByTestId('state');
    fireEvent.click(button); // call #1 -> first.promise
    fireEvent.click(button); // call #2 -> second.promise (supersedes #1)

    await act(async () => {
      second.resolve();
    });
    expect(button.textContent).toBe('copied');

    // The superseded first write now rejects; the token guard must ignore it so it
    // can't flip the freshly-"copied" state to "error".
    await act(async () => {
      first.reject(new Error('denied'));
    });
    expect(button.textContent).toBe('copied');
  });

  it('falls back to execCommand when the async Clipboard API is unavailable', async () => {
    render(<Harness />);
    setClipboard(undefined);
    const execCommand = vi.fn().mockReturnValue(true);
    (document as any).execCommand = execCommand;

    fireEvent.click(screen.getByTestId('state'));
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {});

    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(screen.getByTestId('state').textContent).toBe('copied');
  });

  it('reports "error" when the legacy fallback also fails', async () => {
    render(<Harness />);
    setClipboard(undefined);
    (document as any).execCommand = vi.fn().mockReturnValue(false);

    fireEvent.click(screen.getByTestId('state'));
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {});

    expect(screen.getByTestId('state').textContent).toBe('error');
  });

  it('falls back to execCommand when writeText throws synchronously', async () => {
    render(<Harness />);
    setClipboard({
      writeText: () => {
        throw new Error('not focused');
      },
    });
    const execCommand = vi.fn().mockReturnValue(true);
    (document as any).execCommand = execCommand;

    fireEvent.click(screen.getByTestId('state'));
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {});

    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(screen.getByTestId('state').textContent).toBe('copied');
  });

  it('does not update state after unmount when the write resolves late', async () => {
    const { unmount } = render(<Harness />);
    const pending = deferred<void>();
    const writeText = vi.fn().mockReturnValue(pending.promise);
    setClipboard({ writeText });

    fireEvent.click(screen.getByTestId('state'));
    unmount();

    // Resolving after unmount must be a no-op: the mounted-ref guard skips the
    // state update, so this never triggers an "update on an unmounted component"
    // console.error (which `vitest-fail-on-console` would fail the test on).
    await act(async () => {
      pending.resolve();
    });

    expect(writeText).toHaveBeenCalledTimes(1);
  });
});
