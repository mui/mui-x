import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import {
  GridPipeProcessingApi,
  GridPipeProcessor,
  GridPipeProcessorGroup,
} from './gridPipeProcessingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridEvents } from '../../../models/events';

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
 *   When the processor changes, it will fire `GridEvents.pipeProcessorRegister` to re-apply the whole pipe.
 *
 * =====================================================================================================================
 *
 * The plugin or component that needs to enrich its data must use:
 *
 * - `apiRef.current.unstable_applyPipeProcessors` to run in chain all the processors of a given group.
 *
 * - `GridEvents.pipeProcessorRegister` to re-apply the whole pipe when a processor of this pipe changes.
 *
 */
export const useGridPipeProcessing = (apiRef: React.MutableRefObject<GridApiCommunity>) => {
  const processorsCache = React.useRef<{
    [G in GridPipeProcessorGroup]?: {
      [processorId: string]: GridPipeProcessor<any>;
    };
  }>({});

  const registerPipeProcessor = React.useCallback<
    GridPipeProcessingApi['unstable_registerPipeProcessor']
  >(
    (group, id, processor) => {
      if (!processorsCache.current[group]) {
        processorsCache.current[group] = {};
      }

      const groupProcessors = processorsCache.current[group]!;
      const oldProcessor = groupProcessors[id];
      if (oldProcessor !== processor) {
        processorsCache.current[group] = { ...groupProcessors, [id]: processor };
        apiRef.current.publishEvent(GridEvents.pipeProcessorRegister, group);
      }

      return () => {
        const { [id]: removedGroupProcessor, ...otherProcessors } = processorsCache.current[group]!;
        processorsCache.current[group] = otherProcessors;
        apiRef.current.publishEvent(GridEvents.pipeProcessorUnregister, group);
      };
    },
    [apiRef],
  );

  const applyPipeProcessors = React.useCallback<
    GridPipeProcessingApi['unstable_applyPipeProcessors']
  >((...args) => {
    const [group, value, context] = args as [GridPipeProcessorGroup, any, any];
    if (!processorsCache.current[group]) {
      return value;
    }

    const preProcessors = Object.values(processorsCache.current[group]!);
    return preProcessors.reduce((acc, preProcessor) => {
      return preProcessor(acc, context);
    }, value);
  }, []);

  const preProcessingApi: GridPipeProcessingApi = {
    unstable_registerPipeProcessor: registerPipeProcessor,
    unstable_applyPipeProcessors: applyPipeProcessors,
  };

  useGridApiMethod(apiRef, preProcessingApi, 'GridPipeProcessingApi');
};
