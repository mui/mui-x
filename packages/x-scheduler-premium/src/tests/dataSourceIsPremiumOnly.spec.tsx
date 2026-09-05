import * as React from 'react';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { StandaloneAgendaViewPremium } from '@mui/x-scheduler-premium/agenda-view-premium';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';

const dataSource = {
  getEvents: async () => [],
  persistEvents: async () => ({ success: true }),
};

// Counterpart to `packages/x-scheduler/src/tests/dataSourceIsPremiumOnly.spec.tsx`: the prop is
// removed from the community surface, so these assert it stays available on the Premium one.
export function PremiumCalendarAcceptsDataSource() {
  return <EventCalendarPremium events={[]} dataSource={dataSource} />;
}

export function PremiumStandaloneViewAcceptsDataSource() {
  return <StandaloneAgendaViewPremium events={[]} dataSource={dataSource} />;
}

export function PremiumTimelineAcceptsDataSource() {
  return <EventTimelinePremium events={[]} dataSource={dataSource} />;
}
