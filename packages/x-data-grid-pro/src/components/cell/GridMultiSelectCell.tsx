'use client';
import * as React from 'react';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import type {
  GridRenderCellParams,
  GridMultiSelectColDef,
  ValueOptions,
  GridSlotProps,
} from '@mui/x-data-grid';
import type { GridAggregationCellMeta } from '@mui/x-data-grid/internals';
import {
  getDataGridUtilityClass,
  useGridRootProps,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import {
  gridRowHeightSelector,
  gridFilterModelSelector,
  GridFooterCell,
  NotRendered,
  vars,
  isMultiSelectColDef,
  getValueOptions,
} from '@mui/x-data-grid/internals';
import type { DataGridProProcessedProps } from '../../models/dataGridProProps';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { GridMultiSelectChips } from './GridMultiSelectChips';

type OwnerState = DataGridProProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['multiSelectCell'],
    chip: ['multiSelectCellChip'],
    chipHidden: ['multiSelectCellChip--hidden'],
    overflow: ['multiSelectCellOverflow'],
    popup: ['multiSelectCellPopup'],
    popperContent: ['multiSelectCellPopperContent'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridMultiSelectCellPopperContent = styled('div', {
  name: 'MuiDataGrid',
  slot: 'MultiSelectCellPopperContent',
})(({ theme }) => ({
  ...theme.typography.body2,
  letterSpacing: 'normal',
  padding: theme.spacing(1),
  maxHeight: 52 * 4,
  overflow: 'auto',
  width: 'var(--_width)',
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  boxSizing: 'border-box',
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
}));

const GridMultiSelectCellPopper = styled(NotRendered<GridSlotProps['basePopper']>, {
  name: 'MuiDataGrid',
  slot: 'MultiSelectCellPopper',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  zIndex: vars.zIndex.menu,
  background: (theme.vars || theme).palette.background.paper,
  '&[data-popper-reference-hidden]': {
    visibility: 'hidden',
    pointerEvents: 'none',
  },
}));

export interface GridMultiSelectCellProps<
  V extends ValueOptions = ValueOptions,
> extends GridRenderCellParams {
  /**
   * Props passed to internal components.
   */
  slotProps?: {
    /**
     * Props passed to the root element.
     */
    root?: React.HTMLAttributes<HTMLDivElement>;
    /**
     * Props passed to the chip elements.
     * Can be an object or a function that receives the chip value and index.
     */
    chip?:
      | Partial<GridSlotProps['baseChip']>
      | ((value: V, index: number) => Partial<GridSlotProps['baseChip']>);
    /**
     * Props passed to the overflow chip element.
     */
    overflowChip?: Partial<GridSlotProps['baseChip']>;
    /**
     * Props passed to the popper element.
     */
    popper?: Partial<GridSlotProps['basePopper']>;
    /**
     * Props passed to the popper content element.
     */
    popperContent?: React.HTMLAttributes<HTMLDivElement>;
  };
}

function GridMultiSelectCell<V extends ValueOptions = ValueOptions>(
  props: GridMultiSelectCellProps<V>,
) {
  const { id, value, colDef, hasFocus, row, slotProps } = props;
  const popupId = `${id}-${colDef.field}-multiselect-popup`;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const privateApiRef = useGridPrivateApiContext();
  const classes = useUtilityClasses(rootProps as OwnerState);
  const rowHeight = useGridSelector(apiRef, gridRowHeightSelector);
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const isAutoHeight = privateApiRef.current.rowHasAutoHeight(id);

  const [popupOpen, setPopupOpen] = React.useState(false);
  const cellRef = React.useRef<HTMLDivElement>(null);
  const overflowChipRef = React.useRef<HTMLDivElement>(null);

  const getOptionValue = (colDef as GridMultiSelectColDef).getOptionValue!;
  const getOptionLabel = (colDef as GridMultiSelectColDef).getOptionLabel!;
  const optionByValue = React.useMemo(() => {
    const map = new Map<any, ValueOptions>();
    const valueOptions = isMultiSelectColDef(colDef) ? getValueOptions(colDef, { id, row }) : null;
    if (valueOptions) {
      for (const opt of valueOptions) {
        map.set(getOptionValue(opt), opt);
      }
    }
    return map;
  }, [colDef, id, row, getOptionValue]);

  // Reorder array to show filtered value first (improves UX when filtering).
  const arrayValue = React.useMemo(() => {
    const rawArrayValue = Array.isArray(value) ? value : [];
    if (rawArrayValue.length === 0) {
      return rawArrayValue;
    }
    const activeFilter = filterModel.items.find(
      (item) =>
        item.field === colDef.field &&
        item.operator === 'contains' &&
        Array.isArray(item.value) &&
        item.value.length > 0,
    );
    if (!activeFilter) {
      return rawArrayValue;
    }
    const filterValues: any[] = activeFilter.value;
    const index = rawArrayValue.findIndex((v) => filterValues.includes(v));
    if (index <= 0) {
      return rawArrayValue;
    }
    const reordered = [...rawArrayValue];
    const [match] = reordered.splice(index, 1);
    reordered.unshift(match);
    return reordered;
  }, [value, filterModel.items, colDef.field]);

  // Focus the overflow chip when the cell receives focus. Ref is null when there's no
  // overflow chip rendered (i.e. all chips fit), which naturally no-ops.
  React.useEffect(() => {
    if (isAutoHeight) {
      return;
    }
    if (hasFocus && !popupOpen) {
      if (overflowChipRef.current && overflowChipRef.current !== document.activeElement) {
        overflowChipRef.current.focus();
      }
    }
    if (!hasFocus) {
      setPopupOpen(false);
    }
  }, [hasFocus, popupOpen, isAutoHeight]);

  const handleOverflowClick = (event: React.MouseEvent) => {
    // event.detail === 0 means keyboard-triggered click (Enter keyup on focused button).
    // Ignore these to prevent popup from opening when focus moves to this cell via Enter.
    if (event.detail === 0) {
      return;
    }
    event.stopPropagation();
    setPopupOpen(true);
  };

  const handleOverflowKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ' ' && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      setPopupOpen((prev) => !prev);
    }
    if (event.key === 'Escape' && popupOpen) {
      event.stopPropagation();
      setPopupOpen(false);
    }
  };

  const handleClickAway = () => {
    setPopupOpen(false);
  };

  if (arrayValue.length === 0) {
    return null;
  }

  return (
    <React.Fragment>
      <GridMultiSelectChips
        ref={cellRef}
        values={arrayValue}
        field={colDef.field}
        columnWidth={colDef.computedWidth}
        autoWrap={isAutoHeight}
        optionByValue={optionByValue}
        getOptionLabel={getOptionLabel}
        classes={{
          root: classes.root,
          chip: classes.chip,
          chipHidden: classes.chipHidden,
          overflow: classes.overflow,
        }}
        slotProps={{
          root: {
            ...slotProps?.root,
            className: clsx(hasFocus && 'Mui-focused', slotProps?.root?.className),
          },
          chip: slotProps?.chip,
          overflow: {
            ref: overflowChipRef,
            onClick: handleOverflowClick,
            onKeyDown: handleOverflowKeyDown,
            'aria-haspopup': 'dialog',
            'aria-keyshortcuts': 'Space',
            'aria-controls': popupOpen ? popupId : undefined,
            'aria-expanded': popupOpen,
            material: { tabIndex: -1, component: 'button' },
            ...slotProps?.overflowChip,
          },
        }}
      />
      {popupOpen && (
        <GridMultiSelectCellPopper
          id={popupId}
          role="dialog"
          aria-label={colDef.headerName || colDef.field}
          as={rootProps.slots.basePopper}
          ownerState={rootProps as OwnerState}
          open={popupOpen}
          target={cellRef.current}
          placement="bottom-start"
          onClickAway={handleClickAway}
          clickAwayMouseEvent="onMouseDown"
          flip
          material={{
            container: cellRef.current?.closest('[role="row"]'),
            modifiers: [
              {
                name: 'offset',
                options: { offset: [-10, -rowHeight] },
              },
            ],
          }}
          {...slotProps?.popper}
          className={clsx(classes.popup, slotProps?.popper?.className)}
        >
          <GridMultiSelectCellPopperContent
            tabIndex={-1}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.stopPropagation();
                setPopupOpen(false);
                apiRef.current.getCellElement(id, colDef.field)?.focus();
              }
            }}
            {...slotProps?.popperContent}
            className={clsx(classes.popperContent, slotProps?.popperContent?.className)}
            style={
              {
                '--_width': `${colDef.computedWidth}px`,
                ...slotProps?.popperContent?.style,
              } as React.CSSProperties
            }
          >
            {arrayValue.map((v, index) => {
              const option = optionByValue.get(v) ?? v;
              const chipProps =
                typeof slotProps?.chip === 'function'
                  ? slotProps.chip(option, index)
                  : slotProps?.chip;
              return (
                <rootProps.slots.baseChip
                  key={index}
                  label={getOptionLabel(option)}
                  size="small"
                  variant="outlined"
                  {...chipProps}
                  className={clsx(classes.chip, chipProps?.className)}
                />
              );
            })}
          </GridMultiSelectCellPopperContent>
        </GridMultiSelectCellPopper>
      )}
    </React.Fragment>
  );
}

export { GridMultiSelectCell };

export const renderMultiSelectCell = (
  params: GridMultiSelectCellProps & { aggregation?: GridAggregationCellMeta },
) => {
  if (params.aggregation) {
    if (params.aggregation.position === 'footer') {
      return <GridFooterCell {...params} />;
    }
    return params.formattedValue ?? params.value;
  }
  // On group rows, `value` is the grouping key (string) from `groupingValueGetter`, not the array.
  if (params.rowNode.type === 'group') {
    return params.formattedValue ?? params.value;
  }
  return <GridMultiSelectCell {...params} />;
};
