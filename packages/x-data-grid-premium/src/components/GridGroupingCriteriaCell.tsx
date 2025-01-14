import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import Box from '@mui/material/Box';
import {
  useGridSelector,
  gridFilteredDescendantCountLookupSelector,
  getDataGridUtilityClass,
  GridRenderCellParams,
  GridGroupNode,
} from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../models/dataGridPremiumProps';

type OwnerState = { classes: DataGridPremiumProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['groupingCriteriaCell'],
    toggle: ['groupingCriteriaCellToggle'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

interface GridGroupingCriteriaCellProps extends GridRenderCellParams<any, any, any, GridGroupNode> {
  hideDescendantCount?: boolean;
}

export function GridGroupingCriteriaCell(props: GridGroupingCriteriaCellProps) {
  const { id, field, rowNode, hideDescendantCount, formattedValue } = props;

  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const ownerState: OwnerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);
  const filteredDescendantCountLookup = useGridSelector(
    apiRef,
    gridFilteredDescendantCountLookupSelector,
  );
  const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0;

  const Icon = rowNode.childrenExpanded
    ? rootProps.slots.groupingCriteriaCollapseIcon
    : rootProps.slots.groupingCriteriaExpandIcon;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === ' ') {
      // We call event.stopPropagation to avoid unfolding the row and also scrolling to bottom
      // TODO: Remove and add a check inside useGridKeyboardNavigation
      event.stopPropagation();
    }
    apiRef.current.publishEvent('cellKeyDown', props, event);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
    apiRef.current.setCellFocus(id, field);
    event.stopPropagation();
  };

  let cellContent: React.ReactNode;

  const colDef = apiRef.current.getColumn(rowNode.groupingField!);
  if (typeof colDef.renderCell === 'function') {
    cellContent = colDef.renderCell(props);
  } else if (typeof formattedValue !== 'undefined') {
    cellContent = <span>{formattedValue}</span>;
  } else {
    cellContent = <span>{rowNode.groupingKey}</span>;
  }

  return (
    <Box
      className={classes.root}
      sx={[
        rootProps.rowGroupingColumnMode === 'multiple'
          ? {
              ml: 0,
            }
          : (theme) => ({
              ml: `calc(var(--DataGrid-cellOffsetMultiplier) * var(--depth) * ${theme.spacing(1)})`,
            }),
      ]}
      style={{ '--depth': rowNode.depth } as any}
    >
      <div className={classes.toggle}>
        {filteredDescendantCount > 0 && (
          <rootProps.slots.baseIconButton
            size="small"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            aria-label={
              rowNode.childrenExpanded
                ? apiRef.current.getLocaleText('treeDataCollapse')
                : apiRef.current.getLocaleText('treeDataExpand')
            }
            {...rootProps.slotProps?.baseIconButton}
          >
            <Icon fontSize="inherit" />
          </rootProps.slots.baseIconButton>
        )}
      </div>
      {cellContent}
      {!hideDescendantCount && filteredDescendantCount > 0 ? (
        <span style={{ whiteSpace: 'pre' }}> ({filteredDescendantCount})</span>
      ) : null}
    </Box>
  );
}
