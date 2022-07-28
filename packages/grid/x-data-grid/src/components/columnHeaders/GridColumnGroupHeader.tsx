import * as React from 'react';
import { unstable_useId as useId } from '@mui/utils';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { GridAlignment } from '../../models/colDef/gridColDef';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { gridColumnGroupsLookupSelector } from '../../hooks/features/columnGrouping/gridColumnGroupsSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { GridGenericColumnHeaderItem } from './GridGenericColumnHeaderItem';

interface GridColumnGroupHeaderProps {
  groupId: string | null;
  width: number;
  fields: string[];
  colIndex: number; // TODO: use this prop to get accessible column group
  isLastColumn: boolean;
  extendRowFullWidth: boolean;
  depth: number;
  maxDepth: number;
  height: number;
}

type OwnerState = {
  showRightBorder: boolean;
  isDragging: boolean;
  headerAlign?: GridAlignment;
  classes?: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes, headerAlign, isDragging, showRightBorder } = ownerState;

  const slots = {
    root: [
      'columnHeader',
      headerAlign === 'left' && 'columnHeader--alignLeft',
      headerAlign === 'center' && 'columnHeader--alignCenter',
      headerAlign === 'right' && 'columnHeader--alignRight',
      isDragging && 'columnHeader--moving',
      showRightBorder && 'withBorder',
    ],
    draggableContainer: ['columnHeaderDraggableContainer'],
    titleContainer: ['columnHeaderTitleContainer'],
    titleContainerContent: ['columnHeaderTitleContainerContent'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridColumnGroupHeader(props: GridColumnGroupHeaderProps) {
  const {
    groupId,
    width,
    depth,
    maxDepth,
    fields,
    height,
    colIndex,
    isLastColumn,
    extendRowFullWidth,
  } = props;

  const rootProps = useGridRootProps();

  const apiRef = useGridApiContext();
  const columnGroupsLookup = useGridSelector(apiRef, gridColumnGroupsLookupSelector);
  const { hasScrollX, hasScrollY } = apiRef.current.getRootDimensions() ?? {
    hasScrollX: false,
    hasScrollY: false,
  };

  const {
    headerName = groupId ?? '',
    description = '',
    headerAlign = undefined,
  } = groupId ? columnGroupsLookup[groupId] : {};

  let headerComponent: React.ReactNode;

  const render = groupId && columnGroupsLookup[groupId]?.renderHeaderGroup;
  if (groupId && render) {
    headerComponent = render({
      groupId,
      headerName,
      description,
      depth,
      maxDepth,
      fields,
      colIndex,
      isLastColumn,
    });
  }

  const removeLastBorderRight = isLastColumn && hasScrollX && !hasScrollY;
  const showRightBorder = !isLastColumn
    ? rootProps.showColumnRightBorder
    : !removeLastBorderRight && !extendRowFullWidth;

  const ownerState = {
    ...props,
    classes: rootProps.classes,
    showRightBorder,
    headerAlign,
    depth,
    isDragging: false,
  };

  const label = headerName ?? groupId;

  const id = useId();
  const elementId = groupId === null ? `empty-group-cell-${id}` : groupId;
  const classes = useUtilityClasses(ownerState);

  return (
    <GridGenericColumnHeaderItem
      classes={classes}
      columnMenuOpen={false}
      colIndex={colIndex}
      height={height}
      isResizing={false}
      sortDirection={null}
      hasFocus={false}
      tabIndex={0}
      isDraggable={false}
      headerComponent={headerComponent}
      description={description}
      elementId={elementId}
      width={width}
      columnMenuIconButton={null}
      columnTitleIconButtons={null}
      resizable={false}
      label={label}
      aria-colspan={fields.length}
      data-fields={fields.join(' ')}
    />
  );
}

export { GridColumnGroupHeader };
