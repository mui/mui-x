import * as React from 'react';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export function GridFooterPlaceholder() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const footerRef = React.useRef<HTMLDivElement>(null);
  apiRef.current.footerRef = footerRef;

  if (rootProps.hideFooter) {
    return null;
  }

  return (
    <div ref={footerRef}>
      <rootProps.components.Footer {...rootProps.componentsProps?.footer} />
    </div>
  );
}
