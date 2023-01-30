import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { GridStateColDef } from '../../models/colDef/gridColDef';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridGenericColumnHeaderFilterItem } from './GridGenericColumnHeaderFilterItem';

interface GridColumnHeaderItemProps {
  colIndex: number;
  colDef: GridStateColDef;
  headerHeight: number;
  hasFocus?: boolean;
  tabIndex: 0 | -1;
}

type OwnerState = GridColumnHeaderItemProps & {
  showRightBorder: boolean;
  classes?: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { colDef, classes, showRightBorder } = ownerState;

  const slots = {
    root: [
      'columnHeader',
      colDef.headerAlign === 'left' && 'columnHeader--alignLeft',
      colDef.headerAlign === 'center' && 'columnHeader--alignCenter',
      colDef.headerAlign === 'right' && 'columnHeader--alignRight',
      'withBorderColor',
      showRightBorder && 'columnHeader--withRightBorder',
    ],
    titleContainer: ['columnHeaderTitleContainer'],
    titleContainerContent: ['columnHeaderTitleContainerContent'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridColumnHeaderFilterItem(props: GridColumnHeaderItemProps) {
  const { colDef, colIndex, headerHeight, hasFocus, tabIndex } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();

  let headerFilterComponent: React.ReactNode;
  if (colDef.renderHeaderFilter) {
    headerFilterComponent = colDef.renderHeaderFilter(
      apiRef.current.getColumnHeaderParams(colDef.field),
    );
  }

  const ownerState = {
    ...props,
    classes: rootProps.classes,
    showRightBorder: rootProps.showColumnVerticalBorder,
  };

  const classes = useUtilityClasses(ownerState);

  const headerClassName =
    typeof colDef.headerClassName === 'function'
      ? colDef.headerClassName({ field: colDef.field, colDef })
      : colDef.headerClassName;

  const label = colDef.headerName ?? colDef.field;

  return (
    <GridGenericColumnHeaderFilterItem
      classes={classes}
      colIndex={colIndex}
      height={headerHeight}
      hasFocus={hasFocus}
      tabIndex={tabIndex}
      colType={colDef.type!}
      field={colDef.field}
      headerFilterComponent={headerFilterComponent}
      description={colDef.description}
      width={colDef.computedWidth}
      headerClassName={headerClassName}
      label={label}
      data-field={colDef.field}
    />
  );
}

GridColumnHeaderFilterItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  colIndex: PropTypes.number.isRequired,
  columnMenuOpen: PropTypes.bool.isRequired,
  disableReorder: PropTypes.bool,
  filterItemsCounter: PropTypes.number,
  hasFocus: PropTypes.bool,
  headerHeight: PropTypes.number.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isResizing: PropTypes.bool.isRequired,
  separatorSide: PropTypes.oneOf(['left', 'right']),
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  sortIndex: PropTypes.number,
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
} as any;

export { GridColumnHeaderFilterItem };
