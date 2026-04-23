import * as React from 'react';
import { createRenderer, screen, fireEvent, act } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ChatCodeBlock } from './ChatCodeBlock';

const { render } = createRenderer();

/**
 * JSDOM doesn't implement the Clipboard API, and `createRenderer().render()`
 * calls `userEvent.setup()` which installs its own clipboard polyfill.
 * We must install our mock AFTER `render()` so it isn't overwritten.
 */
function installClipboardMock() {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    writable: true,
    configurable: true,
  });
  return writeText;
}

describe('ChatCodeBlock', () => {
  it('renders code content as text', () => {
    render(<ChatCodeBlock>{'console.log("hello")'}</ChatCodeBlock>);

    expect(screen.getByText('console.log("hello")')).not.toBe(null);
  });

  it('renders language label when language provided', () => {
    render(<ChatCodeBlock language="typescript">code</ChatCodeBlock>);

    expect(screen.getByText('typescript')).not.toBe(null);
  });

  it('renders empty language label when language omitted', () => {
    render(<ChatCodeBlock>code</ChatCodeBlock>);

    const languageLabelSpan = document.querySelector('.MuiChatCodeBlock-languageLabel');

    expect(languageLabelSpan).not.toBe(null);
    expect(languageLabelSpan!.textContent).toBe('');
  });

  it('copy button shows "Copy" title initially', () => {
    render(<ChatCodeBlock>code</ChatCodeBlock>);

    expect(screen.getByRole('button', { name: 'Copy' })).not.toBe(null);
  });

  it('calls highlighter when provided and renders its output', () => {
    const highlighter = vi.fn((code: string, _lang: string) => (
      <span data-testid="highlighted">{code}</span>
    ));

    render(
      <ChatCodeBlock language="python" highlighter={highlighter}>
        {'print("hi")'}
      </ChatCodeBlock>,
    );

    expect(highlighter).toHaveBeenCalledWith('print("hi")', 'python');
    expect(screen.getByTestId('highlighted')).not.toBe(null);
  });

  it('renders raw code when no highlighter', () => {
    render(<ChatCodeBlock>raw code here</ChatCodeBlock>);

    expect(screen.getByText('raw code here')).not.toBe(null);
  });

  it('forwards ref to root element', () => {
    const ref = React.createRef<HTMLDivElement>();

    render(<ChatCodeBlock ref={ref}>code</ChatCodeBlock>);

    expect(ref.current).not.toBe(null);
    expect(ref.current).toBeInstanceOf(window.HTMLDivElement);
  });

  it('applies className prop', () => {
    render(<ChatCodeBlock className="my-custom-class">code</ChatCodeBlock>);

    expect(document.querySelector('.my-custom-class')).not.toBe(null);
  });

  it('clicking copy calls navigator.clipboard.writeText with code content', async () => {
    render(<ChatCodeBlock>const x = 42;</ChatCodeBlock>);

    // Install mock AFTER render because createRenderer's render() calls
    // userEvent.setup() which overwrites navigator.clipboard.
    const writeText = installClipboardMock();

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

    // Flush microtask queue so the .then() callback runs
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {});

    expect(writeText).toHaveBeenCalledWith('const x = 42;');
  });

  it('copy button changes to "Copied!" title after successful copy', async () => {
    render(<ChatCodeBlock>code</ChatCodeBlock>);

    installClipboardMock();

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    });

    expect(screen.getByRole('button', { name: 'Copied!' })).not.toBe(null);
  });

  it('timer resets state to "Copy" after 2 seconds', async () => {
    vi.useFakeTimers();

    render(<ChatCodeBlock>code</ChatCodeBlock>);

    installClipboardMock();

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(screen.getByRole('button', { name: 'Copied!' })).not.toBe(null);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    expect(screen.getByRole('button', { name: 'Copy' })).not.toBe(null);

    vi.useRealTimers();
  });

  it('clipboard failure keeps "Copy" state', async () => {
    render(<ChatCodeBlock>code</ChatCodeBlock>);

    const writeText = installClipboardMock();
    writeText.mockImplementation(() => Promise.reject(new Error('denied')));

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    });

    expect(writeText).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Copy' })).not.toBe(null);
  });
});
