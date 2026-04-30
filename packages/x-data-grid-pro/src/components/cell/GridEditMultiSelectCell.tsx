'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import type {
  GridRenderEditCellParams,
  GridMultiSelectColDef,
  ValueOptions,
  GridSlotProps,
  BaseAutocompletePropsOverrides,
} from '@mui/x-data-grid';
import {
  getDataGridUtilityClass,
  useGridRootProps,
  useGridApiContext,
  useGridSelector,
  GridCellEditStopReasons,
} from '@mui/x-data-grid';
import {
  NotRendered,
  vars,
  isMultiSelectColDef,
  getValueOptions,
  gridRowHeightSelector,
} from '@mui/x-data-grid/internals';
import type { AutocompleteProps } from '@mui/x-data-grid/internals';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { inputBaseClasses } from '@mui/material/InputBase';
import type { DataGridProProcessedProps } from '../../models/dataGridProProps';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { GridMultiSelectChips } from './GridMultiSelectChips';

type OwnerState = DataGridProProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['editMultiSelectCell'],
    chip: ['editMultiSelectCellChip'],
    chipHidden: ['editMultiSelectCellChip--hidden'],
    overflow: ['editMultiSelectCellOverflow'],
    popup: ['editMultiSelectCellPopup'],
    popperContent: ['editMultiSelectCellPopperContent'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridEditMultiSelectCellPopper = styled(NotRendered<GridSlotProps['basePopper']>, {
  name: 'MuiDataGrid',
  slot: 'EditMultiSelectCellPopper',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  zIndex: vars.zIndex.modal,
  background: (theme.vars || theme).palette.background.paper,
  borderRadius: (theme.vars || theme).shape.borderRadius,
  '&[data-popper-reference-hidden]': {
    opacity: 0,
  },
}));

const GridEditMultiSelectCellPopperContent = styled('div', {
  name: 'MuiDataGrid',
  slot: 'EditMultiSelectCellPopperContent',
})(({ theme }) => ({
  width: 'var(--_width)',
  boxShadow: (theme.vars || theme).shadows[4],
  boxSizing: 'border-box',
}));

const GridEditMultiSelectCellAutocomplete = styled(
  NotRendered<AutocompleteProps<ValueOptions, true, false, false> & BaseAutocompletePropsOverrides>,
  {
    name: 'MuiDataGrid',
    slot: 'EditMultiSelectCellAutocomplete',
  },
)(({ theme }) => ({
  [`& .${inputBaseClasses.root}.${inputBaseClasses.sizeSmall}`]: {
    minHeight: 'var(--_rowHeight, 52px)',
    paddingBlock: 4,
  },
  [`& + .${autocompleteClasses.popper}`]: {
    [`& .${autocompleteClasses.option}`]: {
      ...theme.typography.body2,
    },
  },
}));

const GridEditMultiSelectCellAutocompletePopper = styled('div', {
  slot: 'internal',
  shouldForwardProp: (prop) =>
    prop !== 'ownerState' && prop !== 'anchorEl' && prop !== 'open' && prop !== 'disablePortal',
})({});

const GridEditMultiSelectChips = styled(GridMultiSelectChips)({
  padding: '0 10px',
  '&:focus-visible': {
    outline: 'none', // let the grid cell handle the focus ring
  },
}) as typeof GridMultiSelectChips;

export interface GridEditMultiSelectCellProps<
  V extends ValueOptions = ValueOptions,
> extends GridRenderEditCellParams {
  /**
   * Callback called when the value is changed by the user.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {any[]} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
   * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
   */
  onValueChange?: (event: React.SyntheticEvent, newValue: any[]) => Promise<void> | void;
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
     * Props passed to the popper element.
     */
    popper?: Partial<GridSlotProps['basePopper']>;
    /**
     * Props passed to the popper content element.
     */
    popperContent?: React.HTMLAttributes<HTMLDivElement>;
    /**
     * Props passed to the autocomplete element.
     */
    autocomplete?: Partial<AutocompleteProps<V, true, false, false>> &
      Partial<BaseAutocompletePropsOverrides>;
  };
}

