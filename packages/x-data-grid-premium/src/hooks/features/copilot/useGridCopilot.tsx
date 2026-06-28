'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { useGridApiMethod } from '@mui/x-data-grid-pro';
import {
  type GridPipeProcessor,
  useGridRegisterPipeProcessor,
} from '@mui/x-data-grid-pro/internals';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridSidebarValue } from '../sidebar';
import type { GridCopilotAdapter, GridCopilotApi } from './gridCopilotInterfaces';
import { useGridCopilotExecutor } from './useGridCopilotExecutor';

export const useGridCopilot = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: DataGridPremiumProcessedProps,
): void => {
  const isCopilotAvailable = !!props.copilot;
  const { slots } = props;

  const {
    wrappedAdapter,
    applyEnvelope,
    switchToVariant,
    getResultsForMessage,
    subscribeResults,
    queryResults,
    hydrateQueryResultsFromMessages,
  } = useGridCopilotExecutor(apiRef, props);
  const getQueryResults = React.useCallback(() => queryResults, [queryResults]);

  const addCopilotPanel = React.useCallback<GridPipeProcessor<'sidebar'>>(
    (initialValue, value) => {
      if (isCopilotAvailable && slots.copilotPanel && value === GridSidebarValue.Copilot) {
        const CopilotPanel = slots.copilotPanel;
        return <CopilotPanel />;
      }

      return initialValue;
    },
    [isCopilotAvailable, slots],
  );

  const open = React.useCallback<GridCopilotApi['copilot']['open']>(() => {
    apiRef.current.showSidebar(GridSidebarValue.Copilot);
  }, [apiRef]);

  const close = React.useCallback<GridCopilotApi['copilot']['close']>(() => {
    apiRef.current.hideSidebar();
  }, [apiRef]);

  const getAdapter = React.useCallback<GridCopilotApi['copilot']['getAdapter']>(():
    | GridCopilotAdapter
    | undefined => {
    return wrappedAdapter;
  }, [wrappedAdapter]);

  useGridRegisterPipeProcessor(apiRef, 'sidebar', addCopilotPanel);
  useGridApiMethod(
    apiRef,
    {
      copilot: {
        open,
        close,
        getAdapter,
        applyEnvelope,
        switchToVariant,
        getResultsForMessage,
        subscribeResults,
        getQueryResults,
        hydrateQueryResultsFromMessages,
      },
    },
    'public',
  );
};
