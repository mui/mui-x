'use client';
import * as React from 'react';
import {
  getDataGridUtilityClass,
  gridClasses,
  gridColumnLookupSelector,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import type { GridSingleSelectColDef } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';

import { keyframes, styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import useId from '@mui/utils/useId';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import type { Prompt } from '../../hooks/features/aiAssistant/gridAiAssistantInterfaces';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import {
  buildAggregationChanges,
  buildChartChange,
  buildFilterChanges,
  buildGroupingChanges,
  buildPivotingChanges,
  buildSortingChanges,
  type Change,
} from './changeBuilders';

type GridPromptProps = Prompt & { onRerun: () => void };

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'> & {
  variant?: 'success' | 'error' | 'processing';
  showChanges: boolean;
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['prompt'],
    iconContainer: ['promptIconContainer'],
    icon: ['promptIcon'],
    text: ['promptText'],
    content: ['promptContent'],
    action: ['promptAction'],
    feedback: ['promptFeedback'],
    changeList: ['promptChangeList'],
    changesToggle: ['promptChangesToggle'],
    changesToggleIcon: ['promptChangesToggleIcon'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const fadeIn = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

const fadeInUp = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(5px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
});

// This `styled()` function invokes keyframes. `styled-components` only supports keyframes
// in string templates. Do not convert these styles in JS object as it will break.
const PromptItem = styled('li', {
  name: 'MuiDataGrid',
  slot: 'Prompt',
})<{ ownerState: OwnerState }>`
  display: flex;
  padding: ${vars.spacing(1, 1.25)};
  align-items: flex-start;
  overflow: hidden;
  .${gridClasses.promptAction} {
    opacity: 0;
    transition: ${vars.transition(['opacity'], { duration: vars.transitions.duration.short })};
  }
  &:hover .${gridClasses.promptAction}, & .${gridClasses.promptAction}:focus-visible {
    opacity: 1;
  }
  @media (prefers-reduced-motion: no-preference) {
    animation: ${fadeInUp} ${vars.transitions.duration.long} ${vars.transitions.easing.easeInOut};
  }
`;

const PromptContent = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PromptContent',
})<{ ownerState: OwnerState }>({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  overflow: 'hidden',
});

const PromptText = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PromptText',
})<{ ownerState: OwnerState }>({
  font: vars.typography.font.body,
});

const PromptIconContainer = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PromptIconContainer',
})<{ ownerState: OwnerState }>({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  marginRight: vars.spacing(1.5),
});

// This `styled()` function invokes keyframes. `styled-components` only supports keyframes
// in string templates. Do not convert these styles in JS object as it will break.
const PromptIcon = styled('svg', {
  name: 'MuiDataGrid',
  slot: 'PromptIcon',
})<{ ownerState: OwnerState }>`
  color: ${({ ownerState }) =>
    ownerState.variant === 'error' ? vars.colors.foreground.error : vars.colors.foreground.muted};
  @media (prefers-reduced-motion: no-preference) {
    animation: ${fadeIn} ${vars.transitions.duration.short} ${vars.transitions.easing.easeInOut};
  }
`;

const PromptFeedback = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PromptFeedback',
})<{ ownerState: OwnerState }>({
  font: vars.typography.font.small,
  color: vars.colors.foreground.muted,
  variants: [
    {
      props: {
        variant: 'error',
      },
      style: {
        color: vars.colors.foreground.error,
      },
    },
  ],
});

const PromptChangeList = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PromptChangeList',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.spacing(0.5),
  width: '100%',
  marginTop: vars.spacing(1),
  overflow: 'hidden',
});

const PromptChangesToggle = styled('button', {
  name: 'MuiDataGrid',
  slot: 'PromptChangesToggle',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing(0.25),
  padding: 0,
  font: vars.typography.font.small,
  color: vars.colors.foreground.accent,
  fontWeight: vars.typography.fontWeight.medium,
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  outline: 'none',
  '&:hover, &:focus-visible': {
    textDecoration: 'underline',
  },
});

const PromptChangesToggleIcon = styled('svg', {
  name: 'MuiDataGrid',
  slot: 'PromptChangesToggleIcon',
})<{ ownerState: OwnerState }>({
  variants: [
    {
      props: {
        showChanges: true,
      },
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
});

function GridPrompt(props: GridPromptProps) {
  const { value, response, helperText, variant, onRerun } = props;
  const rootProps = useGridRootProps();
  const [showChanges, setShowChanges] = React.useState(false);
  const ownerState = {
    classes: rootProps.classes,
    variant,
    showChanges,
  };
  const classes = useUtilityClasses(ownerState);
  const apiRef = useGridApiContext();
  const columns = useGridSelector(apiRef, gridColumnLookupSelector);
  const changesListId = useId();

  const changeList = React.useMemo<Change[]>(() => {
    if (!response) {
      return [];
    }

    const helpers = { apiRef, slots: rootProps.slots, columns };
    const changes: Change[] = [];

    if (response.grouping.length) {
      changes.push(...buildGroupingChanges(response.grouping, helpers));
    }
    if (response.aggregation && Object.keys(response.aggregation).length) {
      changes.push(...buildAggregationChanges(response.aggregation, helpers));
    }
    if (response.filters.length) {
      changes.push(...buildFilterChanges(response.filters, helpers));
    }
    if (response.sorting.length) {
      changes.push(...buildSortingChanges(response.sorting, helpers));
    }
    if (response.pivoting && 'columns' in response.pivoting) {
      changes.push(...buildPivotingChanges(response.pivoting, helpers));
    }
    if (response.chart) {
      changes.push(buildChartChange(response.chart, helpers));
    }

    return changes;
  }, [response, apiRef, rootProps.slots, columns]);

  return (
    <PromptItem ownerState={ownerState} className={classes.root}>
      <PromptIconContainer ownerState={ownerState} className={classes.iconContainer}>
        {!response && variant !== 'error' ? (
          <rootProps.slots.baseCircularProgress size={20} />
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
        <PromptFeedback ownerState={ownerState} className={classes.feedback}>
          {helperText}
        </PromptFeedback>
        {changeList.length > 0 ? (
          <React.Fragment>
            <PromptChangesToggle
              ownerState={ownerState}
              className={classes.changesToggle}
              aria-expanded={showChanges}
              aria-controls={changesListId}
              onClick={() => setShowChanges(!showChanges)}
            >
              {apiRef.current.getLocaleText('promptAppliedChanges')}
              <PromptChangesToggleIcon
                as={rootProps.slots.promptChangesToggleIcon}
                ownerState={ownerState}
                fontSize="small"
              />
            </PromptChangesToggle>
            {showChanges && (
              <PromptChangeList
                id={changesListId}
                ownerState={ownerState}
                className={classes.changeList}
              >
                {changeList.map((change) => (
                  <rootProps.slots.baseTooltip key={change.label} title={change.description}>
                    <rootProps.slots.baseChip
                      label={change.label}
                      icon={<change.icon />}
                      size="small"
                    />
                  </rootProps.slots.baseTooltip>
                ))}
              </PromptChangeList>
            )}
          </React.Fragment>
        ) : null}
      </PromptContent>
      <rootProps.slots.baseTooltip
        title={apiRef.current.getLocaleText('promptRerun')}
        enterDelay={500}
      >
        <rootProps.slots.baseIconButton size="small" className={classes.action} onClick={onRerun}>
          <rootProps.slots.promptRerunIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
      </rootProps.slots.baseTooltip>
    </PromptItem>
  );
}

export { GridPrompt };
