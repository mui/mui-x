import * as React from 'react';
import {
  DataGrid,
  gridPreferencePanelStateSelector,
  GridPreferencePanelsValue,
  GridSlots,
  GridToolbarV8 as GridToolbar,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import useId from '@mui/utils/useId';

function ColumnsPanelTrigger({
  buttonRef,
}: {
  buttonRef: React.RefObject<HTMLButtonElement>;
}) {
  const buttonId = useId();
  const panelId = useId();
  const apiRef = useGridApiContext();
  const { open, openedPanelValue } = useGridSelector(
    apiRef,
    gridPreferencePanelStateSelector,
  );
  const isOpen = open && openedPanelValue === GridPreferencePanelsValue.columns;

  const toggleColumnsPanel = () => {
    if (isOpen) {
      apiRef.current.hidePreferences();
    } else {
      apiRef.current.showPreferences(
        GridPreferencePanelsValue.columns,
        panelId,
        buttonId,
      );
    }
  };

  return (
    <GridToolbar.Button
      ref={buttonRef}
      id={buttonId}
      aria-haspopup="true"
      aria-expanded={isOpen ? 'true' : undefined}
      aria-controls={isOpen ? panelId : undefined}
      onClick={toggleColumnsPanel}
    >
      <ViewColumnIcon fontSize="small" />
      Columns
    </GridToolbar.Button>
  );
}

type ToolbarProps = GridSlots['toolbar'] & {
  columnsButtonRef: React.RefObject<HTMLButtonElement>;
};

function Toolbar({ columnsButtonRef, ...rest }: ToolbarProps) {
  return (
    <GridToolbar.Root {...rest}>
      <ColumnsPanelTrigger buttonRef={columnsButtonRef} />
    </GridToolbar.Root>
  );
}

export default function GridToolbarColumnsPanelTrigger() {
  const [columnsButtonEl, setColumnsButtonEl] =
    React.useState<HTMLButtonElement | null>(null);

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        slots={{ toolbar: Toolbar as GridSlots['toolbar'] }}
        slotProps={{
          panel: { anchorEl: columnsButtonEl },
          toolbar: {
            columnsButtonRef: setColumnsButtonEl,
          },
        }}
      />
    </div>
  );
}
