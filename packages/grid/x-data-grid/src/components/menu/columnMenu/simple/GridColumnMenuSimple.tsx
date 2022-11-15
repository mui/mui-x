import * as React from 'react';
import PropTypes from 'prop-types';
import { GridColumnMenuSimpleContainer } from './GridColumnMenuSimpleContainer';
import { GridColumnMenuColumnsItemSimple } from './GridColumnMenuColumnsItemSimple';
import { GridColumnMenuFilterItemSimple } from './GridColumnMenuFilterItemSimple';
import { GridColumnMenuHideItemSimple } from './GridColumnMenuHideItemSimple';
import { GridColumnMenuSortItemSimple } from './GridColumnMenuSortItemSimple';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import {
  GridColumnMenuDefaultProps,
  GridColumnMenuRootProps,
} from '../default/GridColumnMenuDefault';

export const gridColumnMenuSimpleSlots = {
  ColumnMenuSortItem: { component: GridColumnMenuSortItemSimple, priority: 0 },
  ColumnMenuFilterItem: { component: GridColumnMenuFilterItemSimple, priority: 10 },
  ColumnMenuHideItem: { component: GridColumnMenuHideItemSimple, priority: 20 },
  ColumnMenuColumnsItem: { component: GridColumnMenuColumnsItemSimple, priority: 30 },
};

export const gridColumnMenuSimpleInitItems = [
  gridColumnMenuSimpleSlots.ColumnMenuSortItem,
  gridColumnMenuSimpleSlots.ColumnMenuFilterItem,
  gridColumnMenuSimpleSlots.ColumnMenuHideItem,
  gridColumnMenuSimpleSlots.ColumnMenuColumnsItem,
];

export const GridColumnMenuSimpleRoot = React.forwardRef<
  HTMLUListElement,
  GridColumnMenuDefaultProps & GridColumnMenuRootProps
>(function GridColumnMenuSimpleRoot(props, ref) {
  const { initialItems, slots, ...other } = props;
  const apiRef = useGridApiContext();

  const preProcessedItems = apiRef.current.unstable_applyPipeProcessors(
    'columnMenu',
    initialItems,
    {
      column: props.currentColumn,
      slots,
    },
  );

  const orderedItems = React.useMemo(
    () => preProcessedItems.sort((a, b) => a.priority - b.priority),
    [preProcessedItems],
  );

  return (
    <GridColumnMenuSimpleContainer ref={ref} {...other}>
      {orderedItems.map((item, index) => {
        if (!item) {
          return null;
        }
        return <item.component key={index} onClick={props.hideMenu} column={props.currentColumn} />;
      })}
    </GridColumnMenuSimpleContainer>
  );
});

const GridColumnMenuSimple = React.forwardRef<HTMLUListElement, GridColumnMenuDefaultProps>(
  function GridColumnMenuSimple(props: GridColumnMenuDefaultProps, ref) {
    return (
      <GridColumnMenuSimpleRoot
        ref={ref}
        {...props}
        initialItems={gridColumnMenuSimpleInitItems}
        slots={gridColumnMenuSimpleSlots}
      />
    );
  },
);

GridColumnMenuSimple.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  currentColumn: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenuSimple };
