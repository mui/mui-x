'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import TextField from '@mui/material/TextField';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventEditingOccurrence, useEventEditingStyledContext } from '../event-editing';
import { useEventDialogFormField } from './form/useEventDialogFormField';

export default function DescriptionSection() {
  // Context hooks
  const occurrence = useEventEditingOccurrence();
  const { localeText } = useEventEditingStyledContext();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const isPropertyReadOnly = useStore(
    store,
    schedulerEventSelectors.isPropertyReadOnly,
    occurrence.id,
  );

  const description = useEventDialogFormField<string>('description');

  return (
    <TextField
      name="description"
      label={localeText.descriptionLabel}
      value={description.value}
      onChange={(event) => description.setValue(event.target.value)}
      multiline
      rows={5}
      fullWidth
      slotProps={{
        input: { readOnly: isPropertyReadOnly('description') },
      }}
    />
  );
}
