import * as React from 'react';
import { styled } from '@mui/system';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridAriaAttributes } from '../../hooks/utils/useGridAriaAttributes';
import { gridClasses } from '../../constants/gridClasses';

const Element = styled('div')({
  flexGrow: 1,
  position: 'relative',
  overflow: 'hidden',
});

export const GridMainContainer = React.forwardRef<HTMLDivElement, React.PropsWithChildren<{}>>(
  (props, ref) => {
    const rootProps = useGridRootProps();

    const getAriaAttributes = rootProps.experimentalFeatures?.ariaV7 // ariaV7 should never change
      ? useGridAriaAttributes
      : null;
    const ariaAttributes = typeof getAriaAttributes === 'function' ? getAriaAttributes() : null;

    return (
      <Element ref={ref} className={gridClasses.main} {...ariaAttributes}>
        {props.children}
      </Element>
    );
  },
);
