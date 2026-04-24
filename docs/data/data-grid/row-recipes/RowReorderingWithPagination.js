import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { alpha } from '@mui/material/styles';
import {
  DataGridPro,
  gridPageSelector,
  gridPageCountSelector,
  useGridApiContext,
  useGridEvent,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const PAGE_TURN_DELAY = 500;

function updateRowPosition(initialIndex, newIndex, rows) {
  const rowsClone = [...rows];
  const row = rowsClone.splice(initialIndex, 1)[0];
  rowsClone.splice(newIndex, 0, row);
  return rowsClone;
}

function Pagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const [isDraggingRow, setIsDraggingRow] = React.useState(false);
  const [pageTurnDirection, setPageTurnDirection] = React.useState(null);
  const pageTurnTimeout = React.useRef(null);

  const clearPageTurnTimeout = React.useCallback(() => {
    if (pageTurnTimeout.current != null) {
      clearTimeout(pageTurnTimeout.current);
      pageTurnTimeout.current = null;
    }
    setPageTurnDirection(null);
  }, []);

  useGridEvent(apiRef, 'rowDragStart', () => {
    setIsDraggingRow(true);
  });

  useGridEvent(apiRef, 'rowDragEnd', () => {
    setIsDraggingRow(false);
    clearPageTurnTimeout();
  });

  React.useEffect(() => clearPageTurnTimeout, [clearPageTurnTimeout]);

  const handleDragOver = React.useCallback(
    (event, targetPage, direction) => {
      if (!isDraggingRow) {
        return;
      }

      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      setPageTurnDirection(direction);

      if (pageTurnTimeout.current != null) {
        return;
      }

      pageTurnTimeout.current = setTimeout(() => {
        apiRef.current.setPage(targetPage);
        pageTurnTimeout.current = null;
        setPageTurnDirection(null);
      }, PAGE_TURN_DELAY);
    },
    [apiRef, isDraggingRow],
  );

  const previousPage = page - 1;
  const nextPage = page + 1;
  const isPreviousDisabled = page === 0;
  const isNextDisabled = page >= pageCount - 1;
  const getItemAriaLabel = apiRef.current.getLocaleText('paginationItemAriaLabel');

  const renderPageButton = ({ direction, disabled, icon, label, targetPage }) => {
    const isDropTarget = pageTurnDirection === direction;

    return (
      <Button
        aria-label={getItemAriaLabel(direction)}
        disabled={disabled}
        onClick={() => apiRef.current.setPage(targetPage)}
        onDragLeave={clearPageTurnTimeout}
        onDragOver={(event) => handleDragOver(event, targetPage, direction)}
        startIcon={direction === 'previous' ? icon : undefined}
        endIcon={direction === 'next' ? icon : undefined}
        sx={(theme) => ({
          '@keyframes pageTurnPulse': {
            '0%': {
              boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.35)}`,
            },
            '100%': {
              boxShadow: `0 0 0 10px ${alpha(theme.palette.primary.main, 0)}`,
            },
          },
          bgcolor: isDropTarget
            ? alpha(theme.palette.primary.main, 0.12)
            : alpha(theme.palette.primary.main, 0.04),
          border: '1px solid',
          borderColor: isDropTarget
            ? theme.palette.primary.main
            : alpha(theme.palette.primary.main, 0.24),
          borderRadius: 999,
          color: 'primary.main',
          fontWeight: 700,
          minWidth: 116,
          px: 1.75,
          py: 0.75,
          position: 'relative',
          textTransform: 'none',
          transform: isDropTarget ? 'translateY(-1px) scale(1.03)' : 'none',
          transition: theme.transitions.create(
            ['background-color', 'border-color', 'box-shadow', 'transform'],
            {
              duration: theme.transitions.duration.shortest,
            },
          ),
          '&::after': {
            border: '1px dashed',
            borderColor: isDropTarget ? 'primary.main' : 'transparent',
            borderRadius: 999,
            content: '""',
            inset: -5,
            pointerEvents: 'none',
            position: 'absolute',
          },
          ...(isDropTarget && {
            animation: 'pageTurnPulse 700ms ease-out infinite',
          }),
        })}
      >
        {label}
      </Button>
    );
  };

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexShrink: 0,
        gap: 1,
        justifyContent: 'flex-end',
        minWidth: 360,
        p: 0.75,
      }}
    >
      {renderPageButton({
        direction: 'previous',
        disabled: isPreviousDisabled,
        icon: <KeyboardArrowLeftIcon fontSize="small" />,
        label: 'Previous',
        targetPage: previousPage,
      })}
      <Box
        sx={(theme) => ({
          alignItems: 'center',
          bgcolor: isDraggingRow
            ? alpha(theme.palette.primary.main, 0.08)
            : 'transparent',
          borderRadius: 999,
          color: isDraggingRow ? 'primary.main' : 'text.secondary',
          display: 'flex',
          fontWeight: isDraggingRow ? 700 : 500,
          minHeight: 34,
          px: 1.5,
          typography: 'body2',
        })}
      >
        {`Page ${page + 1} of ${pageCount}`}
      </Box>
      {renderPageButton({
        direction: 'next',
        disabled: isNextDisabled,
        icon: <KeyboardArrowRightIcon fontSize="small" />,
        label: 'Next',
        targetPage: nextPage,
      })}
    </Box>
  );
}

export default function RowReorderingWithPagination() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 50,
    maxColumns: 6,
  });

  const [rows, setRows] = React.useState(data.rows);

  React.useEffect(() => {
    setRows(data.rows);
  }, [data.rows]);

  const handleRowOrderChange = React.useCallback((params) => {
    setRows((prevRows) =>
      updateRowPosition(params.oldIndex, params.targetIndex, prevRows),
    );
  }, []);

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        rows={rows}
        pagination
        rowReordering
        onRowOrderChange={handleRowOrderChange}
        initialState={{
          ...data.initialState,
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5]}
        slots={{
          pagination: Pagination,
        }}
      />
    </Box>
  );
}
