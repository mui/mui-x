import * as React from 'react';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export function GridHeaderPlaceholder() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const headerRef = React.useRef<HTMLDivElement>(null);
  apiRef.current.headerRef = headerRef;

  return (
    <div ref={headerRef}>
      <apiRef.current.components.Header {...rootProps.componentsProps?.header} />
    </div>
  );
}
