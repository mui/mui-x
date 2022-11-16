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

export const gridColumnMenuSimpleSlots = {
  ColumnMenuSortItem: { component: GridColumnMenuSortItemSimple, priority: 0 },
  ColumnMenuFilterItem: { component: GridColumnMenuFilterItemSimple, priority: 10 },
  ColumnMenuHideItem: { component: GridColumnMenuHideItemSimple, priority: 20 },
  ColumnMenuColumnsItem: { component: GridColumnMenuColumnsItemSimple, priority: 30 },
};

const GridColumnMenuSimple = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridColumnMenuSimpleRoot(props, ref) {
    const { slots = gridColumnMenuSimpleSlots, initialItems = [], ...other } = props;

    const apiRef = useGridPrivateApiContext();

    const orderedComponents = useGridColumnMenuPreProcessing(apiRef, {
      currentColumn: props.currentColumn,
      slots,
      initialItems,
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
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  initialItems: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.elementType.isRequired,
      priority: PropTypes.number.isRequired,
    }),
  ),
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
  slots: PropTypes.object,
} as any;

export { GridColumnMenuSimple };
