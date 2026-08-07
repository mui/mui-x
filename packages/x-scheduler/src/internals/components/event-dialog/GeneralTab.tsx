'use client';
import * as React from 'react';
import { useEventEditingStyledContext } from '../event-editing';
import { EventDialogGeneralTabContent } from './EventDialogGeneralTabContent';
import { EventDialogTabPanel, EventDialogTabContent } from './EventDialogTabPanel';

interface GeneralTabProps {
  value: string;
}

export function GeneralTab(props: GeneralTabProps) {
  const { value } = props;

  const { schedulerId, classes } = useEventEditingStyledContext();

  return (
    <EventDialogTabPanel
      role="tabpanel"
      id={`${schedulerId}-general-tabpanel`}
      aria-labelledby={`${schedulerId}-general-tab`}
      className={classes.eventDialogTabPanel}
      hidden={value !== 'general'}
    >
      <EventDialogTabContent className={classes.eventDialogTabContent}>
        <EventDialogGeneralTabContent />
      </EventDialogTabContent>
    </EventDialogTabPanel>
  );
}
