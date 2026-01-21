'use client';
import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { styled } from '@mui/material/styles';
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

const GridEditLongTextCellTextarea = styled(NotRendered<GridSlotProps['baseTextarea']>, {
  name: 'MuiDataGrid',
  slot: 'EditLongTextCellTextarea',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  width: '100%',
  textarea: { resize: 'vertical' },
  padding: 0,
  ...theme.typography.body2,
  letterSpacing: 'normal',
  outline: 'none',
  background: 'transparent',
  border: 'none',
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
  const { id, value, field, colDef, hasFocus, cellMode } = props;

  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses(rootProps);

  const [valueState, setValueState] = React.useState(value);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const meta = apiRef.current.unstable_getEditCellMeta(id, field);

  // Only show popup when this cell has focus
  // This fixes editMode="row" where all cells enter edit mode simultaneously
  const showPopup = hasFocus && Boolean(anchorEl);

  React.useEffect(() => {
    if (meta?.changeReason !== 'debouncedSetEditCellValue') {
      setValueState(value);
    }
  }, [meta, value]);

  React.useEffect(() => {});

  // Close popup (stop edit) when cell scrolls out of view
  React.useEffect(() => {
    if (!showPopup) {
      return undefined;
    }
    const unsubscribeRows = apiRef.current.subscribeEvent(
      'renderedRowsIntervalChange',
      (context) => {
        const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(id);
        if (rowIndex < context.firstRowIndex || rowIndex >= context.lastRowIndex) {
          apiRef.current.stopCellEditMode({ id, field, ignoreModifications: true });
        }
      },
    );
    const unsubscribeCols = apiRef.current.subscribeEvent('scrollPositionChange', (params) => {
      if (params.renderContext) {
        const colIndex = apiRef.current.getColumnIndexRelativeToVisibleColumns(colDef.field);
        if (
          colIndex < params.renderContext.firstColumnIndex ||
          colIndex >= params.renderContext.lastColumnIndex
        ) {
          apiRef.current.stopCellEditMode({ id, field, ignoreModifications: true });
        }
      }
    });
    return () => {
      unsubscribeRows();
      unsubscribeCols();
    };
  }, [apiRef, id, field, colDef.field, showPopup]);

  return (
    <GridEditLongTextCellRoot
      tabIndex={cellMode === 'edit' && rootProps.editMode === 'row' ? 0 : undefined}
      ref={setAnchorEl}
      className={classes.root}
    >
      <GridEditLongTextCellValue>{valueState}</GridEditLongTextCellValue>
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
        {/* Required React element as a child because `rootProps.slots.basePopper` uses ClickAwayListener internally */}
        <GridEditLongTextCellPopperContent
          style={{ '--_width': `${colDef.computedWidth}px` } as React.CSSProperties}
        >
          <GridEditLongTextarea {...props} valueState={valueState} setValueState={setValueState} />
        </GridEditLongTextCellPopperContent>
      </GridEditLongTextCellPopper>
    </GridEditLongTextCellRoot>
  );
}

function GridEditLongTextarea(props: GridEditLongTextCellProps) {
  const { id, field, debounceMs = 200, onValueChange, valueState, setValueState, hasFocus } = props;
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  useEnhancedEffect(() => {
    if (hasFocus && textareaRef.current) {
      textareaRef.current.focus();
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
      if (event.key === 'Enter') {
        if (!event.ctrlKey && !event.metaKey) {
          // Plain Enter: let textarea handle newline, stop propagation to prevent grid from exiting edit
          event.stopPropagation();
        }
      }
      if (rootProps.editMode === 'cell' && event.key === 'Escape') {
        apiRef.current.stopCellEditMode({ id, field, ignoreModifications: true });
      }
    },
    [apiRef, field, id, rootProps.editMode],
  );
  return (
    <GridEditLongTextCellTextarea
      as={rootProps.slots.baseTextarea}
      ownerState={rootProps}
      ref={textareaRef}
      value={valueState ?? ''}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}

export { GridEditLongTextCell };

export const renderEditLongTextCell = (params: GridEditLongTextCellProps) => (
  <GridEditLongTextCell {...params} />
);