function GridEditMultiSelectCell<V extends ValueOptions = ValueOptions>(
  props: GridEditMultiSelectCellProps<V>,
) {
  const rootProps = useGridRootProps();
  const { id, value: valueProp, field, row, colDef, cellMode, hasFocus, slotProps } = props;

  const apiRef = useGridApiContext();
  const privateApiRef = useGridPrivateApiContext();
  const classes = useUtilityClasses(rootProps as OwnerState);
  const rowHeight = useGridSelector(apiRef, gridRowHeightSelector);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [open, setOpen] = React.useState(true);
  const isAutoHeight = privateApiRef.current.rowHasAutoHeight(id);

  const popupId = `${id}-${field}-multiselect-edit-popup`;
  const showPopup = hasFocus && Boolean(anchorEl) && open;

  const closePopup = (reason: GridCellEditStopReasons) => {
    if (rootProps.editMode === 'row') {
      setOpen(false);
      return;
    }
    const params = apiRef.current.getCellParams(id, field);
    apiRef.current.publishEvent('cellEditStop', { ...params, reason });
  };

  const handleModalClose = () => closePopup(GridCellEditStopReasons.cellFocusOut);

  const handleKeyDownCapture = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      closePopup(GridCellEditStopReasons.escapeKeyDown);
    }
  };

  const handleReopen = () => {
    if (rootProps.editMode === 'row' && !open) {
      setOpen(true);
    }
  };

  const handleChipsKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && rootProps.editMode === 'row' && !open) {
      // Consume Enter so the grid's row-edit handler doesn't exit the row.
      event.preventDefault();
      event.stopPropagation();
      setOpen(true);
    }
  };

  // The Modal locks body scroll and the autocomplete input is body-portaled, so the
  // browser default scroll-into-view that text-input cells rely on doesn't fire here —
  // call `apiRef.scrollToIndexes` on the focus-gain edge to bring the cell into view.
  const prevHasFocusRef = React.useRef(false);
  useEnhancedEffect(() => {
    if (rootProps.editMode !== 'row') {
      return;
    }
    if (!hasFocus) {
      setOpen(true);
      prevHasFocusRef.current = false;
      return;
    }
    if (!prevHasFocusRef.current) {
      apiRef.current.scrollToIndexes({
        colIndex: apiRef.current.getColumnIndex(field, true),
        rowIndex: apiRef.current.getRowIndexRelativeToVisibleRows(id),
      });
      prevHasFocusRef.current = true;
    }
  }, [hasFocus, rootProps.editMode, apiRef, field, id]);

  useEnhancedEffect(() => {
    if (rootProps.editMode !== 'row') {
      return;
    }
    if (hasFocus && !open) {
      anchorEl?.focus();
    }
  }, [hasFocus, open, rootProps.editMode, anchorEl]);

  const getOptionValue = (colDef as GridMultiSelectColDef).getOptionValue!;
  const getOptionLabel = (colDef as GridMultiSelectColDef).getOptionLabel!;

  if (!isMultiSelectColDef(colDef)) {
    return null;
  }

  const valueOptions = getValueOptions(colDef, { id, row });
  if (!valueOptions) {
    return null;
  }

  const currentValue = Array.isArray(valueProp) ? valueProp : [];

  const optionByValue = new Map<any, ValueOptions>();
  for (const opt of valueOptions) {
    optionByValue.set(getOptionValue(opt), opt);
  }

  // Convert values to options for Autocomplete
  const selectedOptions = currentValue
    .map((val: any) => optionByValue.get(val))
    .filter((option): option is ValueOptions => option !== undefined);

  return (
    <React.Fragment>
      <GridEditMultiSelectChips
        ref={setAnchorEl as React.Ref<HTMLDivElement>}
        values={currentValue}
        field={field}
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
            tabIndex: cellMode === 'edit' && rootProps.editMode === 'row' ? 0 : undefined,
            'aria-controls': showPopup ? popupId : undefined,
            'aria-expanded': showPopup,
            onClick: handleReopen,
            onKeyDown: handleChipsKeyDown,
            ...slotProps?.root,
          },
          chip: slotProps?.chip,
          // No `overflow` slotProps → `+N` renders as a non-interactive indicator;
          // clicks on the cell focus the autocomplete which opens the editor.
        }}
      />
      <rootProps.slots.baseModal
        open={showPopup}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        onClose={handleModalClose}
        material={{
          slotProps: { root: { style: { zIndex: 'auto' } }, backdrop: { invisible: true } },
        }}
      >
        <GridEditMultiSelectCellPopper
          as={rootProps.slots.basePopper}
          ownerState={rootProps as OwnerState}
          id={popupId}
          role="dialog"
          aria-label={colDef.headerName || field}
          open={showPopup}
          target={anchorEl}
          placement="bottom-start"
          flip
          material={{
            modifiers: [
              {
                name: 'offset',
                options: { offset: [-1, -rowHeight + 1] }, // 1px compensate for the editing cell padding.
              },
            ],
          }}
          {...slotProps?.popper}
          className={clsx(classes.popup, slotProps?.popper?.className)}
        >
          <GridEditMultiSelectCellPopperContent
            onKeyDownCapture={handleKeyDownCapture}
            {...slotProps?.popperContent}
            className={clsx(classes.popperContent, slotProps?.popperContent?.className)}
            style={
              {
                '--_width': `${colDef.computedWidth}px`,
                '--_rowHeight': `${rowHeight}px`,
              } as React.CSSProperties
            }
          >
            <GridEditMultiSelectAutocomplete
              {...(props as GridEditMultiSelectCellProps)}
              valueOptions={valueOptions}
              selectedOptions={selectedOptions}
              getOptionValue={getOptionValue}
              getOptionLabel={getOptionLabel}
              onDismiss={() => setOpen(false)}
            />
          </GridEditMultiSelectCellPopperContent>
        </GridEditMultiSelectCellPopper>
      </rootProps.slots.baseModal>
    </React.Fragment>
  );
}

