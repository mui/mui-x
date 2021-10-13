import * as React from 'react';
import clsx from 'clsx';
import { useForkRef } from '@mui/material/utils';
import NoSsr from '@mui/material/NoSsr';
import { GridRootContainerRef } from '../../models/gridRootContainerRef';
import { useStyles } from './GridRootStyles';
import { visibleGridColumnsLengthSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridClasses } from '../../gridClasses';
import { gridRowCountSelector } from '../../hooks/features/rows/gridRowsSelector';

export type GridRootProps = React.HTMLAttributes<HTMLDivElement>;

export const GridRoot = React.forwardRef<HTMLDivElement, GridRootProps>(function GridRoot(
  props,
  ref,
) {
  const stylesClasses = useStyles();
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const { children, className: classNameProp, ...other } = props;
  const visibleColumnsLength = useGridSelector(apiRef, visibleGridColumnsLengthSelector);
  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const rootContainerRef: GridRootContainerRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(rootContainerRef, ref);

  apiRef.current.rootElementRef = rootContainerRef;

  return (
    <NoSsr>
      <div
        ref={handleRef}
        className={clsx(
          stylesClasses.root,
          rootProps.classes?.root,
          rootProps.className,
          classNameProp,
          gridClasses.root,
          {
            [gridClasses.autoHeight]: rootProps.autoHeight,
          },
        )}
        role="grid"
        aria-colcount={visibleColumnsLength}
        aria-rowcount={totalRowCount}
        aria-multiselectable={!rootProps.disableMultipleSelection}
        aria-label={rootProps['aria-label']}
        aria-labelledby={rootProps['aria-labelledby']}
        style={rootProps.style}
        {...other}
      >
        {children}
      </div>
    </NoSsr>
  );
});
