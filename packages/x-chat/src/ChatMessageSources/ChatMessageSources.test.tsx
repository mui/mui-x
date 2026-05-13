import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import { ChatMessageSources } from './ChatMessageSources';
import { ChatMessageSource } from './ChatMessageSource';

const { render } = createRenderer();

describe('ChatMessageSources', () => {
  it('renders default "Sources" label', () => {
    render(<ChatMessageSources />);
    expect(screen.getByText('Sources')).not.toBe(null);
  });

  it('renders custom label', () => {
    render(<ChatMessageSources label="References" />);
    expect(screen.getByText('References')).not.toBe(null);
  });

  it('renders children source items', () => {
    render(
      <ChatMessageSources>
        <ChatMessageSource href="https://example.com">Example</ChatMessageSource>
      </ChatMessageSources>,
    );
    expect(screen.getByText('Example')).not.toBe(null);
  });

  it('forwards ref to root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ChatMessageSources ref={ref} />);
    expect(ref.current).not.toBe(null);
    expect(ref.current!.tagName).toBe('DIV');
  });
});

describe('ChatMessageSource', () => {
  it('renders link with href', () => {
    render(<ChatMessageSource href="https://example.com" />);
    const link = screen.getByRole('link');
    expect(link).not.toBe(null);
    expect(link.getAttribute('href')).toBe('https://example.com');
  });

  it('renders title as link text', () => {
    render(<ChatMessageSource href="https://example.com" title="Example Site" />);
    expect(screen.getByText('Example Site')).not.toBe(null);
  });

  it('falls back to href when no title', () => {
    render(<ChatMessageSource href="https://example.com" />);
    expect(screen.getByText('https://example.com')).not.toBe(null);
  });

  it('renders children over title', () => {
    render(
      <ChatMessageSource href="https://example.com" title="Should not show">
        Custom child
      </ChatMessageSource>,
    );
    expect(screen.getByText('Custom child')).not.toBe(null);
    expect(screen.queryByText('Should not show')).toBe(null);
  });

  it('renders index badge when index provided', () => {
    render(<ChatMessageSource href="https://example.com" index={3} />);
    expect(screen.getByText('[3]')).not.toBe(null);
  });

  it('link opens in new tab', () => {
    render(<ChatMessageSource href="https://example.com" />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noreferrer noopener');
  });

  it('forwards ref to root element', () => {
    const ref = React.createRef<HTMLLIElement>();
    render(<ChatMessageSource ref={ref} href="https://example.com" />);
    expect(ref.current).not.toBe(null);
    expect(ref.current!.tagName).toBe('LI');
  });
});
