import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import { GridColumnMenuContainer } from './GridColumnMenuContainer';
import { GridColumnMenuProps } from '../GridColumnMenuProps';
import { GridColumnMenuColumnsItem } from './GridColumnMenuColumnsItem';
import { GridColumnMenuFilterItem } from './GridColumnMenuFilterItem';
import { GridColumnMenuHideItem } from './GridColumnMenuHideItem';
import { GridColumnMenuSortItem } from './GridColumnMenuSortItem';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { GridColumnMenuValue, GridColumnMenuSlot } from '../../../../hooks/features/columnMenu';

export interface GridColumnMenuDefaultProps
  extends Pick<GridColumnMenuProps, 'hideMenu' | 'currentColumn' | 'open'> {
  initialItems: GridColumnMenuValue;
  slots: { [key: string]: GridColumnMenuSlot };
}

// TODO: Future enhancement: Replace with `rootProps.components.{x}`
export const gridColumnMenuSlots = {
  ColumnMenuSortItem: { component: GridColumnMenuSortItem, priority: 0 },
  ColumnMenuFilterItem: { component: GridColumnMenuFilterItem, priority: 10 },
  ColumnMenuHideItem: { component: GridColumnMenuHideItem, priority: 20 },
  ColumnMenuColumnsItem: { component: GridColumnMenuColumnsItem, priority: 30 },
};

// Nice to have TODO: Inject these values from respected hooks where possible
export const gridColumnMenuInitItems = [
  gridColumnMenuSlots.ColumnMenuSortItem,
  gridColumnMenuSlots.ColumnMenuFilterItem,
  gridColumnMenuSlots.ColumnMenuHideItem,
  gridColumnMenuSlots.ColumnMenuColumnsItem,
];

export const GridColumnMenuDefaultRoot = React.forwardRef<
  HTMLDivElement,
  GridColumnMenuDefaultProps
>(function GridColumnMenuDefault(props, ref) {
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
    <GridColumnMenuContainer ref={ref} {...props}>
      {orderedItems.map((item, index: number) => {
        if (!item) {
          return null;
        }
        return (
          <React.Fragment key={index}>
            <item.component {...itemProps} />
            {index !== orderedItems.length - 1 ? <Divider /> : null}
          </React.Fragment>
        );
      })}
    </GridColumnMenuContainer>
  );
});

const GridColumnMenuDefault = React.forwardRef<HTMLDivElement, GridColumnMenuDefaultProps>(
  function GridColumnMenuSimple(props, ref) {
    return (
      <GridColumnMenuDefaultRoot
        ref={ref}
        {...props}
        initialItems={gridColumnMenuInitItems}
        slots={gridColumnMenuSlots}
      />
    );
  },
);

GridColumnMenuDefault.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  currentColumn: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  initialItems: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.elementType.isRequired,
      priority: PropTypes.number.isRequired,
    }),
  ).isRequired,
  open: PropTypes.bool.isRequired,
  slots: PropTypes.object.isRequired,
} as any;

export { GridColumnMenuDefault };
