import { useGridLogger } from './useGridLogger';
import { useGridEventPriority } from './useGridEvent';
export const useGridNativeEventListener = (apiRef, ref, eventName, handler, options) => {
    const logger = useGridLogger(apiRef, 'useNativeEventListener');
    useGridEventPriority(apiRef, 'rootMount', () => {
        const targetElement = ref();
        if (!targetElement || !eventName) {
            return undefined;
        }
        logger.debug(`Binding native ${eventName} event`);
        targetElement.addEventListener(eventName, handler, options);
        return () => {
            logger.debug(`Clearing native ${eventName} event`);
            targetElement.removeEventListener(eventName, handler, options);
        };
    });
};
