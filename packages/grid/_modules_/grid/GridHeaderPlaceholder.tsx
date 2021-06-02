import * as React from 'react';
import { GridApiContext } from './components/GridApiContext';
import { GridPropsContext } from './context/GridPropsContext';

export function GridHeaderPlaceholder() {
  const apiRef = React.useContext(GridApiContext)!;
  const props = React.useContext(GridPropsContext)!;
  const headerRef = React.useRef<HTMLDivElement>(null);
  apiRef.current.headerRef = headerRef;

  return (
    <div ref={headerRef}>
      <apiRef.current.components.Header {...props.componentsProps?.header} />
    </div>
  );
}
