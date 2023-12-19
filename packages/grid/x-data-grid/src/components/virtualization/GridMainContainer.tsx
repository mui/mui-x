import * as React from 'react';
import { styled } from '@mui/system';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridAriaAttributes } from '../../hooks/utils/useGridAriaAttributes';

const Element = styled('div')({
  flexGrow: 1,
  position: 'relative',
  overflow: 'hidden',
});

export const GridMainContainer = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{
    className: string;
  }>
>((props, ref) => {
  const rootProps = useGridRootProps();

  const getAriaAttributes = rootProps.experimentalFeatures?.ariaV7 // ariaV7 should never change
    ? useGridAriaAttributes
    : null;
  const ariaAttributes = typeof getAriaAttributes === 'function' ? getAriaAttributes() : null;

  return (
    <Element ref={ref} className={props.className} tabIndex={-1} {...ariaAttributes}>
      {props.children}
    </Element>
  );
});
