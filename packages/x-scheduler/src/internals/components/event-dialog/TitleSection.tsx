'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import { inputBaseClasses } from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventDialogStyledContext } from './EventDialogStyledContext';
import type { EventDialogSectionProps } from './EventDialog.types';
import { useEventDialogFormField } from './form/useEventDialogFormField';

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
export default function TitleSection(props: EventDialogSectionProps) {
  const { occurrence } = props;

  // Context hooks
  const { schedulerId, localeText } = useEventDialogStyledContext();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const isPropertyReadOnly = useStore(
    store,
    schedulerEventSelectors.isPropertyReadOnly,
    occurrence.id,
  );

  const title = useEventDialogFormField<string>('title');
  const titleInputRef = React.useCallback((input: HTMLInputElement | null) => input?.focus(), []);

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
            readOnly: isPropertyReadOnly('title'),
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
