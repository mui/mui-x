import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { GridColumnHeaderTitle } from './GridColumnHeaderTitle';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { gridColumnGroupsLookupSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';

interface GridColumnGroupHeaderProps {
  groupId: string | null;
  width: number;
  fields: string[];
  colIndex: number; // TODO: use this prop to get accessible column group
  isLastColumn: boolean;
  extendRowFullWidth: boolean;
  depth: number;
  maxDepth: number;
}

type OwnerState = GridColumnGroupHeaderProps & {
  showRightBorder: boolean;
  depth: number;
  maxDepth: number;
  classes?: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { groupId, classes, showRightBorder } = ownerState;

  const slots = {
    root: [
      'columnGroupHeader',
      showRightBorder && 'withBorder',
      groupId ? 'columnGroupHeader--withName' : 'columnGroupHeader--withoutName',
    ],
    titleContainer: ['columnGroupHeaderTitleContainer'],
    titleContainerContent: ['columnGroupHeaderTitleContainerContent'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridColumnGroupHeader(props: GridColumnGroupHeaderProps) {
  const { groupId, width, depth, maxDepth, fields, colIndex, isLastColumn, extendRowFullWidth } =
    props;

  const rootProps = useGridRootProps();

  const apiRef = useGridApiContext();
  const columnGroupsLookup = useGridSelector(apiRef, gridColumnGroupsLookupSelector);
  const { hasScrollX, hasScrollY } = apiRef.current.getRootDimensions() ?? {
    hasScrollX: false,
    hasScrollY: false,
  };

  const { headerName = groupId ?? '', description = '' } = groupId
    ? columnGroupsLookup[groupId]
    : {};

  let headerComponent: React.ReactNode = null;

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

  const headerCellRef = React.useRef<HTMLDivElement>(null);

  const removeLastBorderRight = isLastColumn && hasScrollX && !hasScrollY;
  const showRightBorder = !isLastColumn
    ? rootProps.showColumnRightBorder
    : !removeLastBorderRight && !extendRowFullWidth;

  const ownerState = {
    ...props,
    classes: rootProps.classes,
    showRightBorder,
    depth,
  };

  const classes = useUtilityClasses(ownerState);

  return (
    <div
      ref={headerCellRef}
      className={classes.root}
      role="columnheader"
      aria-colindex={colIndex + 1}
      aria-colspan={fields.length}
      data-fields={fields.join(' ')}
      data-col-index={colIndex}
      style={{
        width,
        minWidth: width,
        maxWidth: width,
      }}
    >
      <div className={classes.titleContainer}>
        <div className={classes.titleContainerContent}>
          {headerComponent || (
            <GridColumnHeaderTitle
              label={headerName || groupId || ''}
              description={description}
              columnWidth={width}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export { GridColumnGroupHeader };
