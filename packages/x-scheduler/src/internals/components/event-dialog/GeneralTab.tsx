'use client';
import * as React from 'react';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { useEventEditingStyledContext } from '../event-editing';
import { useSchedulerSlots } from '../SchedulerSlotsContext';
import { EventDialogGeneralTabContent } from './EventDialogGeneralTabContent';
import { EventDialogTabPanel, EventDialogTabContent } from './EventDialogTabPanel';

interface GeneralTabProps {
  occurrence: SchedulerRenderableEventOccurrence;
  value: string;
}

export function GeneralTab(props: GeneralTabProps) {
  const { occurrence, value } = props;

  const { schedulerId, classes } = useEventEditingStyledContext();
  const { slots, slotProps } = useSchedulerSlots();

  // The tab panel stays owned by the dialog: its `hidden` state and its `aria-labelledby`
  // pairing with the tab are not reachable from the slot.
  const GeneralTabContent = slots.eventDialogGeneralTab ?? EventDialogGeneralTabContent;

  return (
    <EventDialogTabPanel
      role="tabpanel"
      id={`${schedulerId}-general-tabpanel`}
      aria-labelledby={`${schedulerId}-general-tab`}
      className={classes.eventDialogTabPanel}
      hidden={value !== 'general'}
    >
      <EventDialogTabContent className={classes.eventDialogTabContent}>
        <GeneralTabContent {...slotProps.eventDialogGeneralTab} occurrence={occurrence} />
      </EventDialogTabContent>
    </EventDialogTabPanel>
  );
}
