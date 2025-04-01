import * as React from 'react';
import {
  useGridSelector,
  getDataGridUtilityClass,
  gridClasses,
  NotRendered,
  GridSlotProps,
} from '@mui/x-data-grid-pro';
import { vars, useGridPanelContext } from '@mui/x-data-grid-pro/internals';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled } from '@mui/system';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import {
  gridAiAssistantHistorySelector,
  gridAiAssistantPanelOpenSelector,
  gridAiAssistantSuggestionsSelector,
} from '../../hooks/features/aiAssistant/gridAiAssistantSelectors';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { GridAiAssistantPanelHistory } from './GridAiAssistantPanelHistory';
import { GridPromptField } from '../promptField/GridPromptField';
import { GridAiAssistantPanelSuggestions } from './GridAiAssistantPanelSuggestions';

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['aiAssistantPanel'],
    header: ['aiAssistantPanelHeader'],
    title: ['aiAssistantPanelTitle'],
    body: ['aiAssistantPanelBody'],
    emptyText: ['aiAssistantPanelEmptyText'],
    footer: ['aiAssistantPanelFooter'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const AiAssistantPanelRoot = styled(NotRendered<GridSlotProps['panel']>, {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanel',
})<{ ownerState: OwnerState }>({
  [`& .${gridClasses.paper}`]: {
    flexDirection: 'column',
    width: 400,
    maxHeight: 'none',
    overflow: 'hidden',
  },
});

const AiAssistantPanelHeader = styled('div', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelHeader',
})<{ ownerState: OwnerState }>({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  boxSizing: 'border-box',
  borderBottom: `1px solid ${vars.colors.border.base}`,
  height: 52,
  padding: vars.spacing(0, 0.75, 0, 2),
});

const AiAssistantPanelTitle = styled('span', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelTitle',
})<{ ownerState: OwnerState }>({
  flex: 1,
  font: vars.typography.font.body,
  fontWeight: vars.typography.fontWeight.medium,
});

const AiAssistantPanelBody = styled('div', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelBody',
})<{ ownerState: OwnerState }>({
  flexGrow: 0,
  flexShrink: 0,
  height: 220,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const AiAssistantPanelEmptyText = styled('span', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelEmptyText',
})<{ ownerState: OwnerState }>({
  font: vars.typography.font.body,
  color: vars.colors.foreground.muted,
});

const AiAssistantPanelFooter = styled('div', {
  name: 'MuiDataGrid',
  slot: 'AiAssistantPanelFooter',
})<{ ownerState: OwnerState }>({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.spacing(1),
  borderTop: `1px solid ${vars.colors.border.base}`,
  padding: vars.spacing(1),
});

function GridAiAssistantPanel() {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses(rootProps);
  const open = useGridSelector(apiRef, gridAiAssistantPanelOpenSelector);
  const history = useGridSelector(apiRef, gridAiAssistantHistorySelector);
  const suggestions = useGridSelector(apiRef, gridAiAssistantSuggestionsSelector);
  const { aiAssistantPanelTriggerRef } = useGridPanelContext();

  const context = React.useMemo(
    () =>
      apiRef.current.unstable_aiAssistant.getPromptContext(rootProps.allowAiAssistantDataSampling),
    [apiRef, rootProps.allowAiAssistantDataSampling],
  );

  const handlePrompt = React.useCallback(
    async (value: string, promptContext = context) => {
      if (!rootProps.onPrompt) {
        return undefined;
      }

      const date = Date.now();

      apiRef.current.setLoading(true);
      apiRef.current.unstable_aiAssistant.setAiAssistantHistory((prevHistory) => [
        ...prevHistory,
        {
          value,
          createdAt: new Date(date),
        },
      ]);
      try {
        const response = await rootProps.onPrompt(value, promptContext);
        apiRef.current.unstable_aiAssistant.applyPromptResult(response);
        apiRef.current.unstable_aiAssistant.setAiAssistantHistory((prevHistory) =>
          prevHistory.map((item) =>
            item.createdAt.getTime() === date ? { ...item, response } : item,
          ),
        );
        return response;
      } catch (error: any) {
        console.error(error);
        apiRef.current.unstable_aiAssistant.setAiAssistantHistory((prevHistory) =>
          prevHistory.map((item) =>
            item.createdAt.getTime() === date
              ? {
                  ...item,
                  variant: 'error',
                  helperText: error.message,
                }
              : item,
          ),
        );
        return undefined;
      } finally {
        apiRef.current.setLoading(false);
      }
    },
    [apiRef, context, rootProps],
  );

  return (
    <AiAssistantPanelRoot
      as={rootProps.slots.panel}
      open={open}
      target={aiAssistantPanelTriggerRef.current}
      className={classes.root}
      ownerState={rootProps}
      onClose={() => apiRef.current.unstable_aiAssistant.setAiAssistantPanelOpen(false)}
      {...rootProps.slotProps?.panel}
    >
      <AiAssistantPanelHeader className={classes.header} ownerState={rootProps}>
        <AiAssistantPanelTitle className={classes.title} ownerState={rootProps}>
          {apiRef.current.getLocaleText('aiAssistantPanelTitle')}
        </AiAssistantPanelTitle>
        <rootProps.slots.baseIconButton
          onClick={() => apiRef.current.unstable_aiAssistant.setAiAssistantPanelOpen(false)}
        >
          <rootProps.slots.aiAssistantCloseIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
      </AiAssistantPanelHeader>
      <AiAssistantPanelBody className={classes.body} ownerState={rootProps}>
        {history.length > 0 ? (
          <GridAiAssistantPanelHistory open={open} history={history} onRerunPrompt={handlePrompt} />
        ) : (
          <AiAssistantPanelEmptyText ownerState={rootProps} className={classes.emptyText}>
            {apiRef.current.getLocaleText('aiAssistantPanelNoHistory')}
          </AiAssistantPanelEmptyText>
        )}
      </AiAssistantPanelBody>
      <AiAssistantPanelFooter className={classes.footer} ownerState={rootProps}>
        <GridPromptField
          onPrompt={handlePrompt}
          allowDataSampling={rootProps.allowAiAssistantDataSampling}
        />
        {suggestions.length > 0 && (
          <GridAiAssistantPanelSuggestions
            suggestions={suggestions}
            onSuggestionClick={handlePrompt}
          />
        )}
      </AiAssistantPanelFooter>
    </AiAssistantPanelRoot>
  );
}

export { GridAiAssistantPanel };
