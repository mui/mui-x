import * as React from 'react';
import { getDataGridUtilityClass, gridClasses } from '@mui/x-data-grid-pro';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { keyframes, styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { PromptHistory } from '../../hooks/features/aiAssistant/gridAiAssistantInterfaces';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

type GridPromptProps = PromptHistory[number] & { onRerun: () => void };

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'> & {
  variant?: 'error';
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['prompt'],
    iconContainer: ['promptIconContainer'],
    icon: ['promptIcon'],
    text: ['promptText'],
    time: ['promptTime'],
    content: ['promptContent'],
    action: ['promptAction'],
    helperText: ['promptHelperText'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const fadeInUp = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(10px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
});

const growAndFadeIn = keyframes({
  from: {
    opacity: 0,
    transform: 'scale(0.8)',
  },
  to: {
    opacity: 1,
    transform: 'scale(1)',
  },
});

// This `styled()` function invokes keyframes. `styled-components` only supports keyframes
// in string templates. Do not convert these styles in JS object as it will break.
const Prompt = styled('li', {
  name: 'MuiDataGrid',
  slot: 'Prompt',
})<{ ownerState: OwnerState }>`
  display: flex;
  padding: ${vars.spacing(1, 1.5)};
  align-items: flex-start;
  gap: ${vars.spacing(1.5)};
  animation: ${fadeInUp} ${vars.transitions.duration.long} ${vars.transitions.easing.easeInOut};
  .${gridClasses.promptAction} {
    opacity: 0;
    transition: ${vars.transition(['opacity'], { duration: vars.transitions.duration.short })};
  }
  &:hover .${gridClasses.promptAction} {
    opacity: 1;
  }
`;

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
});

// This `styled()` function invokes keyframes. `styled-components` only supports keyframes
// in string templates. Do not convert these styles in JS object as it will break.
const PromptIcon = styled('svg', {
  name: 'MuiDataGrid',
  slot: 'PromptIcon',
})<{ ownerState: OwnerState }>`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: ${vars.spacing(1)};
  border-radius: 100%;
  color: ${({ ownerState }) =>
    ownerState.variant === 'error' ? vars.colors.foreground.error : vars.colors.foreground.muted};
  background-color: color-mix(in srgb, currentColor 15%, ${vars.colors.background.base});
  animation: ${growAndFadeIn} ${vars.transitions.duration.short}
    ${vars.transitions.easing.easeInOut};
`;
const PromptHelperText = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PromptHelperText',
})<{ ownerState: OwnerState }>({
  font: vars.typography.font.small,
  color: vars.colors.foreground.error,
});

function GridPrompt(props: GridPromptProps) {
  const { value, createdAt, response, helperText, variant, onRerun } = props;
  const rootProps = useGridRootProps();
  const ownerState = {
    classes: rootProps.classes,
    variant,
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
          <rootProps.slots.baseCircularProgress size={20} thickness={5} />
        ) : (
          <PromptIcon
            as={rootProps.slots.promptIcon}
            ownerState={ownerState}
            className={classes.icon}
            fontSize="small"
          />
        )}
      </PromptIconContainer>
      <PromptContent ownerState={ownerState} className={classes.content}>
        <PromptText ownerState={ownerState} className={classes.text}>
          {value}
        </PromptText>
        <PromptTime ownerState={ownerState} className={classes.time} title={fullSentAt}>
          {sentAt}
        </PromptTime>
        <PromptHelperText ownerState={ownerState} className={classes.helperText}>
          {helperText}
        </PromptHelperText>
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
