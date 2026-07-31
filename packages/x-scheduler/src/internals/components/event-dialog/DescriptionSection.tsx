'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import TextField from '@mui/material/TextField';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventEditingStyledContext } from '../event-editing';
import type { EventDialogSectionProps } from './EventDialog.types';
import { hasProp } from './utils';

// The description is uncontrolled, so the section only needs the occurrence for now (#22868).
type DescriptionSectionProps = Pick<EventDialogSectionProps, 'occurrence'>;

export default function DescriptionSection(props: DescriptionSectionProps) {
  const { occurrence } = props;

  // Context hooks
  const { localeText } = useEventEditingStyledContext();
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
