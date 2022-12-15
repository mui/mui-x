import * as React from 'react';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export function GridFooterPlaceholder() {
  const rootProps = useGridRootProps();

  if (rootProps.hideFooter) {
    return null;
  }

  return <rootProps.components.Footer {...rootProps.componentsProps?.footer} />;
}
