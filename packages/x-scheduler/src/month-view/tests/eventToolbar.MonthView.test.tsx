import { spy } from 'sinon';
import { screen, fireEvent } from '@mui/internal-test-utils';
import { createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { StandaloneMonthView } from '@mui/x-scheduler/month-view';

const createMatchMedia = (matches: boolean) => () =>
  ({
    matches,
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as any;

/**
 * On a coarse pointer, tapping an event arms it (toolbar) rather than opening the dialog; an outside
 * tap disarms it in every view, month included. Arming is forced here via `matchMedia`.
 */
describe('MonthView - event toolbar', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-01') });

  const originalMatchMedia = window.matchMedia;
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  function renderEvent(onEventsChange = spy()) {
    const event = EventBuilder.new()
      .id('event-1')
      .title('Morning Meeting')
      .startAt('2025-05-01T09:00:00Z')
      .build();

    render(<StandaloneMonthView events={[event]} resources={[]} onEventsChange={onEventsChange} />);

    return { onEventsChange };
  }

  function getEvent(): HTMLElement {
    return screen.getAllByRole('button', { name: /Morning Meeting/i })[0];
  }

  it('arms with a toolbar on a coarse pointer', () => {
    window.matchMedia = createMatchMedia(true);
    renderEvent();

    fireEvent.click(getEvent());

    expect(screen.getByRole('button', { name: 'Edit event' })).not.to.equal(null);
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
  });

  it('disarms the toolbar when tapping outside of it', () => {
    window.matchMedia = createMatchMedia(true);
    renderEvent();

    fireEvent.click(getEvent());
    expect(screen.getByRole('button', { name: 'Edit event' })).not.to.equal(null);

    // A tap anywhere outside the toolbar closes it, even though the month grid has no outside-tap
    // handling of its own — the toolbar itself listens document-wide while armed.
    fireEvent.click(document.body);

    expect(screen.queryByRole('button', { name: 'Edit event' })).to.equal(null);
  });
});
