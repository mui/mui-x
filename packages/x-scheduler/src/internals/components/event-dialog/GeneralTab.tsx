'use client';
import * as React from 'react';
import Divider from '@mui/material/Divider';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { useEventDialogStyledContext } from './EventDialogStyledContext';
import type { ControlledValue } from './utils';
import DateTimeSection from './DateTimeSection';
import ResourceAndColorSection from './ResourceAndColorSection';
import DescriptionSection from './DescriptionSection';
import { EventDialogTabPanel, EventDialogTabContent } from './EventDialogTabPanel';

interface GeneralTabProps {
  occurrence: SchedulerRenderableEventOccurrence;
  errors: Record<string, string | string[]>;
  setErrors: (errors: Record<string, string | string[]>) => void;
  controlled: ControlledValue;
  setControlled: React.Dispatch<React.SetStateAction<ControlledValue>>;
  value: string;
}

export function GeneralTab(props: GeneralTabProps) {
  const { occurrence, errors, setErrors, controlled, setControlled, value } = props;

  const { schedulerId, classes } = useEventDialogStyledContext();

  return (
    <EventDialogTabPanel
      role="tabpanel"
      id={`${schedulerId}-general-tabpanel`}
      aria-labelledby={`${schedulerId}-general-tab`}
      className={classes.eventDialogTabPanel}
      hidden={value !== 'general'}
    >
      <EventDialogTabContent className={classes.eventDialogTabContent}>
        <DateTimeSection
          occurrence={occurrence}
          controlled={controlled}
          setControlled={setControlled}
          errors={errors}
          setErrors={setErrors}
        />
        <Divider />
        <ResourceAndColorSection
          occurrence={occurrence}
          controlled={controlled}
          setControlled={setControlled}
          errors={errors}
          setErrors={setErrors}
        />
        <Divider />
        <DescriptionSection occurrence={occurrence} />
      </EventDialogTabContent>
    </EventDialogTabPanel>
  );
}
