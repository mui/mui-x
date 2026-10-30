import * as React from 'react';
import { act, fireEvent, screen } from '@mui/internal-test-utils';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  createMatchMedia,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  getEventNamePattern,
  ResourceBuilder,
} from 'test/utils/scheduler';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const engineering = ResourceBuilder.new().build();

describe('EventTimelinePremium - Event links', () => {
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  const originalMatchMedia = window.matchMedia;
  beforeEach(() => {
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

  it('should ignore the href of an editable event and warn', async () => {
    const event = EventBuilder.new()
      .title('Order 1042')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource(engineering)
      .href(HREF)
      .build();

    clearWarningsCache();
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

  it('should not create an event when a link is clicked in an editable row', async () => {
    const onEventEditingStart = vi.fn();
    const { user } = await renderTimeline({ onEventEditingStart });

    await user.click(getLink());

    expect(onEventEditingStart.mock.calls.length).to.equal(0);
  });

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
  });
});
