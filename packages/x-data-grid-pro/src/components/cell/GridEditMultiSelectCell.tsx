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
} from '@mui/x-data-grid';
import {
  NotRendered,
  vars,
  isMultiSelectColDef,
  getValueOptions,
  gridRowHeightSelector,
} from '@mui/x-data-grid/internals';
import type { AutocompleteProps } from '@mui/x-data-grid/internals';
import type { DataGridProProcessedProps } from '../../models/dataGridProProps';

type OwnerState = DataGridProProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['editMultiSelectCell'],
    value: ['editMultiSelectCellValue'],
    chip: ['editMultiSelectCellChip'],
    popup: ['editMultiSelectCellPopup'],
    popperContent: ['editMultiSelectCellPopperContent'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridEditMultiSelectCellRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'EditMultiSelectCell',
})({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  position: 'relative',
});

const GridEditMultiSelectCellValue = styled('div', {
  name: 'MuiDataGrid',
  slot: 'EditMultiSelectCellValue',
})({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  overflow: 'hidden',
  width: '100%',
  paddingInline: 10,
});

const GridEditMultiSelectCellPopper = styled(NotRendered<GridSlotProps['basePopper']>, {
  name: 'MuiDataGrid',
  slot: 'EditMultiSelectCellPopper',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  zIndex: vars.zIndex.menu,
  background: (theme.vars || theme).palette.background.paper,
  '&[data-popper-reference-hidden]': {
    opacity: 0,
  },
}));

const GridEditMultiSelectCellPopperContent = styled('div', {
  name: 'MuiDataGrid',
  slot: 'EditMultiSelectCellPopperContent',
})(({ theme }) => ({
  width: 'var(--_width)',
  borderRadius: (theme.vars || theme).shape.borderRadius,
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
  '& .MuiInputBase-root.MuiInputBase-sizeSmall': {
    minHeight: 52,
    '& .MuiInputBase-input': {
      paddingBlock: 3.5,
    },
  },
  '& + .MuiAutocomplete-popper': {
    '& .MuiAutocomplete-listbox': {
      boxSizing: 'border-box',
      maxHeight: 52 * 3, // 3 items max height
    },
    '& .MuiAutocomplete-option': {
      ...theme.typography.body2,
    },
  },
}));

const GridEditMultiSelectCellAutocompletePopper = styled('div', {
  slot: 'internal',
  shouldForwardProp: (prop) =>
    prop !== 'ownerState' && prop !== 'anchorEl' && prop !== 'open' && prop !== 'disablePortal',
})({});

export interface GridEditMultiSelectCellProps extends GridRenderEditCellParams {
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
     * Props passed to the value element.
     */
    value?: React.HTMLAttributes<HTMLDivElement>;
    /**
     * Props passed to the chip elements.
     * Can be an object or a function that receives the chip value and index.
     */
    chip?:
      | Partial<GridSlotProps['baseChip']>
      | ((value: any, index: number) => Partial<GridSlotProps['baseChip']>);
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
    autocomplete?: Partial<AutocompleteProps<ValueOptions, true, false, false>> &
      Partial<BaseAutocompletePropsOverrides>;
  };
}

function GridEditMultiSelectCell(props: GridEditMultiSelectCellProps) {
  const rootProps = useGridRootProps();
  const { id, value: valueProp, field, row, colDef, cellMode, hasFocus, slotProps } = props;

  const apiRef = useGridApiContext();
  const classes = useUtilityClasses(rootProps as OwnerState);
  const rowHeight = useGridSelector(apiRef, gridRowHeightSelector);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const popupId = `${id}-${field}-multiselect-edit-popup`;
  const showPopup = hasFocus && Boolean(anchorEl);

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

  // Convert values to options for Autocomplete
  const selectedOptions = currentValue
    .map((val: any) => valueOptions.find((option) => getOptionValue(option) === val))
    .filter((option): option is ValueOptions => option !== undefined);

  return (
    <GridEditMultiSelectCellRoot
      tabIndex={cellMode === 'edit' && rootProps.editMode === 'row' ? 0 : undefined}
      ref={setAnchorEl}
      aria-controls={showPopup ? popupId : undefined}
      aria-expanded={showPopup}
      {...slotProps?.root}
      className={clsx(classes.root, slotProps?.root?.className)}
    >
      <GridEditMultiSelectCellValue
        {...slotProps?.value}
        className={clsx(classes.value, slotProps?.value?.className)}
      >
        {currentValue.map((val: any, index: number) => {
          const chipSlotProps =
            typeof slotProps?.chip === 'function' ? slotProps.chip(val, index) : slotProps?.chip;
          return (
            <rootProps.slots.baseChip
              key={index}
              label={getOptionLabel(
                valueOptions.find((option) => getOptionValue(option) === val) ?? val,
              )}
              size="small"
              {...chipSlotProps}
              className={clsx(classes.chip, chipSlotProps?.className)}
            />
          );
        })}
      </GridEditMultiSelectCellValue>
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
          container: anchorEl?.closest('[role="row"]'),
          modifiers: [
            {
              name: 'offset',
              options: { offset: [-1, -rowHeight] },
            },
          ],
        }}
        {...slotProps?.popper}
        className={clsx(classes.popup, slotProps?.popper?.className)}
      >
        <GridEditMultiSelectCellPopperContent
          {...slotProps?.popperContent}
          className={clsx(classes.popperContent, slotProps?.popperContent?.className)}
          style={{ '--_width': `${colDef.computedWidth}px` } as React.CSSProperties}
        >
          <GridEditMultiSelectAutocomplete
            {...props}
            valueOptions={valueOptions}
            selectedOptions={selectedOptions}
            getOptionValue={getOptionValue}
            getOptionLabel={getOptionLabel}
          />
        </GridEditMultiSelectCellPopperContent>
      </GridEditMultiSelectCellPopper>
    </GridEditMultiSelectCellRoot>
  );
}

interface GridEditMultiSelectAutocompleteProps extends GridEditMultiSelectCellProps {
  valueOptions: ValueOptions[];
  selectedOptions: ValueOptions[];
  getOptionValue: (option: ValueOptions) => string | number;
  getOptionLabel: (option: ValueOptions) => string;
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
  } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  useEnhancedEffect(() => {
    if (hasFocus && inputRef.current) {
      // preventScroll: the popper is portaled into the GridRow, so focusing
      // without it triggers the browser to scroll the grid container which is undesirable.
      inputRef.current.focus({ preventScroll: true });
    }
  }, [hasFocus]);

  const handleClose = React.useCallback(
    (_event: React.SyntheticEvent, reason: string) => {
      apiRef.current.stopCellEditMode({
        id,
        field,
        ignoreModifications: reason === 'escape',
      });
    },
    [apiRef, field, id],
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
          } else {
            // Bare Enter: exit edit mode, ignore this selection change
            apiRef.current.stopCellEditMode({ id, field });
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
    [apiRef, field, getOptionValue, id, onValueChange],
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
      autoHighlight
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
