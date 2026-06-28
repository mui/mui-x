'use client';
import * as React from 'react';
import type { ChatAdapter } from '@mui/x-chat-headless';
import type { CopilotPlugin } from '@mui/x-copilot';
import { useCopilot, type UseCopilotReturn } from '@mui/x-copilot/hooks';
import type { DataStudioDataSource } from '../DataStudio/DataStudio.types';
import type { DataStudioStateApi } from '../DataStudio/useDataStudioState';
import { buildStudioGuards, DEFAULT_STUDIO_GUARDS, type StudioGuards } from './guards';
import {
  createStudioHostAdapter,
  type StudioHostAdapter,
  type StudioCopilotJointSourcesApi,
} from './studioHostAdapter';
import { studioCommandPack, studioReconcilerPack } from './studioPacks';
import { createQueryStudioDataProvider } from './dataQuery';
import type { StudioDataQueryResult } from './dataQuery';
import type { StudioStateDocument } from './stateDocument';

export interface UseStudioCopilotOptions {
  /**
   * Underlying chat adapter — typically `createStudioCopilotLocalStorageAdapter`
   * wrapping a backend chat adapter (AI SDK, custom, etc.).
   */
  inner: ChatAdapter;
  /** Studio state API returned by `useDataStudioState`. */
  stateApi: DataStudioStateApi<any>;
  /** DataSources currently configured on the studio. */
  dataSources: ReadonlyArray<DataStudioDataSource<any>>;
  /** Joint-source management API (configs + create/update/remove). */
  jointSources: StudioCopilotJointSourcesApi;
  /** Optional override for the default guards. */
  features?: Partial<StudioGuards>;
  /** Optional copilot plugins (PDF, formula, custom). */
  plugins?: ReadonlyArray<CopilotPlugin<any, any>>;
}

export interface UseStudioCopilotReturn extends UseCopilotReturn<StudioDataQueryResult> {
  /** The constructed Studio host adapter — useful for diagnostics. */
  host: StudioHostAdapter;
}

/**
 * Thin Studio-flavored wrapper around `useCopilot`. Builds the Studio host
 * adapter, command/patch packs, and data-query provider, then forwards
 * everything into the generic hook.
 */
export function useStudioCopilot(options: UseStudioCopilotOptions): UseStudioCopilotReturn {
  const { inner, stateApi, dataSources, jointSources, features, plugins } = options;

  const guards = React.useMemo<StudioGuards>(
    () => (features ? buildStudioGuards(features) : DEFAULT_STUDIO_GUARDS),
    [features],
  );

  // Capture live values via refs so the host adapter identity stays stable
  // across renders. The adapter reads .current via the getter functions every
  // time a handler runs or a snapshot is taken.
  const stateApiRef = React.useRef(stateApi);
  stateApiRef.current = stateApi;
  const dataSourcesRef = React.useRef(dataSources);
  dataSourcesRef.current = dataSources;
  const jointSourcesRef = React.useRef(jointSources);
  jointSourcesRef.current = jointSources;

  const host = React.useMemo<StudioHostAdapter>(
    () =>
      createStudioHostAdapter({
        getStateApi: () => stateApiRef.current,
        getDataSources: () => dataSourcesRef.current,
        getJointSources: () => jointSourcesRef.current,
        guards,
        dataQuery: guards.dataQuery
          ? createQueryStudioDataProvider(() => dataSourcesRef.current)
          : undefined,
      }),
    [guards],
  );

  const commandPacks = React.useMemo(() => [studioCommandPack], []);
  const patchPacks = React.useMemo(() => [studioReconcilerPack], []);

  const result = useCopilot<StudioHostAdapter, StudioStateDocument, StudioDataQueryResult>({
    inner,
    host,
    guards,
    commandPacks,
    patchPacks,
    plugins,
  });

  return { ...result, host };
}
