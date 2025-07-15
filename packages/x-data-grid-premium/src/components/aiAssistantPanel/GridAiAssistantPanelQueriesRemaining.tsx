'use client';
import * as React from 'react';
import { getDataGridUtilityClass, useGridSelector } from '@mui/x-data-grid-premium';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/system';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { gridAiAssistantEstimatedRemainingQueriesSelector } from '../../hooks/features/aiAssistant/gridAiAssistantSelectors';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'>;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['aiAssistantPanelQueriesRemaining'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const AiAssistantPanelQueriesRemainingRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelQueriesRemaining',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: vars.spacing(0.5, 1),
  font: vars.typography.font.small,
  color: vars.colors.foreground.muted,
});

export function GridAiAssistantPanelQueriesRemaining() {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const estimatedRemainingQueries = useGridSelector(
    apiRef,
    gridAiAssistantEstimatedRemainingQueriesSelector,
  );
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  // Don't render if no queries remaining info is available
  if (estimatedRemainingQueries === undefined) {
    return null;
  }

  return (
    <AiAssistantPanelQueriesRemainingRoot className={classes.root} ownerState={ownerState}>
      {estimatedRemainingQueries === 1
        ? '1 query remaining'
        : `${estimatedRemainingQueries} queries remaining`}
    </AiAssistantPanelQueriesRemainingRoot>
  );
}
