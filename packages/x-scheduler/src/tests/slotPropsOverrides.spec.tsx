import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { useEventDialogOccurrence } from '@mui/x-scheduler/event-dialog';
import type { PropsFromSlot, SchedulerSlots } from '@mui/x-scheduler/models';

declare module '@mui/x-scheduler/models' {
  interface EventDialogGeneralTabPropsOverrides {
    customGeneralTabProp?: string;
  }
}

function CustomGeneralTab({
  customGeneralTabProp,
}: PropsFromSlot<SchedulerSlots['eventDialogGeneralTab']>) {
  const occurrence = useEventDialogOccurrence();
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
