import * as React from 'react';
import { act, screen, within } from '@mui/internal-test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import {
  cancelDrag,
  createSchedulerRenderer,
  dropDrag,
  moveDrag,
  mockElementBounds,
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

  it('hides the floating preview over Scheduler and transfers an external item on drop', async () => {
    await renderSettled(<Demo />);
    const source = screen.getByText('External Event 1 (30 mins)');
    const externalList = source.parentElement!;
    const target = document.querySelector<HTMLElement>(
      '.MuiEventTimeline-eventsCell[data-drop-target], .MuiEventCalendar-dayTimeGridColumn[data-drop-target], .MuiEventCalendar-monthViewCell[data-drop-target]',
    )!;
    expect(target).not.toBe(null);
    mockElementBounds(target, { left: 0, top: 0, width: 1000, height: 1000 });
    await act(async () => startDrag(source));
    const preview = await screen.findByText('External Event 1', { exact: true });
    expect(preview).toBeVisible();

    await act(async () => {
      moveDrag(target, { clientX: 100, clientY: 100 });
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    });
    expect(preview.parentElement!.style.visibility).toBe('hidden');
    await act(async () => {
      moveDrag(document.body, { clientX: 200 });
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    });
    expect(preview).toBeVisible();

    await act(async () => dropDrag(target, { clientX: 100, clientY: 100 }));
    expect(within(externalList).queryByText('External Event 1 (30 mins)')).toBe(null);
    expect(preview.isConnected).toBe(false);
    expect(screen.getAllByText('External Event 1').length).toBeGreaterThan(0);
  });

  it('keeps the external item when its drag is canceled', async () => {
    await renderSettled(<Demo />);
    const source = screen.getByText('External Event 1 (30 mins)');
    await act(async () => startDrag(source));
    await screen.findByText('External Event 1', { exact: true });
    cancelDrag();
    expect(screen.getByText('External Event 1 (30 mins)')).toBe(source);
    expect(screen.queryByText('External Event 1', { exact: true })).toBe(null);
  });

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
