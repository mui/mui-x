import * as React from 'react';
import { act, screen, within } from '@mui/internal-test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import {
  cancelDrag,
  createSchedulerRenderer,
  dropDrag,
  moveDrag,
  startDrag,
} from 'test/utils/scheduler';
import CalendarDemo from '../../../data/scheduler/event-calendar/drag-interactions/ExternalDragAndDrop.tsx';
import TimelineDemo from '../../../data/scheduler/event-timeline/drag-interactions/ExternalDragAndDrop.tsx';

describe.each([
  { name: 'Calendar', Demo: CalendarDemo, title: 'Team Meeting' },
  { name: 'Timeline', Demo: TimelineDemo, title: 'Q3 Strategic Planning' },
])('$name external drag demo', ({ Demo, title }) => {
  const { renderSettled } = createSchedulerRenderer();
  afterEach(cancelDrag);

  it('transfers a scheduled event to the external container', async () => {
    await renderSettled(<Demo />);
    const target = screen.getByText('External Event 1 (30 mins)').parentElement!;
    const source = screen.getAllByText(title)[0];

    // A drop can arrive before the hover placeholder has rendered.
    await act(async () => {
      startDrag(source);
      dropDrag(target);
    });

    expect(within(target).getByText(`${title} (`, { exact: false })).not.toBe(null);
    expect(screen.queryByText(title, { exact: true })).toBe(null);
    expect(target.querySelector('[data-placeholder]')).toBe(null);
  });

  it('clears the hover placeholder on cancellation without transferring the event', async () => {
    await renderSettled(<Demo />);
    const target = screen.getByText('External Event 1 (30 mins)').parentElement!;
    const source = screen.getAllByText(title)[0];

    await act(async () => {
      startDrag(source);
      moveDrag(target);
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    });
    expect(target.querySelector('[data-placeholder]')?.textContent).toContain(title);

    cancelDrag();

    expect(target.querySelector('[data-placeholder]')).toBe(null);
    expect(within(target).queryByText(`${title} (`, { exact: false })).toBe(null);
    expect(screen.getAllByText(title).length).toBeGreaterThan(0);
  });
});
