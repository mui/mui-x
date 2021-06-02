import * as React from 'react';
import { GridApiContext } from './components/GridApiContext';
import { GridPropsContext } from './context/GridPropsContext';

export function GridFooterPlaceholder() {
  const apiRef = React.useContext(GridApiContext)!;
  const props = React.useContext(GridPropsContext)!;
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
