import { useClockOptionList } from '../utils/useClockOptionList';
import { useUtils } from '../../../hooks/useUtils';

export function useClockSecondOptions(parameters: useClockSecondOptions.Parameters) {
  const utils = useUtils();

  return useClockOptionList({
    ...parameters,
    section: 'second',
    precision: 'second',
    step: parameters.step ?? 1,
    format: utils.formats.seconds,
  });
}

export namespace useClockSecondOptions {
  export interface Parameters extends useClockOptionList.PublicParameters {
    /**
     * The step in seconds between two consecutive items.
     * @default 1
     */
    step?: number;
  }
}
