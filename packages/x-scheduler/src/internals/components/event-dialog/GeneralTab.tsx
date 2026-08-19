'use client';
import * as React from 'react';
import Divider from '@mui/material/Divider';
import type { ResourceSelectionMode } from '@mui/x-scheduler-internals/internals';
import { useEventEditingStyledContext } from '../event-editing';
import type { EventDialogSectionProps } from './EventDialog.types';
import DateTimeSection from './DateTimeSection';
import ResourceAndColorSection from './ResourceAndColorSection';
import DescriptionSection from './DescriptionSection';
import { EventDialogTabPanel, EventDialogTabContent } from './EventDialogTabPanel';

interface GeneralTabProps extends EventDialogSectionProps {
  value: string;
  /**
   * Forwarded to `ResourceAndColorSection` as-is — see there for why it's a prop
   * instead of a value the section derives for itself.
   */
  resourceSelectionMode: ResourceSelectionMode;
}

export function GeneralTab(props: GeneralTabProps) {
  const { occurrence, value, resourceSelectionMode } = props;

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
        <DateTimeSection occurrence={occurrence} />
        <Divider />
        <ResourceAndColorSection
          occurrence={occurrence}
          resourceSelectionMode={resourceSelectionMode}
        />
        <Divider />
        <DescriptionSection occurrence={occurrence} />
      </EventDialogTabContent>
    </EventDialogTabPanel>
  );
}
