'use client';
import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { styled } from '@mui/material/styles';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import { GridRenderEditCellParams } from '../../models/params/gridCellParams';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { NotRendered } from '../../utils/assert';
import { GridSlotProps } from '../../models/gridSlotsComponent';
import { vars } from '../../constants/cssVariables';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['editLongTextCell'],
    popup: ['editLongTextCellPopup'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

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

const GridEditLongTextCellPopper = styled(NotRendered<GridSlotProps['basePopper']>, {
  name: 'MuiDataGrid',
  slot: 'LongTextCellPopper',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  zIndex: vars.zIndex.menu,
  background: (theme.vars || theme).palette.background.paper,
}));

const GridEditLongTextCellPopupContent = styled('div', {
  name: 'MuiDataGrid',
  slot: 'EditLongTextCellPopupContent',
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
}

function GridEditLongTextCell(props: GridEditLongTextCellProps) {
  const { id, value, field, colDef, hasFocus } = props;

  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses(rootProps);

  const [valueState, setValueState] = React.useState(value);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const meta = apiRef.current.unstable_getEditCellMeta(id, field);

  React.useEffect(() => {
    if (meta?.changeReason !== 'debouncedSetEditCellValue') {
      setValueState(value);
    }
  }, [meta, value]);

  // Close popup (stop edit) when row scrolls out of view
  React.useEffect(() => {
    return apiRef.current.subscribeEvent('renderedRowsIntervalChange', (context) => {
      const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(id);
      if (rowIndex < context.firstRowIndex || rowIndex >= context.lastRowIndex) {
        apiRef.current.stopCellEditMode({ id, field, ignoreModifications: true });
      }
    });
  }, [apiRef, id, field]);

  // Only show popup when this cell has focus
  // This fixes editMode="row" where all cells enter edit mode simultaneously
  const showPopup = hasFocus && Boolean(anchorEl);

  return (
    <GridEditLongTextCellRoot ref={setAnchorEl} className={classes.root}>
      {/* Show ellipsis text when not focused (row editing mode) */}
      {!hasFocus && (
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          {valueState}
        </div>
      )}
      <GridEditLongTextCellPopper
        as={rootProps.slots.basePopper}
        ownerState={rootProps}
        open={showPopup}
        target={anchorEl}
        placement="bottom-start"
        className={classes.popup}
        flip
        material={{
          modifiers: [
            {
              name: 'offset',
              options: { offset: [-1, -2 - (anchorEl?.offsetHeight ?? 0)] },
            },
          ],
        }}
      >
        <GridEditLongTextCellPopupContent
          sx={{
            '--_width': `calc(${colDef.computedWidth}px + 7ch)`, // the extra 7ch accounts for ellipsis word
          }}
        >
          <GridEditLongTextarea {...props} valueState={valueState} setValueState={setValueState} />
        </GridEditLongTextCellPopupContent>
      </GridEditLongTextCellPopper>
    </GridEditLongTextCellRoot>
  );
}

function GridEditLongTextarea(props: GridEditLongTextCellProps) {
  const { id, field, debounceMs = 200, onValueChange, valueState, setValueState, hasFocus } = props;
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const apiRef = useGridApiContext();

  useEnhancedEffect(() => {
    if (hasFocus && inputRef.current) {
      inputRef.current.focus();
      // Move cursor to end of text
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [hasFocus]);

  const handleChange = React.useCallback<NonNullable<InputBaseProps['onChange']>>(
    async (event) => {
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
        await onValueChange(event as React.ChangeEvent<HTMLTextAreaElement>, newValue);
      }
    },
    [apiRef, debounceMs, field, id, onValueChange, setValueState],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter') {
        if (event.ctrlKey || event.metaKey) {
          // Ctrl/Cmd+Enter: save and exit
          apiRef.current.stopCellEditMode({ id, field });
          event.preventDefault();
        }
        // Plain Enter: let textarea handle newline, stop propagation to prevent grid from exiting edit
        event.stopPropagation();
      }
      if (event.key === 'Escape') {
        // Escape: cancel edit
        apiRef.current.stopCellEditMode({ id, field, ignoreModifications: true });
        event.stopPropagation();
      }
    },
    [apiRef, field, id],
  );
  return (
    <InputBase
      inputRef={inputRef}
      multiline
      autoFocus
      minRows={3}
      value={valueState ?? ''}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      sx={(theme) => ({
        width: '100%',
        textarea: { resize: 'vertical' },
        padding: 0,
        ...theme.typography.body2,
        letterSpacing: 'normal',
      })}
    />
  );
}

export { GridEditLongTextCell };

export const renderEditLongTextCell = (params: GridEditLongTextCellProps) => (
  <GridEditLongTextCell {...params} />
);
