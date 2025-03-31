import * as React from 'react';
import { getDataGridUtilityClass, gridClasses } from '@mui/x-data-grid-pro';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { PromptHistory } from '../../hooks/features/aiAssistant/gridAiAssistantInterfaces';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

type GridPromptProps = PromptHistory[number] & { onRerun: () => void };

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'> & { error: boolean };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['prompt'],
    iconContainer: ['promptIconContainer'],
    text: ['promptText'],
    time: ['promptTime'],
    content: ['promptContent'],
    action: ['promptAction'],
    error: ['promptError'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const Prompt = styled('li', {
  name: 'MuiDataGrid',
  slot: 'Prompt',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  padding: vars.spacing(1, 1.5),
  alignItems: 'flex-start',
  gap: vars.spacing(1.5),
  [`.${gridClasses.promptAction}`]: {
    opacity: 0,
    transition: vars.transition(['opacity'], { duration: vars.transitions.duration.short }),
  },
  [`&:hover .${gridClasses.promptAction}`]: {
    opacity: 1,
  },
});

const PromptContent = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PromptContent',
})<{ ownerState: OwnerState }>({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

const PromptText = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PromptText',
})<{ ownerState: OwnerState }>({
  font: vars.typography.font.body,
});

const PromptTime = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PromptTime',
})<{ ownerState: OwnerState }>({
  font: vars.typography.font.small,
  color: vars.colors.foreground.muted,
});

const PromptIconContainer = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PromptIconContainer',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: '100%',
  backgroundColor: `color-mix(in srgb, currentColor 15%, ${vars.colors.background.base})`,
  color: vars.colors.foreground.muted,
  variants: [
    {
      props: {
        error: true,
      },
      style: {
        color: vars.colors.foreground.error,
      },
    },
  ],
});

const PromptError = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PromptError',
})<{ ownerState: OwnerState }>({
  font: vars.typography.font.small,
  color: vars.colors.foreground.error,
});

function GridPrompt(props: GridPromptProps) {
  const { value, createdAt, response, onRerun } = props;
  const rootProps = useGridRootProps();
  const ownerState = {
    classes: rootProps.classes,
    error: !!response?.error,
  };
  const classes = useUtilityClasses(ownerState);
  const apiRef = useGridApiContext();
  const sentAt = formatDateTime(createdAt);
  const fullSentAt = createdAt.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Prompt key={createdAt.toISOString()} ownerState={ownerState} className={classes.root}>
      <PromptIconContainer ownerState={ownerState} className={classes.iconContainer}>
        {response === null ? (
          <rootProps.slots.baseCircularProgress size={20} thickness={5} color="inherit" />
        ) : (
          <rootProps.slots.promptIcon fontSize="small" />
        )}
      </PromptIconContainer>
      <PromptContent ownerState={ownerState} className={classes.content}>
        <PromptText ownerState={ownerState} className={classes.text}>
          {value}
        </PromptText>
        <PromptTime ownerState={ownerState} className={classes.time} title={fullSentAt}>
          {sentAt}
        </PromptTime>
        <PromptError ownerState={ownerState} className={classes.error}>
          {response?.error}
        </PromptError>
      </PromptContent>
      <rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('promptRerun')}>
        <rootProps.slots.baseIconButton size="small" className={classes.action} onClick={onRerun}>
          <rootProps.slots.promptRerunIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
      </rootProps.slots.baseTooltip>
    </Prompt>
  );
}

function formatDateTime(date: Date) {
  // if today, show time e.g. 08:32
  if (isToday(date)) {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Otherwise, show 10/10/2025
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
}

function isToday(date: Date) {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export { GridPrompt };
