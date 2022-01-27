import * as React from 'react';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export function GridHeaderPlaceholder() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const headerRef = React.useRef<HTMLDivElement>(null);
  apiRef.current.headerRef = headerRef;

  console.log(rootProps);

  return <div ref={headerRef}>TEST</div>;
}
