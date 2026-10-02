'use client';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { useEventEditingStyledContext } from '../internals/components/event-editing/EventEditingStyledContext';
import { useEventDialogFormField } from './useEventDialogFormField';

export function EventDialogDescriptionSection() {
  const { localeText } = useEventEditingStyledContext();
  const description = useEventDialogFormField('description');

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
        input: { readOnly: description.readOnly },
      }}
    />
  );
}
