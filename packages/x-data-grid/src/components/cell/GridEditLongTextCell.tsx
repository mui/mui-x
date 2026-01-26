'use client';
import * as React from 'react';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { styled } from '@mui/material/styles';
import { GridRenderEditCellParams } from '../../models/params/gridCellParams';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridRowHeightSelector } from '../../hooks/features/dimensions/gridDimensionsSelectors';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { NotRendered } from '../../utils/assert';
import { GridSlotProps } from '../../models/gridSlotsComponent';
import { vars } from '../../constants/cssVariables';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['editLongTextCell'],
    value: ['editLongTextCellValue'],
    popup: ['editLongTextCellPopup'],
    popperContent: ['editLongTextCellPopperContent'],
    textarea: ['editLongTextCellTextarea'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridEditLongTextCellTextarea = styled(NotRendered<GridSlotProps['baseTextarea']>, {
  name: 'MuiDataGrid',
  slot: 'EditLongTextCellTextarea',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  width: '100%',
  padding: 0,
  ...theme.typography.body2,
  letterSpacing: 'normal',
  outline: 'none',
  background: 'transparent',
  border: 'none',
  resize: 'vertical',
}));

const GridEditLongTextCellRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'EditLongTextCell',
})({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  position: 'relative',
});

const GridEditLongTextCellValue = styled('div', {
  name: 'MuiDataGrid',
  slot: 'EditLongTextCellValue',
})({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '100%',
  paddingInline: 10,
});

const GridEditLongTextCellPopper = styled(NotRendered<GridSlotProps['basePopper']>, {
  name: 'MuiDataGrid',
  slot: 'EditLongTextCellPopper',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  zIndex: vars.zIndex.menu,
  background: (theme.vars || theme).palette.background.paper,
  '&[data-popper-reference-hidden]': {
    opacity: 0, // use opacity to preserve focus.
  },
}));

const GridEditLongTextCellPopperContent = styled('div', {
  name: 'MuiDataGrid',
  slot: 'EditLongTextCellPopperContent',
})(({ theme }) => ({
  ...theme.typography.body2,
  letterSpacing: 'normal',
  paddingBlock: 15.5,
  paddingInline: 9,
  height: 'max-content',
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  width: 'var(--_width)',
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  boxShadow: (theme.vars || theme).shadows[4],
  boxSizing: 'border-box',
}));

export interface GridEditLongTextCellProps extends GridRenderEditCellParams<any, string | null> {
  debounceMs?: number;
  /**
   * Callback called when the value is changed by the user.
   * @param {React.ChangeEvent<HTMLTextAreaElement>} event The event source of the callback.
   * @param {string} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
   * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
   */
  onValueChange?: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    newValue: string,
  ) => Promise<void> | void;
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
     * Props passed to the popper element.
     */
    popper?: Partial<GridSlotProps['basePopper']>;
    /**
     * Props passed to the popper content element.
     */
    popperContent?: React.HTMLAttributes<HTMLDivElement>;
    /**
     * Props passed to the textarea element.
     */
    textarea?: Partial<GridSlotProps['baseTextarea']>;
  };
}

function GridEditLongTextCell(props: GridEditLongTextCellProps) {
  const { id, value, field, colDef, hasFocus, cellMode, slotProps } = props;

  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses(rootProps);
  const rowHeight = useGridSelector(apiRef, gridRowHeightSelector);

  const [valueState, setValueState] = React.useState(value);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const meta = apiRef.current.unstable_getEditCellMeta(id, field);

  const popupId = `${id}-${field}-longtext-edit-popup`;

  // Only show popup when this cell has focus
  // This fixes editMode="row" where all cells enter edit mode simultaneously
  const showPopup = hasFocus && Boolean(anchorEl);

  React.useEffect(() => {
    if (meta?.changeReason !== 'debouncedSetEditCellValue') {
      setValueState(value);
    }
  }, [meta, value]);

  return (
    <GridEditLongTextCellRoot
      tabIndex={cellMode === 'edit' && rootProps.editMode === 'row' ? 0 : undefined}
      ref={setAnchorEl}
      aria-controls={showPopup ? popupId : undefined}
      aria-expanded={showPopup}
      {...slotProps?.root}
      className={clsx(classes.root, slotProps?.root?.className)}
    >
      <GridEditLongTextCellValue
        {...slotProps?.value}
        className={clsx(classes.value, slotProps?.value?.className)}
      >
        {valueState}
      </GridEditLongTextCellValue>
      <GridEditLongTextCellPopper
        as={rootProps.slots.basePopper}
        ownerState={rootProps}
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
        {/* Required React element as a child because `rootProps.slots.basePopper` uses ClickAwayListener internally */}
        <GridEditLongTextCellPopperContent
          {...slotProps?.popperContent}
          className={clsx(classes.popperContent, slotProps?.popperContent?.className)}
          style={{ '--_width': `${colDef.computedWidth}px` } as React.CSSProperties}
        >
          <GridEditLongTextarea {...props} valueState={valueState} setValueState={setValueState} />
        </GridEditLongTextCellPopperContent>
      </GridEditLongTextCellPopper>
    </GridEditLongTextCellRoot>
  );
}

function GridEditLongTextarea(props: GridEditLongTextCellProps) {
  const {
    id,
    field,
    colDef,
    debounceMs = 200,
    onValueChange,
    valueState,
    setValueState,
    hasFocus,
    slotProps,
  } = props;
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  useEnhancedEffect(() => {
    if (hasFocus && textareaRef.current) {
      // preventScroll: the popper is portaled into the GridRow, so focusing
      // without it triggers the browser to scroll the grid container which is undesirable.
      textareaRef.current.focus({ preventScroll: true });
      // Move cursor to end of text
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [hasFocus]);

  const handleChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;

      const column = apiRef.current.getColumn(field);

      let parsedValue = newValue;
      if (column.valueParser) {
        parsedValue = column.valueParser(newValue, apiRef.current.getRow(id), column, apiRef);
      }

      setValueState(parsedValue);
      apiRef.current.setEditCellValue(
        { id, field, value: parsedValue, debounceMs, unstable_skipValueParser: true },
        event,
      );

      if (onValueChange) {
        await onValueChange(event, newValue);
      }
    },
    [apiRef, debounceMs, field, id, onValueChange, setValueState],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && event.shiftKey) {
        // Shift+Enter: let textarea handle newline, stop propagation to prevent grid from exiting edit
        event.stopPropagation();
      }
      if (rootProps.editMode === 'cell' && event.key === 'Escape') {
        apiRef.current.stopCellEditMode({ id, field, ignoreModifications: true });
      }
    },
    [apiRef, field, id, rootProps.editMode],
  );
  return (
    <GridEditLongTextCellTextarea
      ref={textareaRef}
      as={rootProps.slots.baseTextarea}
      ownerState={rootProps}
      aria-label={colDef.headerName || field}
      value={valueState ?? ''}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...slotProps?.textarea}
      className={clsx(classes.textarea, slotProps?.textarea?.className)}
    />
  );
}

export { GridEditLongTextCell };

export const renderEditLongTextCell = (params: GridEditLongTextCellProps) => (
  <GridEditLongTextCell {...params} />
);
