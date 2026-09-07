import * as React from 'react';
import { createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import PlaygroundCardComponent from './PlaygroundCard';

const { render } = createRenderer();

describe('PlaygroundCard', () => {
  it('supports keyboard navigation between tabs', () => {
    render(
      <PlaygroundCardComponent
        title="Chat Playground"
        preview={<div>Preview</div>}
        controls={<div>Props controls</div>}
        classCustomizations={[{ name: 'root', sx: '', onSxChange: vi.fn() }]}
      />,
    );

    const propsTab = screen.getByRole('tab', { name: 'Props' });
    const classesTab = screen.getByRole('tab', { name: 'Classes' });

    propsTab.focus();
    fireEvent.keyDown(propsTab, { key: 'ArrowRight' });

    expect(classesTab).to.have.attribute('aria-selected', 'true');
    expect(document.activeElement).toBe(classesTab);

    fireEvent.keyDown(classesTab, { key: 'Home' });

    expect(propsTab).to.have.attribute('aria-selected', 'true');
    expect(document.activeElement).toBe(propsTab);
  });
});
