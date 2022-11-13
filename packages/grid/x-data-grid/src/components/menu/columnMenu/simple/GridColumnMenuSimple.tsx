import * as React from 'react';
import PropTypes from 'prop-types';
import { GridColumnMenuSimpleContainer } from './GridColumnMenuSimpleContainer';
import { GridColumnMenuProps } from '../GridColumnMenuProps';
import { GridColumnMenuColumnsItemSimple } from './GridColumnMenuColumnsItemSimple';
import { GridColumnMenuFilterItemSimple } from './GridColumnMenuFilterItemSimple';
import { GridColumnMenuHideItemSimple } from './GridColumnMenuHideItemSimple';
import { GridColumnMenuSortItemSimple } from './GridColumnMenuSortItemSimple';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { GridColumnMenuValue, GridColumnMenuSlot } from '../../../../hooks/features/columnMenu';

// TODO Remove
interface GridColumnMenuDefaultProps
  extends Pick<GridColumnMenuProps, 'hideMenu' | 'currentColumn' | 'open'> {
  initialItems: GridColumnMenuValue;
  slots: { [key: string]: GridColumnMenuSlot };
}

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
  GridColumnMenuDefaultProps
>(function GridColumnMenuSimpleRoot(props: GridColumnMenuDefaultProps, ref) {
  const apiRef = useGridApiContext();
  const itemProps = {
    onClick: props.hideMenu,
    column: props.currentColumn,
  };

  const preProcessedItems = apiRef.current.unstable_applyPipeProcessors(
    'columnMenu',
    props.initialItems,
    {
      column: props.currentColumn,
      slots: props.slots,
    },
  );

  const orderedItems = React.useMemo(
    () => preProcessedItems.sort((a, b) => a.priority - b.priority),
    [preProcessedItems],
  );

  return (
    <GridColumnMenuSimpleContainer ref={ref} {...props}>
      {orderedItems.map((item, index) => {
        if (!item) {
          return null;
        }
        return <item.component key={index} {...itemProps} />;
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
