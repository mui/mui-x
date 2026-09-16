import * as React from 'react';
import { createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { describe, it, expect, vi } from 'vitest';
import { isEventFromNestedInteractiveElement } from './interactiveElements';

describe('isEventFromNestedInteractiveElement', () => {
  const { render } = createRenderer();

  function setupProbe(children?: React.ReactNode) {
    const results: boolean[] = [];
    render(
      <div tabIndex={0} data-testid="focusable-ancestor">
        <div
          role="button"
          tabIndex={-1}
          data-testid="trigger"
          onClick={(event) => results.push(isEventFromNestedInteractiveElement(event))}
        >
          <span data-testid="text">text</span>
          {children}
        </div>
      </div>,
    );
    return results;
  }

  it('should return false when the trigger itself is clicked, even inside a focusable ancestor', () => {
    const results = setupProbe();
    fireEvent.click(screen.getByTestId('trigger'));
    expect(results).to.deep.equal([false]);
  });

  it('should return false when a non-interactive descendant is clicked', () => {
    const results = setupProbe();
    fireEvent.click(screen.getByTestId('text'));
    expect(results).to.deep.equal([false]);
  });

  it('should return true when a nested button is clicked', () => {
    const onButtonClick = vi.fn();
    const results = setupProbe(
      <button type="button" data-testid="nested" onClick={onButtonClick}>
        nested
      </button>,
    );
    fireEvent.click(screen.getByTestId('nested'));
    expect(results).to.deep.equal([true]);
    expect(onButtonClick.mock.calls).to.have.length(1);
  });

  it('should return true when a descendant of a nested link is clicked', () => {
    const results = setupProbe(
      <a href="#nested">
        <span data-testid="link-text">link</span>
      </a>,
    );
    fireEvent.click(screen.getByTestId('link-text'));
    expect(results).to.deep.equal([true]);
  });
});
