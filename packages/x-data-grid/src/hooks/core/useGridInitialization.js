import { useGridRefs } from './useGridRefs';
import { useGridIsRtl } from './useGridIsRtl';
import { useGridLoggerFactory } from './useGridLoggerFactory';
import { useGridLocaleText } from './useGridLocaleText';
import { useGridPipeProcessing } from './pipeProcessing';
import { useGridStrategyProcessing } from './strategyProcessing';
import { useGridStateInitialization } from './useGridStateInitialization';
import { useGridProps } from './useGridProps';
/**
 * Initialize the technical pieces of the DataGrid (logger, state, ...) that any DataGrid implementation needs
 */
export const useGridInitialization = (privateApiRef, props) => {
    useGridRefs(privateApiRef);
    useGridProps(privateApiRef, props);
    useGridIsRtl(privateApiRef);
    useGridLoggerFactory(privateApiRef, props);
    useGridStateInitialization(privateApiRef);
    useGridPipeProcessing(privateApiRef);
    useGridStrategyProcessing(privateApiRef);
    useGridLocaleText(privateApiRef, props);
    privateApiRef.current.register('private', { rootProps: props });
};
