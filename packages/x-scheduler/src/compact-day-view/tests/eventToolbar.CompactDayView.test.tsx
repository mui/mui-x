import { spy } from 'sinon';
import { screen, within, fireEvent } from '@mui/internal-test-utils';
import { createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { StandaloneCompactDayView } from '@mui/x-scheduler/compact-day-view';

/**
 * The compact (touch) layout arms an event on tap, docking an Edit/Delete toolbar at the bottom of
 * the view. Edit opens the full-size drawer; Delete removes the event.
 */
describe('CompactDayView - event toolbar', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  function renderEvent(
    onEventsChange = spy(),
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

  it('should keep arming built-in and only fire `onEventEditingStart` when the toolbar Edit is tapped', () => {
    const onEventEditingStart = spy((_occurrence: any, eventDetails: any) => eventDetails.cancel());
    renderEvent(spy(), { onEventEditingStart });

    // Arming (toolbar + resize affordances) is not the editing surface: no callback yet.
    const eventElement = getEvent();
    fireEvent.click(eventElement);
    expect(onEventEditingStart.callCount).to.equal(0);
    expect(eventElement).to.have.attribute('data-armed');

    // Tapping Edit is what opens the surface. Canceling disarms: the armed state keeps
    // document-wide guards that must not stay active under the consumer's custom UI.
    fireEvent.click(screen.getByRole('button', { name: 'Edit event' }));
    expect(onEventEditingStart.calledOnce).to.equal(true);
    expect(onEventEditingStart.lastCall.args[1].event.type).to.equal('click');
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
    expect(eventElement).not.to.have.attribute('data-armed');
    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
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

  it('should delete the event when the toolbar Delete is tapped without opening the drawer', () => {
    const { onEventsChange } = renderEvent();
    fireEvent.click(getEvent());
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));

    expect(onEventsChange.callCount).to.equal(1);
    expect(onEventsChange.firstCall.args[0]).to.have.length(0);
    // The delete and edit flows are independent: deleting must not open the editing drawer.
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
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
    expect(onEventsChange.called).to.equal(false);
  });

  it('should not arm a read-only event: it opens the read-only summary directly', () => {
    renderEvent(spy(), { readOnly: true });
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
