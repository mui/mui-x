import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import { ChatPlan } from './ChatPlan';

const { render } = createRenderer();

describe('ChatPlan', () => {
  it('renders title when provided', () => {
    render(<ChatPlan title="My Plan" steps={[]} />);
    expect(screen.getByText('My Plan')).not.toBe(null);
  });

  it('does not render title when omitted', () => {
    render(<ChatPlan steps={[]} />);
     
    expect(document.querySelector('.MuiChatPlan-title')).toBe(null);
  });

  it('renders ChatTask for each step in steps array', () => {
    const steps = [
      { id: '1', label: 'Step 1', status: 'done' as const },
      { id: '2', label: 'Step 2', status: 'running' as const },
      { id: '3', label: 'Step 3', status: 'pending' as const },
    ];
    render(<ChatPlan steps={steps} />);
    expect(screen.getByText('Step 1')).not.toBe(null);
    expect(screen.getByText('Step 2')).not.toBe(null);
    expect(screen.getByText('Step 3')).not.toBe(null);
  });

  it('passes status and detail from step to ChatTask', () => {
    const steps = [
      { id: '1', label: 'Step 1', status: 'done' as const, detail: 'Completed successfully' },
    ];
    render(<ChatPlan steps={steps} />);
    expect(screen.getByText('Completed successfully')).not.toBe(null);
  });

  it('renders children directly when steps not provided', () => {
    render(
      <ChatPlan>
        <div data-testid="custom-child">Custom content</div>
      </ChatPlan>,
    );
    expect(screen.getByTestId('custom-child')).not.toBe(null);
  });

  it('forwards ref to root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ChatPlan ref={ref} steps={[]} />);
    expect(ref.current).not.toBe(null);
    expect(ref.current!.tagName).toBe('DIV');
  });
});
