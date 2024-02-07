import * as React from 'react';
import { styled } from '@mui/system';
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
  const ariaAttributes = useGridAriaAttributes();

  return (
    <Element ref={ref} className={props.className} tabIndex={-1} {...ariaAttributes}>
      {props.children}
    </Element>
  );
});
