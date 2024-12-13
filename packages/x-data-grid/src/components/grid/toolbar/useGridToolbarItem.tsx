import * as React from 'react';
import useId from '@mui/utils/useId';
import { useGridToolbarRootContext } from './GridToolbarRootContext';

export function useGridToolbarItem(ref: React.RefObject<HTMLElement>) {
  const id = useId();
  const isInitialFocus = React.useRef(true);
  const { focusableItemId, registerItem, unregisterItem, onItemKeyDown } =
    useGridToolbarRootContext();

  React.useEffect(() => {
    registerItem(id!);
    return () => unregisterItem(id!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // Do not focus the item on initial render
    if (focusableItemId && isInitialFocus.current) {
      isInitialFocus.current = false;
      return;
    }

    if (focusableItemId === id) {
      ref.current?.focus();
    }
  }, [focusableItemId, id, ref]);

  return {
    tabIndex: focusableItemId === id ? 0 : -1,
    onKeyDown: onItemKeyDown,
  };
}
