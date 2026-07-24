'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import TextField from '@mui/material/TextField';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventDialogStyledContext } from './EventDialogStyledContext';
import { hasProp } from './utils';

interface DescriptionSectionProps {
  occurrence: SchedulerRenderableEventOccurrence;
}

export default function DescriptionSection(props: DescriptionSectionProps) {
  const { occurrence } = props;

  // Context hooks
  const { localeText } = useEventDialogStyledContext();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const isPropertyReadOnly = useStore(
    store,
    schedulerEventSelectors.isPropertyReadOnly,
    occurrence.id,
  );

  return (
    <TextField
      name="description"
      label={localeText.descriptionLabel}
      defaultValue={hasProp(occurrence, 'description') ? occurrence.description : ''}
      multiline
      rows={5}
      fullWidth
      slotProps={{
        input: { readOnly: isPropertyReadOnly('description') },
      }}
    />
  );
}
