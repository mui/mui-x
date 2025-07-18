import { useTimeGridColumnPlaceholderContext } from '../column/TimeGridColumnPlaceholderContext';

export function useTimeGridColumnPlaceholder() {
  return useTimeGridColumnPlaceholderContext().placeholder;
}
