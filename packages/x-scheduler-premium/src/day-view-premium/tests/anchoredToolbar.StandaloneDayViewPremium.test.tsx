import * as React from 'react';
import { screen, act, fireEvent } from '@mui/internal-test-utils';
import { LicenseInfo } from '@mui/x-license';
import { clearLicenseStatusCache } from '@mui/x-license/internals';
import { TEST_LICENSE_KEY_PREMIUM } from 'test/utils/licenseKeys';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import {
  createSchedulerRenderer,
  EventBuilder,
  mockElementBounds,
  clientYForTime,
  getResizeHandle,
  simulatePointerResize,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
} from 'test/utils/scheduler';
import { StandaloneDayViewPremium } from '@mui/x-scheduler-premium/day-view-premium';

// Report a coarse pointer so a tap arms the event and mounts the anchored action toolbar (instead of
// opening the editing dialog directly).
const createMatchMedia = (matches: boolean) => () =>
  ({
    matches,
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as any;

/**
 * On a large touch screen the armed-event toolbar is anchored next to the event and follows it on
 * resize. A recurring resize commits through the scope dialog, which — for `only this` / `this and
 * following` — detaches the occurrence onto a freshly-created event with a different DOM node. The
 * toolbar must re-anchor to that new node instead of staying pinned to the now-detached original.
 */
describe('StandaloneDayViewPremium - anchored toolbar (recurring resize)', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  const originalMatchMedia = window.matchMedia;
  beforeEach(() => {
    clearLicenseStatusCache();
    LicenseInfo.setLicenseKey(TEST_LICENSE_KEY_PREMIUM);
    window.matchMedia = createMatchMedia(true);
  });
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  function getTimeGridColumn(): HTMLElement {
    return document.querySelector<HTMLElement>(
      `.MuiEventCalendar-dayTimeGridGrid [data-drop-target-for-element]`,
    )!;
  }

  // Controlled wrapper so a committed resize re-renders with the resulting events, re-creating the
  // (re-keyed) occurrence the toolbar must re-anchor to.
  function ControlledView({ initialEvent }: { initialEvent: SchedulerEvent }) {
    const [events, setEvents] = React.useState<SchedulerEvent[]>([initialEvent]);
    return (
      <StandaloneDayViewPremium
        events={events}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        onEventsChange={setEvents}
      />
    );
  }

  function renderResizableRecurringEvent() {
    const event = EventBuilder.new()
      .id('event-1')
      .title('Daily Standup')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .recurrent('DAILY')
      .resizable(true)
      .build();

    const { user } = render(<ControlledView initialEvent={event} />);

    mockElementBounds(getTimeGridColumn(), { top: 0, height: 1440, width: 200 });

    return { user };
  }

  // The scope dialog leaves the background `aria-hidden` while closing, so read from the DOM rather
  // than through role queries (which skip `aria-hidden` subtrees).
  function getEventElement(): HTMLElement {
    return document.querySelector<HTMLElement>('.MuiEventCalendar-timeGridEvent')!;
  }

  function getAnchoredToolbar(): HTMLElement {
    return document.querySelector<HTMLElement>('[role="toolbar"]')!.parentElement!;
  }

  it('re-anchors the toolbar to the resized occurrence after the scope dialog commits', async () => {
    const { user } = renderResizableRecurringEvent();

    const originalEvent = getEventElement();
    fireEvent.click(originalEvent);
    expect(screen.getByRole('button', { name: 'Edit event' })).not.to.equal(null);

    const endHandle = getResizeHandle(originalEvent, 'end');
    await act(async () => {
      simulatePointerResize({ handle: endHandle, to: { clientY: clientYForTime(0, 24, 16) } });
    });

    await screen.findByText(/Apply this change to:/i);
    // The default scope ("only this") detaches the occurrence into a brand-new event whose DOM node
    // differs from the original — the node the toolbar was anchored to is now gone.
    await user.click(screen.getByRole('button', { name: /Confirm/i }));

    // Give the freshly-created occurrence a distinct position, then trigger a reposition. Before the
    // fix the toolbar stayed pinned to the detached original node (`updatePosition` bails on the
    // disconnected anchor), so it never picked up the new geometry.
    const resizedEvent = getEventElement();
    expect(resizedEvent).not.to.equal(originalEvent);
    mockElementBounds(resizedEvent, { top: 500, left: 120, width: 180, height: 360 });

    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });

    // `left` preferred anchoring, in jsdom the popup measures 0×0: top follows the anchor's top.
    expect(getAnchoredToolbar().style.top).to.equal('500px');
  });
});
