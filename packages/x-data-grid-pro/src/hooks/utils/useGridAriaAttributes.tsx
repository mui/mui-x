import * as React from 'react';
import { useGridAriaAttributes as useGridAriaAttributesCommunity } from '@mui/x-data-grid/internals';
import { useGridRootProps } from './useGridRootProps';

export const useGridAriaAttributes = (): React.HTMLAttributes<HTMLElement> => {
  const ariaAttributesCommunity = useGridAriaAttributesCommunity();
  const rootProps = useGridRootProps();

  const ariaAttributesPro = rootProps.treeData ? { role: 'treegrid' } : {};

  return {
    ...ariaAttributesCommunity,
    ...ariaAttributesPro,
  };
};
