import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { screen, act, fireEvent, waitFor } from '@mui/internal-test-utils';
import {
  createMatchMedia,
  createSchedulerRenderer,
  EventBuilder,
  mockElementBounds,
  clientYForTime,
  getResizeHandle,
  simulatePointerResize,
  dropDrag,
  cancelDrag,
} from 'test/utils/scheduler';
import { StandaloneDayView } from '@mui/x-scheduler/day-view';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

/**
 * Arming and touch resize are device-adaptive, so they work in the normal Day View too. Driven via
 * {@link simulatePointerResize}, which presses the handle with a finger or a pen.
 */

describe('DayView - touch resize', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  // Touch flow: dialog opens read-only and the armed event stays resizable. Report a coarse pointer so the open mode resolves to read-only.
  const originalMatchMedia = window.matchMedia;
  beforeEach(() => {
    window.matchMedia = createMatchMedia(true);
  });
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    cancelDrag();
  });

  function getTimeGridColumn(): HTMLElement {
    return document.querySelector<HTMLElement>(
      `.MuiEventCalendar-dayTimeGridGrid [data-drop-target]`,
    )!;
  }

  function renderResizableEvent(onEventsChange = vi.fn(), beside: React.ReactNode = null) {
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .resizable(true)
      .build();

    render(
      <React.Fragment>
        {beside}
        <StandaloneDayView events={[event]} resources={[]} onEventsChange={onEventsChange} />
      </React.Fragment>,
    );

    // The column maps pointer Y to a time, and the event tells where the pointer grabbed it.
    mockElementBounds(getTimeGridColumn(), { top: 0, height: 1440, width: 200 });
    mockElementBounds(getEvent(), { top: clientYForTime(0, 24, 10), height: 60, width: 200 });

    return { onEventsChange };
  }

  function getEvent(): HTMLElement {
    return screen.getByRole('button', { name: /Morning Meeting/i });
  }

  it('should arm the event when it is opened for editing', () => {
    renderResizableEvent();
    const eventElement = getEvent();
    expect(eventElement).not.to.have.attribute('data-armed');
    fireEvent.click(eventElement);
    expect(eventElement).to.have.attribute('data-armed');
  });

  it('should pointer-resize the end of an event to a later time', async () => {
    const { onEventsChange } = renderResizableEvent();
    const eventElement = getEvent();
    fireEvent.click(eventElement);

    const endHandle = getResizeHandle(eventElement, 'end');

    await act(async () => {
      simulatePointerResize({
        handle: endHandle,
        from: { clientY: clientYForTime(0, 24, 11) },
        to: { clientY: clientYForTime(0, 24, 16) },
      });
    });

    expect(onEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = onEventsChange.mock.calls[0][0];
    // Start stays at 10:00, end moves later than 11:00.
    expect(new Date(updatedEvents[0].start).getUTCHours()).to.equal(10);
    expect(new Date(updatedEvents[0].end).getUTCHours()).to.equal(16);
  });

  it.each(['touch', 'pen'] as const)(
    'resizes with %s from the first contact, without a hold',
    async (pointerType) => {
      const { onEventsChange } = renderResizableEvent();
      const eventElement = getEvent();
      fireEvent.click(eventElement);
      const handle = getResizeHandle(eventElement, 'end');

      await act(async () => {
        simulatePointerResize({
          handle,
          pointerType,
          from: { clientY: clientYForTime(0, 24, 11) },
          to: { clientY: clientYForTime(0, 24, 16) },
          hold: true,
        });
      });

      await waitFor(() => {
        expect(document.querySelector('.MuiEventCalendar-timeGridEventPlaceholder')).not.toBe(null);
      });
      expect(handle.hasAttribute('data-dragging')).toBe(true);
      expect(onEventsChange).not.toHaveBeenCalled();

      await act(async () => {
        dropDrag(getTimeGridColumn(), { clientY: clientYForTime(0, 24, 16), pointerType });
      });
      expect(onEventsChange).toHaveBeenCalledTimes(1);
      expect(new Date(onEventsChange.mock.calls[0][0][0].end).getUTCHours()).toBe(16);

      // The events are uncontrolled here, so the event still ends at 11:00 and a second resize works.
      await act(async () => {
        simulatePointerResize({
          handle,
          pointerType,
          from: { clientY: clientYForTime(0, 24, 11) },
          to: { clientY: clientYForTime(0, 24, 15) },
        });
      });
      expect(onEventsChange).toHaveBeenCalledTimes(2);
      expect(new Date(onEventsChange.mock.calls[1][0][0].end).getUTCHours()).toBe(15);
    },
  );

  it.each(['touch', 'pen'] as const)(
    'does not change an event when its handle is only tapped with %s',
    async (pointerType) => {
      const onEventsChange = vi.fn();
      // Not on the 15 minute grid, so any commit would round it.
      const event = EventBuilder.new()
        .id('event-1')
        .title('Morning Meeting')
        .singleDay('2025-07-03T10:07:00Z', 60)
        .resizable(true)
        .build();
      render(<StandaloneDayView events={[event]} resources={[]} onEventsChange={onEventsChange} />);
      mockElementBounds(getTimeGridColumn(), { top: 0, height: 1440, width: 200 });
      mockElementBounds(getEvent(), { top: 607, height: 60, width: 200 });
      const eventElement = getEvent();
      fireEvent.click(eventElement);

      await act(async () => {
        simulatePointerResize({
          handle: getResizeHandle(eventElement, 'end'),
          pointerType,
          from: { clientY: 667 },
          // A finger jitters a pixel or two without meaning to move.
          to: { clientY: 669 },
          hold: true,
        });
      });
      expect(document.querySelector('.MuiEventCalendar-timeGridEventPlaceholder')).toBe(null);

      await act(async () => {
        dropDrag(getTimeGridColumn(), { clientY: 669, pointerType });
      });
      expect(onEventsChange).not.toHaveBeenCalled();
    },
  );

  it('keeps the pointer on the column where the resize started when the finger drifts sideways', async () => {
    const pointerXs: number[] = [];
    function PointerXMonitor() {
      Draggable.useMonitor({
        onMoveEnd: (_, { location }) => {
          pointerXs.push(location.current.input.clientX);
        },
      });
      return null;
    }
    const { onEventsChange } = renderResizableEvent(vi.fn(), <PointerXMonitor />);
    const eventElement = getEvent();
    fireEvent.click(eventElement);

    await act(async () => {
      simulatePointerResize({
        handle: getResizeHandle(eventElement, 'end'),
        from: { clientX: 100, clientY: clientYForTime(0, 24, 11) },
        // Far beyond the 200px wide column.
        to: { clientX: 900, clientY: clientYForTime(0, 24, 16) },
      });
    });

    // The engine reads the pointer through the axis lock, so the column under it never changes.
    expect(pointerXs).toEqual([100]);
    expect(onEventsChange).toHaveBeenCalledTimes(1);
    expect(new Date(onEventsChange.mock.calls[0][0][0].end).getUTCHours()).toBe(16);
  });

  // The preview hosts the resize handles but must never be a focusable button, nor use
  // `aria-hidden` to hide one (an `aria-hidden-focus` violation).
  it('should render the resize preview as a non-focusable, non-hidden element', async () => {
    renderResizableEvent();
    const eventElement = getEvent();
    fireEvent.click(eventElement);

    const endHandle = getResizeHandle(eventElement, 'end');

    await act(async () => {
      simulatePointerResize({
        handle: endHandle,
        from: { clientY: clientYForTime(0, 24, 11) },
        to: { clientY: clientYForTime(0, 24, 16) },
        hold: true,
      });
    });

    await waitFor(() => {
      expect(document.querySelector('.MuiEventCalendar-timeGridEventPlaceholder')).not.to.equal(
        null,
      );
    });
    const placeholder = document.querySelector('.MuiEventCalendar-timeGridEventPlaceholder')!;
    expect(placeholder).not.to.have.attribute('role');
    expect(placeholder).not.to.have.attribute('tabindex');
    expect(placeholder).not.to.have.attribute('aria-hidden');
  });

  // The system can take the gesture over mid-resize (a scroll winning, a phone call). The preview must
  // then be discarded rather than committed or left stranded on screen.
  it('should discard the resize preview when the gesture is cancelled', async () => {
    const { onEventsChange } = renderResizableEvent();
    const eventElement = getEvent();
    fireEvent.click(eventElement);

    const endHandle = getResizeHandle(eventElement, 'end');

    await act(async () => {
      simulatePointerResize({
        handle: endHandle,
        from: { clientY: clientYForTime(0, 24, 11) },
        to: { clientY: clientYForTime(0, 24, 16) },
        cancel: true,
      });
    });

    expect(onEventsChange.mock.calls.length).to.equal(0);
    expect(document.querySelector('.MuiEventCalendar-timeGridEventPlaceholder')).to.equal(null);
  });
});
