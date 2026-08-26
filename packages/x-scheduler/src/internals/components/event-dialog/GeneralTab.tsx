'use client';
import * as React from 'react';
import { useEventEditingStyledContext } from '../event-editing';
import { useSchedulerSlots } from '../SchedulerSlotsContext';
import { useEventDialogFormContext } from './form/EventDialogFormContext';
import { EventDialogGeneralTabContent } from '../../../event-dialog/EventDialogGeneralTabContent';
import { EventDialogTabPanel, EventDialogTabContent } from './EventDialogTabPanel';

interface GeneralTabProps {
  value: string;
  /**
   * Whether the dialog renders a tablist. Without one the panel must not
   * claim tab semantics — an orphaned tabpanel is an ARIA violation.
   */
  hasTabs: boolean;
}

export function GeneralTab(props: GeneralTabProps) {
  const { value, hasTabs } = props;

  const { schedulerId, classes } = useEventEditingStyledContext();
  const { slots, slotProps } = useSchedulerSlots();
  const { occurrence } = useEventDialogFormContext();

  // The tab panel stays owned by the dialog: its `hidden` state and its `aria-labelledby`
  // pairing with the tab are not reachable from the slot.
  const GeneralTabContent = slots.eventDialogGeneralTab ?? EventDialogGeneralTabContent;

  return (
    <EventDialogTabPanel
      role={hasTabs ? 'tabpanel' : undefined}
      id={hasTabs ? `${schedulerId}-general-tabpanel` : undefined}
      aria-labelledby={hasTabs ? `${schedulerId}-general-tab` : undefined}
      className={classes.eventDialogTabPanel}
      hidden={value !== 'general'}
    >
      <EventDialogTabContent className={classes.eventDialogTabContent}>
        <GeneralTabContent {...slotProps.eventDialogGeneralTab} occurrence={occurrence} />
      </EventDialogTabContent>
    </EventDialogTabPanel>
  );
}
