/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  unstable_composeClasses as composeClasses,
  unstable_ownerDocument as ownerDocument,
  unstable_capitalize as capitalize,
} from '@mui/utils';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import {
  GridCellEventLookup,
  GridEvents,
  GridCellMode,
  GridCellModes,
  GridRowId,
} from '../../models';
import { GridAlignment } from '../../models/colDef/gridColDef';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { FocusElement } from '../../models/params/gridCellParams';

export interface GridCellProps<V = any, F = V> {
  align: GridAlignment;
  className?: string;
  colIndex: number;
  field: string;
  rowId: GridRowId;
  formattedValue?: F;
  hasFocus?: boolean;
  height: number | 'auto';
  isEditable?: boolean;
  isOutlined?: boolean;
  isSelected?: boolean;
  showRightBorder?: boolean;
  value?: V;
  width: number;
  cellMode?: GridCellMode;
  children: React.ReactNode;
  tabIndex: 0 | -1;
  colSpan?: number;
  disableDragEvents?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onDragEnter?: React.DragEventHandler<HTMLDivElement>;
  onDragOver?: React.DragEventHandler<HTMLDivElement>;
  [x: string]: any; // TODO it should not accept unspecified props
}

// Based on https://stackoverflow.com/a/59518678
let cachedSupportsPreventScroll: boolean;
function doesSupportPreventScroll(): boolean {
  if (cachedSupportsPreventScroll === undefined) {
    document.createElement('div').focus({
      get preventScroll() {
        cachedSupportsPreventScroll = true;
        return false;
      },
    });
  }
  return cachedSupportsPreventScroll;
}

type OwnerState = Pick<
  GridCellProps,
  'align' | 'showRightBorder' | 'isEditable' | 'isOutlined' | 'isSelected'
