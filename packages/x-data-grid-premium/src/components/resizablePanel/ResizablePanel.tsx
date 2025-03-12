import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import { DataGridProcessedProps } from '@mui/x-data-grid/internals';
import { getDataGridUtilityClass, useGridRootProps } from '@mui/x-data-grid';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { ResizablePanelContext } from './ResizablePanelContext';

export type ResizablePanelProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * The direction to resize the panel.
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical';
};

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['resizablePanel'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const ResizablePanelRoot = styled('div', {
  name: 'DataGrid',
  slot: 'ResizablePanel',
})<{ ownerState: OwnerState }>({
  position: 'relative',
});

function ResizablePanel(props: ResizablePanelProps) {
  const { className, children, direction = 'horizontal', ...other } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const ref = React.useRef<HTMLDivElement>(null);

  const contextValue = React.useMemo(() => ({ rootRef: ref, direction }), [direction]);

  return (
    <ResizablePanelContext.Provider value={contextValue}>
      <ResizablePanelRoot
        className={clsx(classes.root, className)}
        ownerState={rootProps}
        {...other}
        ref={ref}
      >
        {children}
      </ResizablePanelRoot>
    </ResizablePanelContext.Provider>
  );
}

export { ResizablePanel };
