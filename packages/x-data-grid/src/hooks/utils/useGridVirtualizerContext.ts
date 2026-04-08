import { useGridPrivateApiContext } from './useGridPrivateApiContext';

export function useGridVirtualizerContext() {
  const apiRef = useGridPrivateApiContext();
  return apiRef.current.virtualizer;
}
