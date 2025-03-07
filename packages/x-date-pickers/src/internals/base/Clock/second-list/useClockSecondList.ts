import { useClockList } from '../utils/useClockList';
import { useUtils } from '../../../hooks/useUtils';

export function useClockSecondList(parameters: useClockSecondList.Parameters) {
  const utils = useUtils();

  return useClockList({
    ...parameters,
    section: 'second',
    precision: 'second',
    step: parameters.step ?? 1,
    format: utils.formats.seconds,
  });
}

export namespace useClockSecondList {
  export interface Parameters extends useClockList.PublicParameters {
    /**
     * The step in seconds between two consecutive items.
     * @default 1
     */
    step?: number;
  }
}