> & {
  classes?: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { align, isOutlined, showRightBorder, isEditable, isSelected, classes } = ownerState;

  const slots = {
    root: [
      'cell',
      `cell--text${capitalize(align)}`,
      isOutlined && `cell--outlined`,
      isEditable && 'cell--editable',
      isSelected && 'selected',
      showRightBorder && 'cell--withRightBorder',
      'withBorderColor',
    ],
    content: ['cellContent'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridCell(props: GridCellProps) {
  const {
    align,
    children,
    colIndex,
    colDef,
    cellMode,
    field,
    formattedValue,
    hasFocus,
    height,
    isEditable,
    isOutlined,
    isSelected,
    rowId,
    tabIndex,
    value,
    width,
    className,
    showRightBorder,
    extendRowFullWidth,
    row,
    colSpan,
    disableDragEvents,
    onClick,
    onDoubleClick,
    onMouseDown,
    onMouseUp,
    onMouseOver,
    onKeyDown,
    onFocus,
    onBlur,
    onKeyUp,
    onDragEnter,
    onDragOver,
    ...other
  } = props;

  const valueToRender = formattedValue == null ? value : formattedValue;
  const cellRef = React.useRef<HTMLDivElement>(null);
  const focusElementRef = React.useRef<FocusElement>(null);
  const apiRef = useGridApiContext();

  const rootProps = useGridRootProps();
  const ownerState = {
    align,
    showRightBorder,
    isEditable,
    classes: rootProps.classes,
    isSelected,
    isOutlined,
  };
  const classes = useUtilityClasses(ownerState);

  const publishMouseUp = React.useCallback(
    (eventName: GridEvents) => (event: React.MouseEvent<HTMLDivElement>) => {
      const params = apiRef.current.getCellParams(rowId, field || '');
      apiRef.current.publishEvent(eventName as any, params as any, event);

      if (onMouseUp) {
        onMouseUp(event);
      }
    },
    [apiRef, field, onMouseUp, rowId],
  );

  const publishMouseDown = React.useCallback(
    (eventName: GridEvents) => (event: React.MouseEvent<HTMLDivElement>) => {
      const params = apiRef.current.getCellParams(rowId, field || '');
      apiRef.current.publishEvent(eventName as any, params as any, event);

      if (onMouseDown) {
        onMouseDown(event);
      }
    },
    [apiRef, field, onMouseDown, rowId],
  );

  const publish = React.useCallback(
    (eventName: keyof GridCellEventLookup, propHandler: any) =>
      (event: React.SyntheticEvent<HTMLDivElement>) => {
        // Ignore portal
        if (!event.currentTarget.contains(event.target as Element)) {
          return;
        }

        // The row might have been deleted during the click
        if (!apiRef.current.getRow(rowId)) {
          return;
        }

        const params = apiRef.current.getCellParams(rowId!, field || '');
        apiRef.current.publishEvent(eventName, params, event as any);

        if (propHandler) {
          propHandler(event);
        }
      },
    [apiRef, field, rowId],
  );

  const style = {
    minWidth: width,
    maxWidth: width,
    minHeight: height,
    maxHeight: height === 'auto' ? 'none' : height, // max-height doesn't support "auto"
  };

  React.useEffect(() => {
    if (!hasFocus || cellMode === GridCellModes.Edit) {
      return;
    }

    const doc = ownerDocument(apiRef.current.rootElementRef!.current)!;

    if (cellRef.current && !cellRef.current.contains(doc.activeElement!)) {
      const focusableElement = cellRef.current!.querySelector<HTMLElement>('[tabindex="0"]');
      const elementToFocus = focusElementRef.current || focusableElement || cellRef.current;

      if (doesSupportPreventScroll()) {
        elementToFocus.focus({ preventScroll: true });
      } else {
        const scrollPosition = apiRef.current.getScrollPosition();
        elementToFocus.focus();
        apiRef.current.scroll(scrollPosition);
      }
    }
  }, [hasFocus, cellMode, apiRef]);

  const column = apiRef.current.getColumn(field);
  const managesOwnFocus = column.type === 'actions';

  const renderChildren = () => {
    if (children === undefined) {
      return <div className={classes.content}>{valueToRender?.toString()}</div>;
    }

    if (React.isValidElement(children) && managesOwnFocus) {
      return React.cloneElement<any>(children, { focusElementRef });
    }

    return children;
  };

  const draggableEventHandlers = disableDragEvents
    ? null
    : {
        onDragEnter: publish('cellDragEnter', onDragEnter),
        onDragOver: publish('cellDragOver', onDragOver),
      };

  return (
    <div
      ref={cellRef}
      className={clsx(className, classes.root)}
      role="cell"
      data-field={field}
      data-colindex={colIndex}
      aria-colindex={colIndex + 1}
      aria-colspan={colSpan}
      style={style}
      tabIndex={(cellMode === 'view' || !isEditable) && !managesOwnFocus ? tabIndex : -1}
      onClick={publish('cellClick', onClick)}
      onDoubleClick={publish('cellDoubleClick', onDoubleClick)}
      onMouseOver={publish('cellMouseOver', onMouseOver)}
      onMouseDown={publishMouseDown('cellMouseDown')}
      onMouseUp={publishMouseUp('cellMouseUp')}
      onKeyDown={publish('cellKeyDown', onKeyDown)}
      onBlur={publish('cellBlur', onBlur)}
      onFocus={publish('cellFocus', onFocus)}
      onKeyUp={publish('cellKeyUp', onKeyUp)}
      {...draggableEventHandlers}
      {...other}
    >
      {renderChildren()}
    </div>
  );
}

GridCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  align: PropTypes.oneOf(['center', 'left', 'right']).isRequired,
  cellMode: PropTypes.oneOf(['edit', 'view']),
  children: PropTypes.node,
  className: PropTypes.string,
  colIndex: PropTypes.number.isRequired,
  colSpan: PropTypes.number,
  disableDragEvents: PropTypes.bool,
  field: PropTypes.string.isRequired,
  formattedValue: PropTypes.any,
  hasFocus: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]).isRequired,
  isEditable: PropTypes.bool,
  isOutlined: PropTypes.bool,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragOver: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  rowId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  showRightBorder: PropTypes.bool,
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  value: PropTypes.any,
  width: PropTypes.number.isRequired,
} as any;

export { GridCell };
