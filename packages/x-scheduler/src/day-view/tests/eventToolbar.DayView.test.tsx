import { spy } from 'sinon';
import { screen, fireEvent } from '@mui/internal-test-utils';
import { createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { StandaloneDayView } from '@mui/x-scheduler/day-view';

const createMatchMedia = (matches: boolean) => () =>
  ({
    matches,
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as any;

/**
 * On the desktop layout a coarse pointer arms the event (showing the action toolbar anchored next to
 * it); a fine pointer opens the editing dialog directly. Arming itself is pointer-driven, so the open
 * mode is forced here via `matchMedia`.
 */
describe('DayView - event toolbar', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  const originalMatchMedia = window.matchMedia;
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  function renderEvent(onEventsChange = spy()) {
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .build();

    render(<StandaloneDayView events={[event]} resources={[]} onEventsChange={onEventsChange} />);

    return { onEventsChange };
  }

  function getEvent(): HTMLElement {
    return screen.getByRole('button', { name: /Morning Meeting/i });
  }

  it('arms with a toolbar on a coarse pointer; Edit opens the dialog', () => {
    window.matchMedia = createMatchMedia(true);
    renderEvent();

    fireEvent.click(getEvent());

    const editButton = screen.getByRole('button', { name: 'Edit event' });
    expect(editButton).not.to.equal(null);
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);

    fireEvent.click(editButton);

    expect(screen.getByRole('textbox', { name: /Event title/i })).not.to.equal(null);
  });

  it('opens the editing dialog directly on a fine pointer (no toolbar)', () => {
    window.matchMedia = createMatchMedia(false);
    renderEvent();

    fireEvent.click(getEvent());

    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
    expect(screen.getByRole('textbox', { name: /Event title/i })).not.to.equal(null);
  });

  it('blocks wheel and touch scroll from reaching the grid behind it', () => {
    window.matchMedia = createMatchMedia(true);
    renderEvent();

    fireEvent.click(getEvent());
    const toolbar = screen.getByRole('toolbar');

    const wheelEvent = new WheelEvent('wheel', { bubbles: true, cancelable: true });
    toolbar.dispatchEvent(wheelEvent);
    expect(wheelEvent.defaultPrevented).to.equal(true);

    const touchMoveEvent = new Event('touchmove', { bubbles: true, cancelable: true });
    toolbar.dispatchEvent(touchMoveEvent);
    expect(touchMoveEvent.defaultPrevented).to.equal(true);
  });

  it('deletes the event from the toolbar without opening the editing dialog', () => {
    window.matchMedia = createMatchMedia(true);
    const { onEventsChange } = renderEvent();

    fireEvent.click(getEvent());
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));

    expect(onEventsChange.callCount).to.equal(1);
    expect(onEventsChange.firstCall.args[0]).to.have.length(0);
    // The delete and edit flows are independent: deleting must not open the editing dialog.
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
  });
});
