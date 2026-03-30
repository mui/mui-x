import * as React from 'react';
import { createRenderer, screen, fireEvent } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ChatConfirmation } from './ChatConfirmation';

const { render } = createRenderer();

describe('ChatConfirmation', () => {
  it('renders warning message text', () => {
    render(<ChatConfirmation message="Are you sure?" />);
    expect(screen.getByText('Are you sure?')).not.toBe(null);
  });

  it('renders warning icon', () => {
    render(<ChatConfirmation message="msg" />);
     
    expect(document.querySelector('svg')).not.toBe(null);
  });

  it('renders default button labels', () => {
    render(<ChatConfirmation message="msg" />);
    expect(screen.getByRole('button', { name: 'Confirm' })).not.toBe(null);
    expect(screen.getByRole('button', { name: 'Cancel' })).not.toBe(null);
  });

  it('renders custom confirmLabel and cancelLabel', () => {
    render(<ChatConfirmation message="msg" confirmLabel="Yes" cancelLabel="No" />);
    expect(screen.getByRole('button', { name: 'Yes' })).not.toBe(null);
    expect(screen.getByRole('button', { name: 'No' })).not.toBe(null);
  });

  it('calls onConfirm when confirm button clicked', () => {
    const onConfirm = vi.fn();
    render(<ChatConfirmation message="msg" onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = vi.fn();
    render(<ChatConfirmation message="msg" onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not throw when handlers are undefined', () => {
    render(<ChatConfirmation message="msg" />);
    expect(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    }).not.toThrow();
  });

  it('forwards ref to root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ChatConfirmation ref={ref} message="msg" />);
    expect(ref.current).not.toBe(null);
    expect(ref.current!.tagName).toBe('DIV');
  });
});
