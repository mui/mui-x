import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {
  DataGridPro,
  useGridSelector,
  gridFilterModelSelector,
  useGridApiContext,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

function CustomHeaderFilter(props) {
  const { colDef, width, height, hasFocus, colIndex, tabIndex } = props;
  const apiRef = useGridApiContext();
  const cellRef = React.useRef(null);

  React.useLayoutEffect(() => {
    if (hasFocus && cellRef.current) {
      const focusableElement = cellRef.current.querySelector('[tabindex="0"]');
      const elementToFocus = focusableElement || cellRef.current;
      elementToFocus?.focus();
    }
  }, [apiRef, hasFocus]);

  const publish = React.useCallback(
    (eventName, propHandler) => (event) => {
      apiRef.current.publishEvent(
        eventName,
        apiRef.current.getColumnHeaderParams(colDef.field),
        event,
      );

      if (propHandler) {
        propHandler(event);
      }
    },
    [apiRef, colDef.field],
  );

  const onMouseDown = React.useCallback(
    (event) => {
      if (!hasFocus) {
        cellRef.current?.focus();
        apiRef.current.setColumnHeaderFilterFocus(colDef.field, event);
      }
    },
    [apiRef, colDef.field, hasFocus],
  );

  const mouseEventsHandlers = React.useMemo(
    () => ({
      onKeyDown: publish('headerFilterKeyDown'),
      onClick: publish('headerFilterClick'),
      onMouseDown: publish('headerFilterMouseDown', onMouseDown),
    }),
    [publish, onMouseDown],
  );

  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const activeFiltersCount =
    filterModel.items?.filter(({ field }) => field === colDef.field).length ?? 0;

  return (
    <Stack
      sx={[
        {
          borderTop: `1px solid var(--DataGrid-rowBorderColor)`,
        },
        hasFocus
          ? {
              outline: 'solid #1976d2 1px',
              outlineOffset: -2,
            }
          : {
              outline: '',
              outlineOffset: 0,
            },
      ]}
      tabIndex={tabIndex}
      ref={cellRef}
      data-field={colDef.field}
      width={width}
      height={height}
      justifyContent="center"
      alignItems="center"
      role="columnheader"
      aria-colindex={colIndex + 1}
      aria-label={colDef.headerName ?? colDef.field}
      {...mouseEventsHandlers}
    >
      <Button
        centerRipple={false}
        onClick={() => apiRef.current.showFilterPanel(colDef.field)}
      >
        {activeFiltersCount > 0 ? `${activeFiltersCount} active` : 'Add'} filters
      </Button>
    </Stack>
  );
}

export default function CustomHeaderFilterDataGridPro() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        initialState={{
          ...data.initialState,
          columns: {
            columnVisibilityModel: {
              avatar: false,
              id: false,
            },
          },
        }}
        slots={{
          headerFilterCell: CustomHeaderFilter,
        }}
        headerFilters
      />
    </div>
  );
}
