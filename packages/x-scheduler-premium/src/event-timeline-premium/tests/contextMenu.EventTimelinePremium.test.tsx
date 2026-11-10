import * as React from 'react';
import { screen, fireEvent, waitFor } from '@mui/internal-test-utils';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  createMatchMedia,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getEventElement } from './dependencyTestUtils';

const engineering = ResourceBuilder.new().build();

describe('EventTimelinePremium - Context menu', () => {
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  const originalMatchMedia = window.matchMedia;
  beforeEach(() => {
    window.matchMedia = createMatchMedia(false);
  });
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('should close the menu when its event is removed', async () => {
    const event = EventBuilder.new()
      .title('Team Standup')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource(engineering)
      .build();
    const { setProps } = await renderSettled(
      <EventTimelinePremium
        resources={[engineering]}
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        preset="dayAndMonth"
        presets={['dayAndMonth']}
      />,
    );

    fireEvent.contextMenu(getEventElement('Team Standup'));
    expect(screen.getByRole('menu')).not.to.equal(null);

    setProps({ events: [] });

    await waitFor(() => {
      expect(screen.queryByRole('menu')).to.equal(null);
    });
  });
});
