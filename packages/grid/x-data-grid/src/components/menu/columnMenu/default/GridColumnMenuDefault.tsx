import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import { useGridColumnMenuPreProcessing } from '../../../../hooks/features/columnMenu/useGridColumnMenuPreProcessing';
import { GridColumnMenuDefaultContainer } from './GridColumnMenuDefaultContainer';
import { GridColumnMenuProps } from '../GridColumnMenuProps';
import { GridColumnMenuColumnsItem } from './GridColumnMenuColumnsItem';
import { GridColumnMenuFilterItem } from './GridColumnMenuFilterItem';
import { GridColumnMenuHideItem } from './GridColumnMenuHideItem';
import { GridColumnMenuSortItem } from './GridColumnMenuSortItem';
import { useGridPrivateApiContext } from '../../../../hooks/utils/useGridPrivateApiContext';

export const COLUMN_MENU_DEFAULT_SLOTS = {
  ColumnMenuSortItem: GridColumnMenuSortItem,
  ColumnMenuFilterItem: GridColumnMenuFilterItem,
  ColumnMenuHideItem: GridColumnMenuHideItem,
  ColumnMenuColumnsItem: GridColumnMenuColumnsItem,
};

export const COLUMN_MENU_DEFAULT_SLOTS_PROPS = {
  ColumnMenuSortItem: { displayOrder: 0 },
  ColumnMenuFilterItem: { displayOrder: 10 },
  ColumnMenuHideItem: { displayOrder: 20 },
  ColumnMenuColumnsItem: { displayOrder: 30 },
};

const GridColumnMenuDefault = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridColumnMenuDefault(props, ref) {
    const {
      defaultSlots = COLUMN_MENU_DEFAULT_SLOTS,
      defaultSlotsProps = COLUMN_MENU_DEFAULT_SLOTS_PROPS,
      ...other
    } = props;
    const apiRef = useGridPrivateApiContext();

    const orderedComponents = useGridColumnMenuPreProcessing(apiRef, {
      ...other,
      defaultSlots,
      defaultSlotsProps,
    });

    return (
      <GridColumnMenuDefaultContainer ref={ref} {...other}>
        {orderedComponents.map((Component, index: number) => (
          <div key={index}>
            <Component onClick={props.hideMenu} column={props.currentColumn} />
            {index !== orderedComponents.length - 1 ? <Divider /> : null}
          </div>
        ))}
      </GridColumnMenuDefaultContainer>
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
  id: PropTypes.string,
  initialItems: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.elementType.isRequired,
      displayOrder: PropTypes.number.isRequired,
    }),
  ),
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
  slots: PropTypes.object,
} as any;

export { GridColumnMenuDefault };
