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

describe('EventContextMenu', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  const originalMatchMedia = window.matchMedia;
  beforeEach(() => {
    // Fine pointer: clicking (or activating) an event opens the dialog directly, no armed toolbar
    // to interfere with the context menu's own click/keyboard handling.
    window.matchMedia = createMatchMedia(false);
  });
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

  function getEvent(name: RegExp | string = /Morning Meeting/i): HTMLElement {
    return screen.getByRole('button', { name });
  }

  it('should open the menu with Edit and Delete on right-click', () => {
    renderEvent();

    fireEvent.contextMenu(getEvent());

    expect(screen.getByRole('menu')).not.to.equal(null);
    expect(screen.getByRole('menuitem', { name: /edit/i })).not.to.equal(null);
    expect(screen.getByRole('menuitem', { name: /delete/i })).not.to.equal(null);
  });

  it('should open the menu on Space without also opening Edit', () => {
    renderEvent();
    const event = getEvent();
    event.focus();

    fireEvent.keyDown(event, { key: ' ' });
    fireEvent.keyUp(event, { key: ' ' });

    expect(screen.getByRole('menu')).not.to.equal(null);
    // Regression guard: Space must not also fall through to Base UI's default click synthesis,
    // which would open the edit dialog underneath the menu.
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
  });

  it('should still open Edit directly on Enter (unaffected by the Space interception)', () => {
    renderEvent();
    const event = getEvent();
    event.focus();

    fireEvent.keyDown(event, { key: 'Enter' });

    expect(screen.getByRole('textbox', { name: /Event title/i })).not.to.equal(null);
    expect(screen.queryByRole('menu')).to.equal(null);
  });

  it('should close the menu on Escape', () => {
    renderEvent();

    fireEvent.contextMenu(getEvent());
    expect(screen.getByRole('menu')).not.to.equal(null);

    // MUI's Menu auto-focuses its first item ("Edit") on open; keydown can only target the
    // actually focused element.
    fireEvent.keyDown(screen.getByRole('menuitem', { name: /edit/i }), { key: 'Escape' });

    expect(screen.queryByRole('menu')).to.equal(null);
  });

  it('should open the same editing surface as a click when Edit is clicked', () => {
    renderEvent();

    fireEvent.contextMenu(getEvent());
    fireEvent.click(screen.getByRole('menuitem', { name: /edit/i }));

    expect(screen.getByRole('textbox', { name: /Event title/i })).not.to.equal(null);
  });

  it('should delete a non-recurring event immediately, with no confirmation, when Delete is clicked', () => {
    const { onEventsChange } = renderEvent();

    fireEvent.contextMenu(getEvent());
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));

    expect(onEventsChange.callCount).to.equal(1);
    expect(onEventsChange.firstCall.args[0]).to.have.length(0);
    expect(screen.queryByRole('menu')).to.equal(null);
    expect(screen.queryByRole('textbox', { name: /Event title/i })).to.equal(null);
  });
});
