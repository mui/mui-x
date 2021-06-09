import * as React from 'react';
import { GridApiContext } from './components/GridApiContext';
import { GridRootPropsContext } from './context/GridRootPropsContext';

export function GridFooterPlaceholder() {
  const apiRef = React.useContext(GridApiContext)!;
  const props = React.useContext(GridRootPropsContext)!;
  const footerRef = React.useRef<HTMLDivElement>(null);
  apiRef.current.footerRef = footerRef;

  if (props.hideFooter) {
    return null;
  }

  return (
    <div ref={footerRef}>
      <apiRef.current.components.Footer {...props.componentsProps?.footer} />
    </div>
  );
}
