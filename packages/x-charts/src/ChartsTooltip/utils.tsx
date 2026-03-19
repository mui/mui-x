import useMediaQuery from '@mui/material/useMediaQuery';

type MousePosition = {
  x: number;
  y: number;
  pointerType: 'mouse' | 'touch' | 'pen';
  height: number;
};

export type UseMouseTrackerReturnValue = null | MousePosition;

export type TriggerOptions = 'item' | 'axis' | 'none';

export function utcFormatter(v: string | number | Date): string {
  if (v instanceof Date) {
    return v.toUTCString();
  }
  return v.toLocaleString();
}

// Taken from @mui/x-date-time-pickers
const mainPointerFineMediaQuery = '@media (pointer: fine)';

/**
 * Returns true if the main pointer is fine (e.g. mouse).
 * This is useful for determining how to position tooltips or other UI elements based on the type of input device.
 * @returns true if the main pointer is fine, false otherwise.
 */
export const useIsFineMainPointer = (): boolean => {
  return useMediaQuery(mainPointerFineMediaQuery, { defaultMatches: true });
};
