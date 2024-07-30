import * as React from 'react';
import { unstable_useId as useId, unstable_composeClasses as composeClasses } from '@mui/utils';
import { GridAlignment } from '../../models/colDef/gridColDef';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { gridColumnGroupsLookupSelector } from '../../hooks/features/columnGrouping/gridColumnGroupsSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { GridGenericColumnHeaderItem } from './GridGenericColumnHeaderItem';
import { GridColumnGroup } from '../../models/gridColumnGrouping';
import { GridColumnGroupHeaderEventLookup } from '../../models/events';
import { GridColumnGroupHeaderParams } from '../../models/params';
import { isEventTargetInPortal } from '../../utils/domUtils';
import { GridPinnedColumnPosition } from '../../hooks/features/columns/gridColumnsInterfaces';
import { shouldCellShowLeftBorder, shouldCellShowRightBorder } from '../../utils/cellBorderUtils';

interface GridColumnGroupHeaderProps {
  groupId: string | null;
  width: number;
  fields: string[];
  colIndex: number; // TODO: use this prop to get accessible column group
  isLastColumn: boolean;
  depth: number;
  maxDepth: number;
  height: number;
  hasFocus?: boolean;
  tabIndex: 0 | -1;
  pinnedPosition?: GridPinnedColumnPosition;
  style?: React.CSSProperties;
  indexInSection: number;
  sectionLength: number;
  gridHasFiller: boolean;
}

type OwnerState = {
  groupId: GridColumnGroupHeaderProps['groupId'];
  showLeftBorder: boolean;
  showRightBorder: boolean;
  isDragging: boolean;
  isLastColumn: boolean;
  headerAlign?: GridAlignment;
  classes?: DataGridProcessedProps['classes'];
  pinnedPosition?: GridPinnedColumnPosition;
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const {
    classes,
    headerAlign,
    isDragging,
    isLastColumn,
    showLeftBorder,
    showRightBorder,
    groupId,
    pinnedPosition,
  } = ownerState;

  const slots = {
    root: [
      'columnHeader',
      headerAlign === 'left' && 'columnHeader--alignLeft',
      headerAlign === 'center' && 'columnHeader--alignCenter',
      headerAlign === 'right' && 'columnHeader--alignRight',
      isDragging && 'columnHeader--moving',
      showRightBorder && 'columnHeader--withRightBorder',
      showLeftBorder && 'columnHeader--withLeftBorder',
      'withBorderColor',
      groupId === null ? 'columnHeader--emptyGroup' : 'columnHeader--filledGroup',
      pinnedPosition === 'left' && 'columnHeader--pinnedLeft',
      pinnedPosition === 'right' && 'columnHeader--pinnedRight',
      isLastColumn && 'columnHeader--last',
    ],
    draggableContainer: ['columnHeaderDraggableContainer'],
    titleContainer: ['columnHeaderTitleContainer', 'withBorderColor'],
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
    hasFocus,
    tabIndex,
    isLastColumn,
    pinnedPosition,
    style,
    indexInSection,
    sectionLength,
    gridHasFiller,
  } = props;

  const rootProps = useGridRootProps();

  const headerCellRef = React.useRef<HTMLDivElement>(null);
  const apiRef = useGridApiContext();
  const columnGroupsLookup = useGridSelector(apiRef, gridColumnGroupsLookupSelector);

  const group: Partial<GridColumnGroup> = groupId ? columnGroupsLookup[groupId] : {};

  const { headerName = groupId ?? '', description = '', headerAlign = undefined } = group;

  let headerComponent: React.ReactNode;

  const render = groupId && columnGroupsLookup[groupId]?.renderHeaderGroup;
  const renderParams: GridColumnGroupHeaderParams = React.useMemo(
    () => ({
      groupId,
      headerName,
      description,
      depth,
      maxDepth,
      fields,
      colIndex,
      isLastColumn,
    }),
    [groupId, headerName, description, depth, maxDepth, fields, colIndex, isLastColumn],
  );
  if (groupId && render) {
    headerComponent = render(renderParams);
  }

  const showLeftBorder = shouldCellShowLeftBorder(pinnedPosition, indexInSection);
  const showRightBorder = shouldCellShowRightBorder(
    pinnedPosition,
    indexInSection,
    sectionLength,
    rootProps.showCellVerticalBorder,
    gridHasFiller,
  );

  const ownerState = {
    ...props,
    classes: rootProps.classes,
    showLeftBorder,
    showRightBorder,
    headerAlign,
    depth,
    isDragging: false,
  };

  const label = headerName ?? groupId;

  const id = useId();
  const elementId = groupId === null ? `empty-group-cell-${id}` : groupId;
  const classes = useUtilityClasses(ownerState);

  React.useLayoutEffect(() => {
    if (hasFocus) {
      const focusableElement = headerCellRef.current!.querySelector<HTMLElement>('[tabindex="0"]');
      const elementToFocus = focusableElement || headerCellRef.current;
      elementToFocus?.focus();
    }
  }, [apiRef, hasFocus]);

  const publish = React.useCallback(
    (eventName: keyof GridColumnGroupHeaderEventLookup) => (event: React.SyntheticEvent) => {
      // Ignore portal
      // See https://github.com/mui/mui-x/issues/1721
      if (isEventTargetInPortal(event)) {
        return;
      }
      apiRef.current.publishEvent(eventName, renderParams, event as any);
    },
    // For now this is stupid, because renderParams change all the time.
    // Need to move it's computation in the api, such that for a given depth+columnField, I can get the group parameters
    [apiRef, renderParams],
  );

  const mouseEventsHandlers = React.useMemo(
    () => ({
      onKeyDown: publish('columnGroupHeaderKeyDown'),
      onFocus: publish('columnGroupHeaderFocus'),
      onBlur: publish('columnGroupHeaderBlur'),
    }),
    [publish],
  );

  const headerClassName =
    typeof group.headerClassName === 'function'
      ? group.headerClassName(renderParams)
      : group.headerClassName;

  return (
    <GridGenericColumnHeaderItem
      ref={headerCellRef}
      classes={classes}
      columnMenuOpen={false}
      colIndex={colIndex}
      height={height}
      isResizing={false}
      sortDirection={null}
      hasFocus={false}
      tabIndex={tabIndex}
      isDraggable={false}
      headerComponent={headerComponent}
      headerClassName={headerClassName}
      description={description}
      elementId={elementId}
      width={width}
      columnMenuIconButton={null}
      columnTitleIconButtons={null}
      resizable={false}
      label={label}
      aria-colspan={fields.length}
      // The fields are wrapped between |-...-| to avoid confusion between fields "id" and "id2" when using selector data-fields~=
      data-fields={`|-${fields.join('-|-')}-|`}
      style={style}
      {...mouseEventsHandlers}
    />
  );
}

export { GridColumnGroupHeader };
