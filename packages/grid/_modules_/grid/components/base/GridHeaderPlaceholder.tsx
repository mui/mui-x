import * as React from 'react';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

export function GridHeaderPlaceholder() {
  const apiRef = useGridApiContext();
  const headerRef = React.useRef<HTMLDivElement>(null);
  apiRef.current.headerRef = headerRef;

  return <div ref={headerRef}>TEST</div>;
}
