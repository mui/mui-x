import * as React from 'react';
import { screen, within, fireEvent, waitFor, act } from '@mui/internal-test-utils';
import { createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { StandaloneCompactDayView } from '@mui/x-scheduler/compact-day-view';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { vi, describe, it, expect } from 'vitest';

/**
 * The compact (touch) layout arms an event on tap, docking an Edit/Delete toolbar at the bottom of
 * the view. Edit opens the full-size drawer; Delete removes the event.
 */
describe('CompactDayView - event toolbar', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  function renderEvent(
    onEventsChange = vi.fn(),
    { readOnly = false, onEventEditingStart = undefined as any } = {},
  ) {
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .readOnly(readOnly)
      .build();

    const { setProps } = render(
      <StandaloneCompactDayView
        events={[event]}
        resources={[]}
        onEventsChange={onEventsChange}
        visibleDate={new Date('2025-07-03T00:00:00Z')}
        onEventEditingStart={onEventEditingStart}
      />,
    );

    return { onEventsChange, setProps };
  }

  function getEvent(): HTMLElement {
    return screen.getByRole('button', { name: /Morning Meeting/i });
  }

  // `renderEvent`'s fixed array never actually removes the event from the DOM on delete (the
  // store warns if nothing feeds `onEventsChange` back into it), which can't exercise what
  // happens once an occurrence really unmounts. This one is fully controlled instead.
  function renderStatefulEvent(extraProps: Record<string, unknown> = {}) {
    const initialEvent = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .build();

    function StatefulCompactDayView() {
      const [events, setEvents] = React.useState<SchedulerEvent[]>([initialEvent]);
      return (
        <StandaloneCompactDayView
          events={events}
          resources={[]}
          onEventsChange={setEvents}
          visibleDate={new Date('2025-07-03T00:00:00Z')}
          {...extraProps}
        />
      );
    }

    render(<StatefulCompactDayView />);
  }

  it('should keep arming built-in and only fire `onEventEditingStart` when the toolbar Edit is tapped', () => {
    const onEventEditingStart = vi.fn((_occurrence: any, eventDetails: any) =>
      eventDetails.cancel(),
    );
    renderEvent(vi.fn(), { onEventEditingStart });

    // Arming (toolbar + resize affordances) is not the editing surface: no callback yet.
    const eventElement = getEvent();
    fireEvent.click(eventElement);
    expect(onEventEditingStart.mock.calls.length).to.equal(0);
    expect(eventElement).to.have.attribute('data-armed');

    // Tapping Edit is what opens the surface. Canceling disarms: the armed state keeps
    // document-wide guards that must not stay active under the consumer's custom UI.
    const editButton = screen.getByRole('button', { name: 'Edit event' });
    fireEvent.click(editButton);
    expect(onEventEditingStart.mock.calls.length).to.equal(1);
    expect(onEventEditingStart.mock.lastCall?.[1].event.type).to.equal('click');
    expect(onEventEditingStart.mock.lastCall?.[1].trigger).to.equal(editButton);
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
    expect(eventElement).not.to.have.attribute('data-armed');
    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);

    expect(editButton.isConnected).to.equal(false);
    expect(onEventEditingStart.mock.lastCall?.[1].anchor).to.equal(eventElement);
    expect(eventElement.isConnected).to.equal(true);
  });

  it('should dock the edit/delete toolbar once an event is armed', () => {
    renderEvent();
    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);

    fireEvent.click(getEvent());

    expect(screen.getByRole('button', { name: 'Edit event' })).not.to.equal(null);
    expect(screen.getByRole('button', { name: 'Delete event' })).not.to.equal(null);
  });

  it('should open the editing form when the toolbar Edit is tapped', () => {
    renderEvent();
    fireEvent.click(getEvent());
    fireEvent.click(screen.getByRole('button', { name: 'Edit event' }));

    // The drawer now shows the editable form (its title field).
    expect(screen.getByRole('textbox', { name: /Event title/i })).not.to.equal(null);
    // The toolbar is replaced by the surface.
    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
  });

  it('should keep the event in the editing state once the editing surface opens', () => {
    renderEvent();
    // Hold the reference: the open drawer makes the background inert, so role queries no longer find it.
    const eventElement = getEvent();
    fireEvent.click(eventElement);
    expect(eventElement).to.have.attribute('data-armed');

    fireEvent.click(screen.getByRole('button', { name: 'Edit event' }));

    // Arming gives way to editing: the event keeps its selection hook (`data-editing`) so the touch
    // outline persists while the surface is open, instead of dropping back to an unstyled state.
    expect(eventElement).not.to.have.attribute('data-armed');
    expect(eventElement).to.have.attribute('data-editing');
  });

  it('should open the delete confirmation dialog instead of deleting immediately when the toolbar Delete is tapped', () => {
    const { onEventsChange } = renderEvent();
    fireEvent.click(getEvent());
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));

    expect(screen.getByRole('dialog', { name: /delete this event/i })).not.to.equal(null);
    expect(onEventsChange.mock.calls.length).to.equal(0);
  });

  it('should delete the event and close the drawer once Delete event is confirmed', async () => {
    const { onEventsChange } = renderEvent();
    fireEvent.click(getEvent());
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));
    // The docked toolbar's own delete button shares the same accessible name, so the confirm
    // click is scoped to the dialog.
    const dialog = screen.getByRole('dialog', { name: /delete this event/i });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete event' }));

    expect(onEventsChange.mock.calls.length).to.equal(1);
    expect(onEventsChange.mock.calls[0][0]).to.have.length(0);
    // The delete and edit flows are independent: deleting must not open the editing drawer.
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
    });
  });

  it('should keep the event when Cancel is clicked in the confirmation dialog', async () => {
    const { onEventsChange } = renderEvent();
    fireEvent.click(getEvent());
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onEventsChange.mock.calls.length).to.equal(0);
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /delete this event/i })).to.equal(null);
    });
    expect(screen.getByRole('button', { name: 'Edit event' })).not.to.equal(null);
  });

  it('should move focus to the owning grid column after a confirmed Delete from the toolbar', async () => {
    renderStatefulEvent();
    const column = getEvent().closest<HTMLElement>('[role="gridcell"]')!;

    fireEvent.click(getEvent());
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));
    const dialog = screen.getByRole('dialog', { name: /delete this event/i });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete event' }));

    // Confirms the event actually unmounts here (unlike `renderEvent`'s fixed array), so the
    // assertion below exercises the real focus-loss scenario, not a no-op.
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Morning Meeting/i })).to.equal(null);
    });

    // The fallback focus is deferred past the dialog's own focus trap releasing.
    await waitFor(() => {
      expect(document.activeElement).to.equal(column);
    });
  });

  it('should move focus to the owning grid column after a toolbar delete with no confirmation', async () => {
    renderStatefulEvent({ eventDeletion: { confirmation: false } });
    const column = getEvent().closest<HTMLElement>('[role="gridcell"]')!;

    fireEvent.click(getEvent());
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Morning Meeting/i })).to.equal(null);
    });
    await waitFor(() => {
      expect(document.activeElement).to.equal(column);
    });
  });

  it('should open a single confirmation dialog', () => {
    renderEvent();
    fireEvent.click(getEvent());
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));

    // The compact grid sits inside the community `EventDialogProvider`, and both it and the drawer
    // could mount the dialog. A second one would double the backdrop and the title `id`. Queried
    // from the DOM: the top modal leaves any other one `aria-hidden`, out of role queries.
    expect(document.querySelectorAll('[id$="delete-confirmation-dialog-title"]').length).to.equal(
      1,
    );
  });

  it('should return focus to the toolbar Delete button after Cancel', async () => {
    renderEvent();

    fireEvent.click(getEvent());
    const deleteButton = screen.getByRole('button', { name: 'Delete event' });
    // `fireEvent.click` alone doesn't focus the target the way a real pointer/keyboard
    // interaction would; focusing it first reflects what MUI's dialog actually captures on open.
    // In a real browser this blurs whatever was focused before, which can update another MUI
    // component's internal state outside of React's test-aware batching unless wrapped in `act`.
    act(() => {
      deleteButton.focus();
    });
    fireEvent.click(deleteButton);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /delete this event/i })).to.equal(null);
    });
    expect(document.activeElement).to.equal(deleteButton);
  });

  it('should delete the event immediately, with no confirmation, when `eventDeletion.confirmation` is `false`', () => {
    const onEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .build();

    render(
      <StandaloneCompactDayView
        events={[event]}
        resources={[]}
        onEventsChange={onEventsChange}
        visibleDate={new Date('2025-07-03T00:00:00Z')}
        eventDeletion={{ confirmation: false }}
      />,
    );

    fireEvent.click(getEvent());
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));

    expect(onEventsChange.mock.calls.length).to.equal(1);
    expect(onEventsChange.mock.calls[0][0]).to.have.length(0);
    expect(screen.queryByRole('dialog', { name: /delete this event/i })).to.equal(null);
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
  });

  // The docked toolbar's own Delete is one entry point; the drawer's editing form has its own
  // Delete event button too, reached by tapping Edit first.
  describe('Deletion (drawer form)', () => {
    function openForm() {
      fireEvent.click(getEvent());
      fireEvent.click(screen.getByRole('button', { name: 'Edit event' }));
    }

    it('should open the delete confirmation dialog instead of deleting immediately when the form Delete event is clicked', () => {
      const { onEventsChange } = renderEvent();
      openForm();

      fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));

      expect(screen.getByRole('dialog', { name: /delete this event/i })).not.to.equal(null);
      expect(onEventsChange.mock.calls.length).to.equal(0);
    });

    it('should delete the event and close the drawer once Delete event is confirmed', async () => {
      const { onEventsChange } = renderEvent();
      openForm();

      fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));
      // The form's own delete button shares the same accessible name, so the confirm click is
      // scoped to the dialog.
      const dialog = screen.getByRole('dialog', { name: /delete this event/i });
      fireEvent.click(within(dialog).getByRole('button', { name: 'Delete event' }));

      expect(onEventsChange.mock.calls.length).to.equal(1);
      expect(onEventsChange.mock.calls[0][0]).to.have.length(0);
      await waitFor(() => {
        expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
      });
    });

    it('should keep the form open when Cancel is clicked in the confirmation dialog', async () => {
      const { onEventsChange } = renderEvent();
      openForm();

      fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onEventsChange.mock.calls.length).to.equal(0);
      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /delete this event/i })).to.equal(null);
      });
      expect(screen.getByRole('textbox', { name: /Event title/i })).not.to.equal(null);
    });

    it('should delete the event immediately, with no confirmation, when `eventDeletion.confirmation` is `false`', () => {
      const onEventsChange = vi.fn();
      const event = EventBuilder.new()
        .id('event-1')
        .title('Morning Meeting')
        .singleDay('2025-07-03T10:00:00Z', 60)
        .build();

      render(
        <StandaloneCompactDayView
          events={[event]}
          resources={[]}
          onEventsChange={onEventsChange}
          visibleDate={new Date('2025-07-03T00:00:00Z')}
          eventDeletion={{ confirmation: false }}
        />,
      );

      fireEvent.click(getEvent());
      fireEvent.click(screen.getByRole('button', { name: 'Edit event' }));
      fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));

      expect(onEventsChange.mock.calls.length).to.equal(1);
      expect(onEventsChange.mock.calls[0][0]).to.have.length(0);
      expect(screen.queryByRole('dialog', { name: /delete this event/i })).to.equal(null);
      expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
    });

    it('should return focus to the form Delete event button after Cancel', async () => {
      renderEvent();
      openForm();

      const deleteButton = screen.getByRole('button', { name: 'Delete event' });
      act(() => {
        deleteButton.focus();
      });
      fireEvent.click(deleteButton);
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /delete this event/i })).to.equal(null);
      });
      expect(document.activeElement).to.equal(deleteButton);
    });

    it('should move focus to the owning grid column after a confirmed Delete from the form', async () => {
      renderStatefulEvent();
      // Held before the drawer opens: it makes the background inert, out of role queries.
      const column = getEvent().closest<HTMLElement>('[role="gridcell"]')!;
      openForm();

      fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));
      const dialog = screen.getByRole('dialog', { name: /delete this event/i });
      fireEvent.click(within(dialog).getByRole('button', { name: 'Delete event' }));

      await waitFor(() => {
        expect(document.querySelector('[data-editing]')).to.equal(null);
      });
      await waitFor(() => {
        expect(document.activeElement).to.equal(column);
      });
    });

    it('should move focus to the owning grid column after a form delete with no confirmation', async () => {
      renderStatefulEvent({ eventDeletion: { confirmation: false } });
      const column = getEvent().closest<HTMLElement>('[role="gridcell"]')!;
      openForm();

      fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));

      await waitFor(() => {
        expect(document.querySelector('[data-editing]')).to.equal(null);
      });
      await waitFor(() => {
        expect(document.activeElement).to.equal(column);
      });
    });
  });

  // The dock is not anchored to the event, so nothing hides it when its occurrence leaves the
  // visible range. It would keep offering Edit / Delete for an event the user can no longer see.
  it('should disarm when navigating to another day', () => {
    const { onEventsChange, setProps } = renderEvent();
    fireEvent.click(getEvent());
    expect(screen.getByRole('button', { name: 'Edit event' })).not.to.equal(null);

    setProps({ visibleDate: new Date('2025-07-04T00:00:00Z') });

    expect(screen.queryByRole('button', { name: /Morning Meeting/i })).to.equal(null);
    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
    expect(screen.queryByRole('button', { name: 'Delete event' })).to.equal(null);
    expect(onEventsChange.mock.calls.length).to.equal(0);
  });

  it('should not arm a read-only event: it opens the read-only summary directly', () => {
    renderEvent(vi.fn(), { readOnly: true });
    fireEvent.click(getEvent());

    // No action toolbar for a read-only event.
    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
    expect(screen.queryByRole('button', { name: 'Delete event' })).to.equal(null);
    // No editable form either.
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);

    // The read-only summary renders: its Close button + title (scoped to the header to skip the grid event).
    const summaryHeader = screen.getByRole('button', { name: 'Close' }).closest('header')!;
    expect(within(summaryHeader).getByText('Morning Meeting')).not.to.equal(null);
  });
});
