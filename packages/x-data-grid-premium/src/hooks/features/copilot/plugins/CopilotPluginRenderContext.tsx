'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import type { GridApiPremium } from '../../../../models/gridApiPremium';
import type { GridDataQueryResult } from '../executor/queryGridData';

export interface CopilotPluginRenderContextValue {
  /** `queryGridData` results approved during the active conversation. */
  queryResults: ReadonlyMap<string, GridDataQueryResult>;
  /** Host grid `apiRef` so plugin renderers can read live state. */
  apiRef: RefObject<GridApiPremium> | null;
}

const NULL_VALUE: CopilotPluginRenderContextValue = {
  queryResults: new Map(),
  apiRef: null,
};

const CopilotPluginRenderContext = React.createContext<CopilotPluginRenderContextValue>(NULL_VALUE);

export function useCopilotPluginRenderContext(): CopilotPluginRenderContextValue {
  return React.useContext(CopilotPluginRenderContext);
}

interface CopilotPluginRenderProviderProps {
  value: CopilotPluginRenderContextValue;
  children: React.ReactNode;
}

export function CopilotPluginRenderProvider(props: CopilotPluginRenderProviderProps) {
  const { value, children } = props;
  return (
    <CopilotPluginRenderContext.Provider value={value}>
      {children}
    </CopilotPluginRenderContext.Provider>
  );
}
