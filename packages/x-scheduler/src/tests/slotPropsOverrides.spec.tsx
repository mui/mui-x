import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import type { PropsFromSlot, SchedulerSlots } from '@mui/x-scheduler/models';

declare module '@mui/x-scheduler/models' {
  interface EventDialogGeneralTabPropsOverrides {
    customGeneralTabProp?: string;
  }
}

function CustomGeneralTab({
  occurrence,
  customGeneralTabProp,
}: PropsFromSlot<SchedulerSlots['eventDialogGeneralTab']>) {
  return <div data-prop={customGeneralTabProp}>{occurrence.title}</div>;
}

export function AugmentedGeneralTabUsage() {
  return (
    <EventCalendar
      events={[]}
      slots={{ eventDialogGeneralTab: CustomGeneralTab }}
      slotProps={{ eventDialogGeneralTab: { customGeneralTabProp: 'a' } }}
    />
  );
}
