 
import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import { ChatTask } from './ChatTask';

const { render } = createRenderer();

describe('ChatTask', () => {
  it('renders pending icon by default (no status prop)', () => {
    render(<ChatTask>Task label</ChatTask>);
    // PendingIcon is an SVG with a circle element
    expect(document.querySelector('svg circle')).not.toBe(null);
  });

  it('renders CircularProgress for status="running"', () => {
    render(<ChatTask status="running">Running task</ChatTask>);
    // CircularProgress renders with role="progressbar"
    expect(document.querySelector('[role="progressbar"]')).not.toBe(null);
  });

  it('renders check icon for status="done"', () => {
    render(<ChatTask status="done">Done task</ChatTask>);
    // DoneIcon is an SVG with a path (but no circle like pending)
    expect(document.querySelector('svg')).not.toBe(null);
    expect(document.querySelector('svg circle')).toBe(null); // not the pending icon
  });

  it('renders error icon for status="error"', () => {
    render(<ChatTask status="error">Error task</ChatTask>);
    expect(document.querySelector('svg')).not.toBe(null);
  });

  it('renders minus icon for status="skipped"', () => {
    render(<ChatTask status="skipped">Skipped task</ChatTask>);
    expect(document.querySelector('svg')).not.toBe(null);
  });

  it('renders task label text', () => {
    render(<ChatTask>My task label</ChatTask>);
    expect(screen.getByText('My task label')).not.toBe(null);
  });

  it('renders detail text when detail prop provided', () => {
    render(<ChatTask detail="Some details">Label</ChatTask>);
    expect(screen.getByText('Some details')).not.toBe(null);
  });

  it('does not render detail when detail omitted', () => {
    render(<ChatTask>Label</ChatTask>);
    // The detail class is MuiChatTask-detail
    expect(document.querySelector('.MuiChatTask-detail')).toBe(null);
  });

  it('applies status-specific CSS class', () => {
    render(<ChatTask status="done">Label</ChatTask>);
    // The root element should have MuiChatTask-statusDone class
    expect(document.querySelector('.MuiChatTask-statusDone')).not.toBe(null);
  });

  it('forwards ref to root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ChatTask ref={ref}>Label</ChatTask>);
    expect(ref.current).not.toBe(null);
    expect(ref.current!.tagName).toBe('DIV');
  });
});