interface GridEditMultiSelectAutocompleteProps extends GridEditMultiSelectCellProps {
  valueOptions: ValueOptions[];
  selectedOptions: ValueOptions[];
  getOptionValue: (option: ValueOptions) => string | number;
  getOptionLabel: (option: ValueOptions) => string;
  onDismiss: () => void;
}

function GridEditMultiSelectAutocomplete(props: GridEditMultiSelectAutocompleteProps) {
  const {
    id,
    field,
    hasFocus,
    onValueChange,
    slotProps,
    valueOptions,
    selectedOptions,
    getOptionValue,
    getOptionLabel,
    onDismiss,
  } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  useEnhancedEffect(() => {
    if (hasFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasFocus]);

  const handleClose = React.useCallback(
    (_event: React.SyntheticEvent, reason: string) => {
      if (rootProps.editMode === 'row') {
        onDismiss();
        return;
      }
      const params = apiRef.current.getCellParams(id, field);
      apiRef.current.publishEvent('cellEditStop', {
        ...params,
        reason:
          reason === 'escape'
            ? GridCellEditStopReasons.escapeKeyDown
            : GridCellEditStopReasons.cellFocusOut,
      });
    },
    [apiRef, field, id, onDismiss, rootProps.editMode],
  );

  const isOptionEqualToValue = React.useCallback(
    (option: ValueOptions, val: ValueOptions) => getOptionValue(option) === getOptionValue(val),
    [getOptionValue],
  );

  const handleChange = React.useCallback(
    async (event: React.SyntheticEvent, newValue: ValueOptions[]) => {
      if (event.type === 'keydown') {
        const keyboardEvent = event.nativeEvent as KeyboardEvent;
        if (keyboardEvent.key === 'Enter') {
          if (keyboardEvent.ctrlKey || keyboardEvent.metaKey) {
            // Ctrl/Cmd + Enter: stop propagation to prevent cell navigation
            event.stopPropagation();
          } else if (rootProps.editMode === 'row') {
            // Row mode bare Enter: dismiss popup, keep cell focused, ignore this selection.
            onDismiss();
            return;
          } else {
            // Cell mode bare Enter: exit edit mode, ignore this selection change.
            const params = apiRef.current.getCellParams(id, field);
            apiRef.current.publishEvent('cellEditStop', {
              ...params,
              reason: GridCellEditStopReasons.enterKeyDown,
            });
            return;
          }
        }
      }
      const newValues = newValue.map((option) => getOptionValue(option));

      if (onValueChange) {
        await onValueChange(event, newValues);
      }

      await apiRef.current.setEditCellValue({ id, field, value: newValues }, event);
    },
    [apiRef, field, getOptionValue, id, onDismiss, onValueChange, rootProps.editMode],
  );

  return (
    <GridEditMultiSelectCellAutocomplete
      as={rootProps.slots.baseAutocomplete}
      multiple
      open
      options={valueOptions}
      value={selectedOptions}
      onClose={handleClose}
      onChange={handleChange}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      disableCloseOnSelect
      openOnFocus
      slotProps={{
        textField: {
          size: 'small',
          inputRef,
        },
        chip: slotProps?.chip as GridSlotProps['baseChip'],
      }}
      {...slotProps?.autocomplete}
      material={{
        ...slotProps?.autocomplete?.material,
        slots: {
          // @ts-expect-error the types require import from Material UI package
          popper: GridEditMultiSelectCellAutocompletePopper,
          ...slotProps?.autocomplete?.material?.slots,
        },
      }}
    />
  );
}

GridEditMultiSelectCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * GridApi that let you manipulate the grid.
   */
  api: PropTypes.object.isRequired,
  /**
   * The mode of the cell.
   */
  cellMode: PropTypes.oneOf(['edit', 'view']).isRequired,
  changeReason: PropTypes.oneOf(['debouncedSetEditCellValue', 'setEditCellValue']),
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: PropTypes.any,
  /**
   * If true, the cell is the active element.
   */
  hasFocus: PropTypes.bool.isRequired,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * If true, the cell is editable.
   */
  isEditable: PropTypes.bool,
  isProcessingProps: PropTypes.bool,
  isValidating: PropTypes.bool,
  /**
   * Callback called when the value is changed by the user.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {any[]} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
   * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
   */
  onValueChange: PropTypes.func,
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.any.isRequired,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.object.isRequired,
  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: PropTypes.any,
} as any;

export { GridEditMultiSelectCell };

export const renderEditMultiSelectCell = (params: GridEditMultiSelectCellProps) => (
  <GridEditMultiSelectCell {...params} />
);
