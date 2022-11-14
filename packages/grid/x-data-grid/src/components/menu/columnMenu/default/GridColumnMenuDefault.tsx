import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import { GridColumnMenuDefaultContainer } from './GridColumnMenuDefaultContainer';
import { GridColumnMenuProps } from '../GridColumnMenuProps';
import { GridColumnMenuColumnsItem } from './GridColumnMenuColumnsItem';
import { GridColumnMenuFilterItem } from './GridColumnMenuFilterItem';
import { GridColumnMenuHideItem } from './GridColumnMenuHideItem';
import { GridColumnMenuSortItem } from './GridColumnMenuSortItem';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { GridColumnMenuValue, GridColumnMenuSlot } from '../../../../hooks/features/columnMenu';

export interface GridColumnMenuDefaultProps
  extends Pick<GridColumnMenuProps, 'hideMenu' | 'currentColumn' | 'open'> {}

export interface GridColumnMenuRootProps {
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
  HTMLUListElement,
  GridColumnMenuDefaultProps & GridColumnMenuRootProps
>(function GridColumnMenuDefault(props, ref) {
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
    <GridColumnMenuDefaultContainer ref={ref} {...other}>
      {orderedItems.map((item, index: number) => {
        if (!item) {
          return null;
        }
        return (
          <div key={index}>
            <item.component onClick={props.hideMenu} column={props.currentColumn} />
            {index !== orderedItems.length - 1 ? <Divider /> : null}
          </div>
        );
      })}
    </GridColumnMenuDefaultContainer>
  );
});

const GridColumnMenuDefault = React.forwardRef<HTMLUListElement, GridColumnMenuDefaultProps>(
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
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenuDefault };
