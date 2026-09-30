'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { inputBaseClasses } from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import { useEventEditingStyledContext } from '../event-editing';
import { useEventDialogFormContext } from './form/EventDialogFormContext';
import { useEventDialogFormField } from '../../../event-dialog/useEventDialogFormField';

const TitleTextField = styled(TextField, {
  name: 'MuiEventDialog',
  slot: 'TitleTextField',
})(({ theme }) => ({
  flex: 1,
  [`& .${inputBaseClasses.root}`]: {
    fontSize: theme.typography.h6.fontSize,
    lineHeight: theme.typography.h6.lineHeight,
    fontWeight: theme.typography.h6.fontWeight,
  },
}));

// Rendering the title in its own section keeps typing from re-rendering the
// whole dialog content: only this component subscribes to the `title` field.
export default function TitleSection() {
  // Context hooks
  const { occurrence } = useEventDialogFormContext();
  const { schedulerId, localeText } = useEventEditingStyledContext();

  const title = useEventDialogFormField('title');
  // `preventScroll` so focusing the title doesn't scroll a still-off-screen drawer into view
  // (the compact drawer slides up from the bottom, which would otherwise shove the grid).
  const titleInputRef = React.useCallback(
    (input: HTMLInputElement | null) => input?.focus({ preventScroll: true }),
    [],
  );

  return (
    <React.Fragment>
      <span
        id={`${schedulerId}-event-dialog-title`}
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        {occurrence.title}
      </span>
      <TitleTextField
        name="title"
        value={title.value}
        onChange={(event) => title.setValue(event.target.value)}
        required
        inputRef={titleInputRef}
        slotProps={{
          input: {
            readOnly: title.readOnly,
            'aria-label': localeText.eventTitleAriaLabel,
          },
          formHelperText: { role: 'alert' },
        }}
        error={!!title.error}
        helperText={title.error}
        fullWidth
        size="small"
      />
    </React.Fragment>
  );
}
