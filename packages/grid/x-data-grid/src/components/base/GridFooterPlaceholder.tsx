import * as React from 'react';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export function GridFooterPlaceholder() {
  const rootProps = useGridRootProps();

  if (rootProps.hideFooter) {
    return null;
  }

  return (
    <rootProps.slots.footer {...(rootProps.slotProps?.footer as any) /* FIXME: typing error */} />
  );
}
