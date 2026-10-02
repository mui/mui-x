import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { StandaloneAgendaView } from '@mui/x-scheduler/agenda-view';

const dataSource = {
  getEvents: async () => [],
  persistEvents: async () => ({ success: true }),
};

export function CommunityCalendarRejectsDataSource() {
  return (
    // @ts-expect-error `dataSource` is Premium-only — lazy loading requires EventCalendarPremium.
    <EventCalendar events={[]} dataSource={dataSource} />
  );
}

export function CommunityStandaloneViewRejectsDataSource() {
  return (
    // @ts-expect-error `dataSource` is Premium-only — lazy loading requires the Premium views.
    <StandaloneAgendaView events={[]} dataSource={dataSource} />
  );
}
