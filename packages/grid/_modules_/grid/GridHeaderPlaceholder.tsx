import * as React from 'react';
import { GridApiContext } from './components/GridApiContext';
import { GridRootPropsContext } from './context/GridRootPropsContext';

export function GridHeaderPlaceholder() {
  const apiRef = React.useContext(GridApiContext)!;
  const props = React.useContext(GridRootPropsContext)!;
  const headerRef = React.useRef<HTMLDivElement>(null);
  apiRef.current.headerRef = headerRef;

  return (
    <div ref={headerRef}>
      <apiRef.current.components.Header {...props.componentsProps?.header} />
    </div>
  );
}
