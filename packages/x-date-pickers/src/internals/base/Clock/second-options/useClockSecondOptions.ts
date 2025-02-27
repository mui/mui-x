import { useClockOptionList } from '../utils/useClockOptionList';
import { useUtils } from '../../../hooks/useUtils';

export function useClockSecondOptions(parameters: useClockSecondOptions.Parameters) {
  const { children, getItems, step = 1 } = parameters;
  const utils = useUtils();

  return useClockOptionList({
    section: 'second',
    precision: 'second',
    children,
    getItems,
    step,
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
