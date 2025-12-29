import * as React from 'react';
import { useGridAriaAttributes as useGridAriaAttributesCommunity } from '@mui/x-data-grid/internals';
import { useGridRootProps } from './useGridRootProps';

export const useGridAriaAttributesPro = (): React.HTMLAttributes<HTMLElement> => {
  const ariaAttributesCommunity = useGridAriaAttributesCommunity();
  const { treeData } = useGridRootProps();

  const ariaAttributesPro = treeData ? { role: 'treegrid' } : {};

  return {
    ...ariaAttributesCommunity,
    ...ariaAttributesPro,
  };
};
