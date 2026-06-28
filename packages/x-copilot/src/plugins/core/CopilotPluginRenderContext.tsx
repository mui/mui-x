'use client';
import * as React from 'react';

/**
 * Render-side context for plugin tool renderers. Generic over the host's API
 * type and data-query result type. The host wraps `<CopilotPanel>` with this
 * provider; renderers consume it via `useCopilotPluginRenderContext()`.
 */
export interface CopilotPluginRenderContextValue<TApi = unknown, TQueryResult = unknown> {
  /** Host data-query results approved during the active conversation. */
  queryResults: ReadonlyMap<string, TQueryResult>;
  /** Host's imperative API so plugin renderers can read live state. */
  api: TApi | null;
}

const NULL_VALUE: CopilotPluginRenderContextValue<unknown, unknown> = {
  queryResults: new Map(),
  api: null,
};

const CopilotPluginRenderContext =
  React.createContext<CopilotPluginRenderContextValue<unknown, unknown>>(NULL_VALUE);

export function useCopilotPluginRenderContext<
  TApi = unknown,
  TQueryResult = unknown,
>(): CopilotPluginRenderContextValue<TApi, TQueryResult> {
  return React.useContext(CopilotPluginRenderContext) as CopilotPluginRenderContextValue<
    TApi,
    TQueryResult
  >;
}

interface CopilotPluginRenderProviderProps<TApi = unknown, TQueryResult = unknown> {
  value: CopilotPluginRenderContextValue<TApi, TQueryResult>;
  children: React.ReactNode;
}

export function CopilotPluginRenderProvider<TApi = unknown, TQueryResult = unknown>(
  props: CopilotPluginRenderProviderProps<TApi, TQueryResult>,
) {
  const { value, children } = props;
  return (
    <CopilotPluginRenderContext.Provider
      value={value as CopilotPluginRenderContextValue<unknown, unknown>}
    >
      {children}
    </CopilotPluginRenderContext.Provider>
  );
}
