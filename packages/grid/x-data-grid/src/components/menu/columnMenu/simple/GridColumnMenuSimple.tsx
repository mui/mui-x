import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridPrivateApiContext } from '../../../../hooks/utils/useGridPrivateApiContext';
import { useGridColumnMenuPreProcessing } from '../../../../hooks/features/columnMenu/useGridColumnMenuPreProcessing';
import { GridColumnMenuSimpleContainer } from './GridColumnMenuSimpleContainer';
import { GridColumnMenuColumnsItemSimple } from './GridColumnMenuColumnsItemSimple';
import { GridColumnMenuFilterItemSimple } from './GridColumnMenuFilterItemSimple';
import { GridColumnMenuHideItemSimple } from './GridColumnMenuHideItemSimple';
import { GridColumnMenuSortItemSimple } from './GridColumnMenuSortItemSimple';
import { GridColumnMenuProps } from '../GridColumnMenuProps';

export const COLUMN_MENU_SIMPLE_SLOTS = {
  ColumnMenuSortItem: GridColumnMenuSortItemSimple,
  ColumnMenuFilterItem: GridColumnMenuFilterItemSimple,
  ColumnMenuHideItem: GridColumnMenuHideItemSimple,
  ColumnMenuColumnsItem: GridColumnMenuColumnsItemSimple,
};

export const COLUMN_MENU_SIMPLE_SLOTS_PROPS = {
  ColumnMenuSortItem: { displayOrder: 0 },
  ColumnMenuFilterItem: { displayOrder: 10 },
  ColumnMenuHideItem: { displayOrder: 20 },
  ColumnMenuColumnsItem: { displayOrder: 30 },
};

const GridColumnMenuSimple = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridColumnMenuSimpleRoot(props, ref) {
    const {
      defaultSlots = COLUMN_MENU_SIMPLE_SLOTS,
      defaultSlotsProps = COLUMN_MENU_SIMPLE_SLOTS_PROPS,
      ...other
    } = props;

    const apiRef = useGridPrivateApiContext();

    const orderedComponents = useGridColumnMenuPreProcessing(apiRef, {
      ...other,
      defaultSlots,
      defaultSlotsProps,
    });

    return (
      <GridColumnMenuSimpleContainer ref={ref} {...other}>
        {orderedComponents.map((Component, index) => (
          <Component key={index} onClick={props.hideMenu} column={props.currentColumn} />
        ))}
      </GridColumnMenuSimpleContainer>
    );
  },
);

GridColumnMenuSimple.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  currentColumn: PropTypes.object.isRequired,
  /**
   * Initial `slots` - it is internal, to be overrriden by Pro or Premium packages
   * @ignore - do not document.
   */
  defaultSlots: PropTypes.object,
  /**
   * Initial `slotsProps` - it is internal, to be overrriden by Pro or Premium packages
   * @ignore - do not document.
   */
  defaultSlotsProps: PropTypes.object,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
  /**
   * `slots` could be used to override default column menu slots
   */
  slots: PropTypes.object,
  /**
   * Could be used to override props specific to a column menu slot
   * e.g. `displayOrder`
   */
  slotsProps: PropTypes.object,
} as any;

export { GridColumnMenuSimple };
