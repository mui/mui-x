 
import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import { ChatMessageSkeleton } from './ChatMessageSkeleton';

describe('ChatMessageSkeleton', () => {
  const { render } = createRenderer();

  it('renders 3 skeleton lines by default', () => {
    render(<ChatMessageSkeleton />);
    const lines = document.querySelectorAll('.MuiChatMessageSkeleton-line');
    expect(lines.length).toBe(3);
  });

  it('renders custom number of lines via lines prop', () => {
    render(<ChatMessageSkeleton lines={5} />);
    const lines = document.querySelectorAll('.MuiChatMessageSkeleton-line');
    expect(lines.length).toBe(5);
  });

  it('forwards ref to root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ChatMessageSkeleton ref={ref} />);
    expect(ref.current).not.toBe(null);
    expect(ref.current!.tagName).toBe('DIV');
  });

  it('applies className prop', () => {
    render(<ChatMessageSkeleton className="my-skeleton" />);
    expect(document.querySelector('.my-skeleton')).not.toBe(null);
  });
});
