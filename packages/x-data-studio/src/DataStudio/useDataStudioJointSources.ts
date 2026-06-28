'use client';
import * as React from 'react';
import type { GridValidRowModel } from '@mui/x-data-grid';
import type { DataStudioJoinDefinition } from '../models';
import { createDataStudioJointDataSource } from '../createDataStudioJointDataSource';
import type { DataStudioDataSource, DataStudioJointSourceConfig } from './DataStudio.types';
import type { DataStudioJointSourcesPersistenceAdapter } from './jointSourcesPersistence';

export interface UseDataStudioJointSourcesParams<R extends GridValidRowModel> {
  /** The registered base data sources (joint sources reference these by id). */
  dataSources: DataStudioDataSource<R>[];
  /** Persistence adapter, or `null` to disable persistence. */
  persistence: DataStudioJointSourcesPersistenceAdapter | null;
}

export interface UseDataStudioJointSourcesResult<R extends GridValidRowModel> {
  /** The runtime joint data sources, built from the persisted configs. */
  jointSources: DataStudioDataSource<R>[];
  /** The persisted configs (for the builder's edit/delete affordances). */
  jointConfigs: DataStudioJointSourceConfig[];
  // Create a joint source from a label + definition; returns its generated id.
  createJointSource: (input: { label: string; definition: DataStudioJoinDefinition }) => string;
  // Update an existing joint source's label + definition.
  updateJointSource: (
    id: string,
    input: { label: string; definition: DataStudioJoinDefinition },
  ) => void;
  // Delete a joint source by id.
  deleteJointSource: (id: string) => void;
}

function slugify(label: string): string {
  return (
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 40) || 'joint'
  );
}

/**
 * Owns the lifecycle of user-authored joint sources: hydrates persisted configs
 * on mount, persists on every create/delete, and rebuilds the runtime
 * `DataStudioDataSource`s (via `createDataStudioJointDataSource`) whenever the
 * configs or base sources change. A config that references a missing base source
 * (e.g. a removed table) is skipped rather than throwing.
 * @param {UseDataStudioJointSourcesParams} params Base sources + persistence.
 * @returns {UseDataStudioJointSourcesResult} Joint sources + mutation handlers.
 */
export function useDataStudioJointSources<R extends GridValidRowModel = any>(
  params: UseDataStudioJointSourcesParams<R>,
): UseDataStudioJointSourcesResult<R> {
  const { dataSources, persistence } = params;
  const [jointConfigs, setJointConfigs] = React.useState<DataStudioJointSourceConfig[]>([]);

  // Hydrate once on mount (kept out of lazy state init to avoid SSR mismatch).
  const hasHydratedRef = React.useRef(false);
  React.useEffect(() => {
    if (hasHydratedRef.current || !persistence) {
      return;
    }
    hasHydratedRef.current = true;
    const stored = persistence.read();
    if (stored && stored.length > 0) {
      setJointConfigs(stored);
    }
  }, [persistence]);

  const createJointSource = React.useCallback(
    (input: { label: string; definition: DataStudioJoinDefinition }) => {
      const id = `joint-${slugify(input.label)}-${Date.now().toString(36)}`;
      setJointConfigs((prev) => {
        const next = [...prev, { id, label: input.label, definition: input.definition }];
        persistence?.write(next);
        return next;
      });
      return id;
    },
    [persistence],
  );

  const updateJointSource = React.useCallback(
    (id: string, input: { label: string; definition: DataStudioJoinDefinition }) => {
      setJointConfigs((prev) => {
        const next = prev.map((config) =>
          config.id === id ? { ...config, label: input.label, definition: input.definition } : config,
        );
        persistence?.write(next);
        return next;
      });
    },
    [persistence],
  );

  const deleteJointSource = React.useCallback(
    (id: string) => {
      setJointConfigs((prev) => {
        const next = prev.filter((config) => config.id !== id);
        persistence?.write(next);
        return next;
      });
    },
    [persistence],
  );

  const jointSources = React.useMemo(
    () =>
      jointConfigs
        .map((config) => {
          try {
            return createDataStudioJointDataSource<R>({
              id: config.id,
              label: config.label,
              definition: config.definition,
              baseDataSources: dataSources,
            });
          } catch {
            // A config can outlive its base source (e.g. a removed table); skip
            // it rather than crashing the whole studio.
            return null;
          }
        })
        .filter((source): source is DataStudioDataSource<R> => source !== null),
    [jointConfigs, dataSources],
  );

  return { jointSources, jointConfigs, createJointSource, updateJointSource, deleteJointSource };
}
