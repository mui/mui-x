import * as React from 'react';
import { styled } from '@mui/system';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

type Position = 'vertical' | 'horizontal';
type OwnerState = DataGridProcessedProps;
type GridVirtualScrollbarProps = { position: Position };

const useUtilityClasses = (ownerState: OwnerState, position: Position) => {
  const { classes } = ownerState;

  const slots = {
    root: ['scrollbar', `scrollbar--${position}`],
    content: ['scrollbarContent'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const Scrollbar = styled('div')({
  position: 'absolute',
  display: 'inline-block',
  zIndex: 6,
  '& > div': {
    display: 'inline-block',
  },
});
const ScrollbarVertical = styled(Scrollbar)({
  width: 'var(--DataGrid-scrollbarSize)',
  height: 'calc(100% - var(--DataGrid-headersTotalHeight))',
  overflowY: 'scroll',
  overflowX: 'hidden',
  '& > div': {
    width: 'var(--DataGrid-scrollbarSize)',
  },
  top: 'var(--DataGrid-headersTotalHeight)',
  right: '0px',
});
const ScrollbarHorizontal = styled(Scrollbar)({
  width: '100%',
  height: 'var(--DataGrid-scrollbarSize)',
  overflowY: 'hidden',
  overflowX: 'scroll',
  '& > div': {
    height: 'var(--DataGrid-scrollbarSize)',
  },
  bottom: '0px',
});

const GridVirtualScrollbar = React.forwardRef<HTMLDivElement, GridVirtualScrollbarProps>(
  function GridVirtualScrollbar(props, ref) {
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps, props.position);

    const Element = props.position === 'vertical' ? ScrollbarVertical : ScrollbarHorizontal;

    return (
      <Element ref={ref} className={classes.root}>
        <div className={classes.content} />
      </Element>
    );
  },
);

export { GridVirtualScrollbar };
