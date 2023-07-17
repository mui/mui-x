import * as React from 'react';
import { GridPrivateApiCommon } from '../../../models/api/gridApiCommon';
import {
  GridPipeProcessingApi,
  GridPipeProcessingPrivateApi,
  GridPipeProcessor,
  GridPipeProcessorGroup,
} from './gridPipeProcessingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';

interface GridPipeGroupCache {
  processors: Map<string, GridPipeProcessor<any> | null>;
  appliers: {
    [applierId: string]: () => void;
  };
}

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
export const useGridPipeProcessing = (apiRef: React.MutableRefObject<GridPrivateApiCommon>) => {
  const processorsCache = React.useRef<{
    [G in GridPipeProcessorGroup]?: GridPipeGroupCache;
  }>({});

  const isRunning = React.useRef(false);
  const runAppliers = React.useCallback((groupCache: GridPipeGroupCache | undefined) => {
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
  >(
    (group, id, processor) => {
      if (!processorsCache.current[group]) {
        processorsCache.current[group] = {
          processors: new Map(),
          appliers: {},
        };
      }

      const groupCache = processorsCache.current[group]!;
      const oldProcessor = groupCache.processors.get(id);
      if (oldProcessor !== processor) {
        groupCache.processors.set(id, processor);
        runAppliers(groupCache);
      }

      return () => {
        processorsCache.current[group]!.processors.set(id, null);
      };
    },
    [runAppliers],
  );

  const registerPipeApplier = React.useCallback<
    GridPipeProcessingPrivateApi['registerPipeApplier']
  >((group, id, applier) => {
    if (!processorsCache.current[group]) {
      processorsCache.current[group] = {
        processors: new Map(),
        appliers: {},
      };
    }

    processorsCache.current[group]!.appliers[id] = applier;

    return () => {
      const { [id]: removedGroupApplier, ...otherAppliers } =
        processorsCache.current[group]!.appliers;
      processorsCache.current[group]!.appliers = otherAppliers;
    };
  }, []);

  const requestPipeProcessorsApplication = React.useCallback<
    GridPipeProcessingPrivateApi['requestPipeProcessorsApplication']
  >(
    (group) => {
      const groupCache = processorsCache.current[group];
      runAppliers(groupCache);
    },
    [runAppliers],
  );

  const applyPipeProcessors = React.useCallback<
    GridPipeProcessingApi['unstable_applyPipeProcessors']
  >((...args) => {
    const [group, value, context] = args as [GridPipeProcessorGroup, any, any];
    if (!processorsCache.current[group]) {
      return value;
    }

    const preProcessors = Array.from(processorsCache.current[group]!.processors.values());
    return preProcessors.reduce((acc, preProcessor) => {
      if (!preProcessor) {
        return acc;
      }

      return preProcessor(acc, context);
    }, value);
  }, []);

  const preProcessingPrivateApi: GridPipeProcessingPrivateApi = {
    registerPipeProcessor,
    registerPipeApplier,
    requestPipeProcessorsApplication,
  };
  const preProcessingPublicApi: GridPipeProcessingApi = {
    unstable_applyPipeProcessors: applyPipeProcessors,
  };

  useGridApiMethod(apiRef, preProcessingPrivateApi, 'private');
  useGridApiMethod(apiRef, preProcessingPublicApi, 'public');
};
