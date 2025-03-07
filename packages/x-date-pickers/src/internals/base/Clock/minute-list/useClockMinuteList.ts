import { useClockList } from '../utils/useClockList';
import { useUtils } from '../../../hooks/useUtils';

export function useClockMinuteList(parameters: useClockMinuteList.Parameters) {
  const utils = useUtils();

  return useClockList({
    ...parameters,
    section: 'minute',
    precision: 'minute',
    step: parameters.step ?? 1,
    format: utils.formats.minutes,
  });
}

export namespace useClockMinuteList {
  export interface Parameters extends useClockList.PublicParameters {
    /**
     * The step in minutes between two consecutive items.
     * @default 1
     */
    step?: number;
  }
}
