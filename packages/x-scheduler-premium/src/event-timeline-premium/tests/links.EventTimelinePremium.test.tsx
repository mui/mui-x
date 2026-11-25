import * as React from 'react';
import { act, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { recurringEventsFeature } from '@mui/x-scheduler-premium/recurring-events';
import {
  createMatchMedia,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  getEventNamePattern,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const engineering = ResourceBuilder.new().build();

describe('EventTimelinePremium - Event links', () => {
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  const originalMatchMedia = window.matchMedia;
  beforeEach(() => {
    // The warning is only logged once, so every test starts without it.
    clearWarningsCache();
    window.matchMedia = createMatchMedia(false);
  });
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    // Clicking a link changes the hash of the page.
    window.location.hash = '';
  });

  // A hash keeps the navigation inside the page, which jsdom supports.
  const HREF = '#order-1042';

  const linkEvent = EventBuilder.new()
    .title('Order 1042')
    .singleDay('2025-07-03T09:00:00Z', 60)
    .resource(engineering)
    .readOnly()
    .href(HREF)
    .build();

  function renderTimeline(
    props: Partial<React.ComponentProps<typeof EventTimelinePremium>> & {
      events?: SchedulerEvent[];
    } = {},
  ) {
    return renderSettled(
      <EventTimelinePremium
        resources={[engineering]}
        events={[linkEvent]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        preset="dayAndMonth"
        presets={['dayAndMonth']}
        {...props}
      />,
    );
  }

  function getLink() {
    return screen.getByRole('link', { name: getEventNamePattern('Order 1042') });
  }

  it('should render a read-only event with an href as a link', async () => {
    await renderTimeline();

    const link = getLink();
    expect(link).to.have.attribute('href', HREF);
    expect(link).to.have.attribute('data-link');
    expect(link).to.have.attribute('draggable', 'false');
    expect(screen.queryByRole('button', { name: getEventNamePattern('Order 1042') })).to.equal(
      null,
    );
  });

  it('should keep the attributes the keyboard navigation relies on', async () => {
    await renderTimeline();

    const link = getLink();
    expect(link).to.have.attribute('data-occurrence-key');
    expect(link).to.have.attribute('tabindex', '-1');
    expect(link.closest(`[data-resource-id="${engineering.id}"]`)).not.to.equal(null);
  });

  it('should render the event as a link when the timeline is read-only', async () => {
    const event = EventBuilder.new()
      .title('Order 1042')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource(engineering)
      .href(HREF)
      .build();
    await renderTimeline({ events: [event], readOnly: true });

    expect(getLink()).to.have.attribute('href', HREF);
  });

  it('should render the event as a link when its resource is read-only', async () => {
    const resource = ResourceBuilder.new().areEventsReadOnly().build();
    const event = EventBuilder.new()
      .title('Order 1042')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource(resource)
      .href(HREF)
      .build();
    await renderTimeline({ resources: [resource], events: [event] });

    expect(getLink()).to.have.attribute('href', HREF);
  });

  it('should render every occurrence of a recurring event as a link', async () => {
    const event = EventBuilder.new()
      .title('Order 1042')
      .singleDay('2025-07-01T09:00:00Z', 60)
      .resource(engineering)
      .recurrent('DAILY')
      .readOnly()
      .href(HREF)
      .build();
    await renderTimeline({
      events: [event],
      features: { recurringEvents: recurringEventsFeature },
    });

    const links = screen.getAllByRole('link', { name: getEventNamePattern('Order 1042') });
    expect(links.length).to.be.greaterThan(1);
    links.forEach((link) => expect(link).to.have.attribute('href', HREF));
  });

  it('should render an event with several resources as a link in each row', async () => {
    const design = ResourceBuilder.new().build();
    const event = { ...linkEvent, resource: [engineering.id, design.id] };
    await renderTimeline({ resources: [engineering, design], events: [event] });

    const links = screen.getAllByRole('link', { name: getEventNamePattern('Order 1042') });
    expect(links).to.have.length(2);
    links.forEach((link) => expect(link).to.have.attribute('href', HREF));
  });

  it('should ignore the href of an editable event and warn', async () => {
    const event = EventBuilder.new()
      .title('Order 1042')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource(engineering)
      .href(HREF)
      .build();
    await expect(() => renderTimeline({ events: [event] })).toWarnDev([
      'MUI X Scheduler: An event has an `href` but is editable',
    ]);

    expect(screen.queryByRole('link', { name: getEventNamePattern('Order 1042') })).to.equal(null);
  });

  it('should not start editing when the link is clicked', async () => {
    const onEventEditingStart = vi.fn();
    const { user } = await renderTimeline({ readOnly: true, onEventEditingStart });

    await user.click(getLink());

    expect(onEventEditingStart.mock.calls.length).to.equal(0);
    expect(screen.queryByRole('dialog')).to.equal(null);
  });

  it('should navigate when the link is clicked', async () => {
    const { user } = await renderTimeline();

    await user.click(getLink());

    expect(window.location.hash).to.equal(HREF);
  });

  it('should navigate when Enter is pressed on the link', async () => {
    const onEventEditingStart = vi.fn();
    const { user } = await renderTimeline({ onEventEditingStart });

    await act(async () => {
      getLink().focus();
    });
    await user.keyboard('{Enter}');

    expect(window.location.hash).to.equal(HREF);
    expect(onEventEditingStart.mock.calls.length).to.equal(0);
    expect(screen.queryByRole('dialog')).to.equal(null);
  });

  // The position of a created event is read from the layout.
  it.skipIf(isJSDOM)(
    'should not create an event when a link is clicked in an editable row',
    async () => {
      const onEventEditingStart = vi.fn();
      const { user } = await renderTimeline({
        eventCreation: { interaction: 'click' },
        onEventEditingStart,
      });

      await user.click(getLink());

      expect(onEventEditingStart.mock.calls.length).to.equal(0);
      expect(screen.queryByRole('dialog')).to.equal(null);
    },
  );

  it('should keep the native context menu on right-click', async () => {
    await renderTimeline();

    // `fireEvent` returns `false` when a handler prevented the default behavior.
    expect(fireEvent.contextMenu(getLink())).to.equal(true);
    expect(screen.queryByRole('menu')).to.equal(null);
  });

  it('should do nothing when Space is pressed on the link', async () => {
    const onEventEditingStart = vi.fn();
    const { user } = await renderTimeline({ onEventEditingStart });

    await act(async () => {
      getLink().focus();
    });
    await user.keyboard(' ');

    expect(onEventEditingStart.mock.calls.length).to.equal(0);
    expect(screen.queryByRole('menu')).to.equal(null);
    expect(screen.queryByRole('dialog')).to.equal(null);
    // `fireEvent` returns `false` when a handler prevented the default behavior, here the scroll.
    expect(fireEvent.keyDown(getLink(), { key: ' ' })).to.equal(false);
  });

  it('should stop editing an event that becomes a link', async () => {
    const event = EventBuilder.new()
      .title('Order 1042')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource(engineering)
      .href(HREF)
      .build();
    let view!: Awaited<ReturnType<typeof renderTimeline>>;
    await expect(async () => {
      view = await renderTimeline({ events: [event] });
    }).toWarnDev(['MUI X Scheduler: An event has an `href` but is editable']);
    const { user, setProps } = view;
    await user.click(screen.getByRole('button', { name: getEventNamePattern('Order 1042') }));
    await screen.findByRole('dialog');

    setProps({ readOnly: true });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).to.equal(null);
    });
    expect(getLink()).not.to.have.attribute('data-editing');
  });

  // The browser decides which elements Tab reaches.
  it.skipIf(isJSDOM)('should reach the link with Tab from its row', async () => {
    const { userEvent: browserUser } = await import('vitest/browser');
    await renderTimeline();
    const link = getLink();
    const row = link.parentElement!.closest<HTMLElement>('[tabindex]')!;

    await act(async () => {
      row.focus();
    });
    await waitFor(() => {
      expect(link).to.have.attribute('tabindex', '0');
    });
    await act(async () => {
      await browserUser.keyboard('{Tab}');
    });

    expect(document.activeElement).to.equal(link);
  });

  it('should move focus to the event row when the focused link is removed', async () => {
    const { setProps } = await renderTimeline();
    const link = getLink();
    const row = link.parentElement!.closest<HTMLElement>('[tabindex]')!;
    await act(async () => {
      link.focus();
    });

    setProps({ events: [] });

    await waitFor(() => {
      expect(document.activeElement).to.equal(row);
    });
  });
});
