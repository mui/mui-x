import { spy } from 'sinon';
import { screen, fireEvent } from '@mui/internal-test-utils';
import { createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { StandaloneCompactDayView } from '@mui/x-scheduler/compact-day-view';

/**
 * The compact (touch) layout arms an event on tap, docking an Edit/Delete toolbar at the bottom of
 * the view. Edit opens the full-size drawer; Delete removes the event.
 */
describe('CompactDayView - event toolbar', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  function renderEvent(onEventsChange = spy(), { readOnly = false } = {}) {
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .readOnly(readOnly)
      .build();

    render(
      <StandaloneCompactDayView events={[event]} resources={[]} onEventsChange={onEventsChange} />,
    );

    return { onEventsChange };
  }

  function getEvent(): HTMLElement {
    return screen.getByRole('button', { name: /Morning Meeting/i });
  }

  it('docks the edit/delete toolbar once an event is armed', () => {
    renderEvent();
    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);

    fireEvent.click(getEvent());

    expect(screen.getByRole('button', { name: 'Edit event' })).not.to.equal(null);
    expect(screen.getByRole('button', { name: 'Delete event' })).not.to.equal(null);
  });

  it('opens the editing form when the toolbar Edit is tapped', () => {
    renderEvent();
    fireEvent.click(getEvent());
    fireEvent.click(screen.getByRole('button', { name: 'Edit event' }));

    // The drawer now shows the editable form (its title field).
    expect(screen.getByRole('textbox', { name: /Event title/i })).not.to.equal(null);
    // The toolbar is replaced by the surface.
    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
  });

  it('keeps the event in the editing state once the editing surface opens', () => {
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

  it('deletes the event when the toolbar Delete is tapped without opening the drawer', () => {
    const { onEventsChange } = renderEvent();
    fireEvent.click(getEvent());
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));

    expect(onEventsChange.callCount).to.equal(1);
    expect(onEventsChange.firstCall.args[0]).to.have.length(0);
    // The delete and edit flows are independent: deleting must not open the editing drawer.
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
  });

  it('does not arm a read-only event: it opens the read-only summary directly', () => {
    renderEvent(spy(), { readOnly: true });
    fireEvent.click(getEvent());

    // No action toolbar for a read-only event.
    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
    expect(screen.queryByRole('button', { name: 'Delete event' })).to.equal(null);
    // No editable form either.
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
  });
});
