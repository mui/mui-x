'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { GridPrivateApiCommon } from '../../../models/api/gridApiCommon';
import {
  GridPipeProcessingApi,
  GridPipeProcessingPrivateApi,
  GridPipeProcessor,
  GridPipeProcessorGroup,
} from './gridPipeProcessingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';

type Cache = {
  [G in GridPipeProcessorGroup]?: GroupCache;
};

type GroupCache = {
  processors: Map<string, GridPipeProcessor<any> | null>;
  processorsAsArray: GridPipeProcessor<any>[];
  appliers: {
    [applierId: string]: () => void;
  };
  processorsUpdated: boolean;
};

/**
 * Implement the Pipeline Pattern
 *
 * More information and detailed example in (TODO add link to technical doc when ready)
 *
 * Some plugins contains custom logic to enrich data provided by other plugins or components.
 * For instance, the row grouping plugin needs to add / remove the grouping columns when the grid columns are updated.
 *
 * =====================================================================================================================
 *
 * The plugin containing the custom logic must use:
 *
 * - `useGridRegisterPipeProcessor` to register their processor.
 *
 * - `apiRef.current.requestPipeProcessorsApplication` to imperatively re-apply a group.
 *   This method should be used in last resort.
 *   Most of the time, the application should be triggered by an update on the deps of the processor.
 *
 * =====================================================================================================================
 *
 * The plugin or component that needs to enrich its data must use:
 *
 * - `apiRef.current.unstable_applyPipeProcessors` to run in chain all the processors of a given group.
 *
 * - `useGridRegisterPipeApplier` to re-apply the whole pipe when requested.
 *   The applier will be called when:
 *   * a processor is registered.
 *   * `apiRef.current.requestPipeProcessorsApplication` is called for the given group.
 */
export const useGridPipeProcessing = (apiRef: RefObject<GridPrivateApiCommon>) => {
  const cache = React.useRef<Cache>({});

  const isRunning = React.useRef(false);
  const runAppliers = React.useCallback((groupCache: GroupCache | undefined) => {
    if (isRunning.current || !groupCache) {
      return;
    }
    isRunning.current = true;
    Object.values(groupCache.appliers).forEach((callback) => {
      callback();
    });
    isRunning.current = false;
  }, []);

  const registerPipeProcessor = React.useCallback<
    GridPipeProcessingPrivateApi['registerPipeProcessor']
  >((group, id, processor) => {
    if (!cache.current[group]) {
      cache.current[group] = {
        processors: new Map(),
        processorsAsArray: [],
        appliers: {},
        processorsUpdated: false,
      };
    }

    const groupCache = cache.current[group]!;
    const oldProcessor = groupCache.processors.get(id);
    if (oldProcessor !== processor) {
      groupCache.processors.set(id, processor);
      groupCache.processorsAsArray = Array.from(cache.current[group]!.processors.values()).filter(
        (processorValue) => processorValue !== null,
      );
      groupCache.processorsUpdated = true;
    }

    return () => {
      cache.current[group]!.processors.set(id, null);
      cache.current[group]!.processorsAsArray = Array.from(
        cache.current[group]!.processors.values(),
      ).filter((processorValue) => processorValue !== null);
    };
  }, []);

  const registerPipeApplier = React.useCallback<
    GridPipeProcessingPrivateApi['registerPipeApplier']
  >((group, id, applier) => {
    if (!cache.current[group]) {
      cache.current[group] = {
        processors: new Map(),
        processorsAsArray: [],
        appliers: {},
        processorsUpdated: false,
      };
    }

    cache.current[group]!.appliers[id] = applier;

    return () => {
      const { [id]: removedGroupApplier, ...otherAppliers } = cache.current[group]!.appliers;
      cache.current[group]!.appliers = otherAppliers;
    };
  }, []);

  const requestPipeProcessorsApplication = React.useCallback<
    GridPipeProcessingPrivateApi['requestPipeProcessorsApplication']
  >(
    (group) => {
      runAppliers(cache.current[group]);
    },
    [runAppliers],
  );

  const runAppliersForPendingProcessors = React.useCallback(() => {
    for (const group in cache.current) {
      if (!Object.prototype.hasOwnProperty.call(cache.current, group)) {
        continue;
      }
      const groupCache = cache.current[group as keyof Cache]!;
      if (groupCache.processorsUpdated) {
        groupCache.processorsUpdated = false;
        runAppliers(groupCache);
      }
    }
  }, [runAppliers]);

  const applyPipeProcessors = React.useCallback<
    GridPipeProcessingApi['unstable_applyPipeProcessors']
  >((...args) => {
    const [group, value, context] = args as [GridPipeProcessorGroup, any, any];
    if (!cache.current[group]) {
      return value;
    }

    const processors = cache.current[group]!.processorsAsArray;
    let result = value;
    for (let i = 0; i < processors.length; i += 1) {
      result = processors[i](result, context);
    }
    return result;
  }, []);

  const preProcessingPrivateApi: GridPipeProcessingPrivateApi = {
    registerPipeProcessor,
    registerPipeApplier,
    requestPipeProcessorsApplication,
    runAppliersForPendingProcessors,
  };
  const preProcessingPublicApi: GridPipeProcessingApi = {
    unstable_applyPipeProcessors: applyPipeProcessors,
  };

  useGridApiMethod(apiRef, preProcessingPrivateApi, 'private');
  useGridApiMethod(apiRef, preProcessingPublicApi, 'public');
};
