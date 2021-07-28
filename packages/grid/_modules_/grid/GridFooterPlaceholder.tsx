import * as React from 'react';
import { useGridApiContext } from './hooks/root/useGridApiContext';
import { useGridRootProps } from './hooks/utils/useGridRootProps';

export function GridFooterPlaceholder() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const footerRef = React.useRef<HTMLDivElement>(null);
  apiRef.current.footerRef = footerRef;

  if (props.hideFooter) {
    return null;
  }

  return (
    <div ref={footerRef}>
      <apiRef.current.components.Footer {...rootProps.componentsProps?.footer} />
    </div>
  );
}
