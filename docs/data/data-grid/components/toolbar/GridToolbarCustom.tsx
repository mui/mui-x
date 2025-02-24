import * as React from 'react';
import clsx from 'clsx';
import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  ExportCsv,
  ExportPrint,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { TailwindDemoContainer } from '@mui/x-data-grid/internals';
import ClearIcon from '@mui/icons-material/Clear';

function Button(props: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={clsx(
        'flex h-9 items-center justify-center rounded border border-gray-200 bg-gray-50 px-2.5 text-sm font-medium text-gray-900 whitespace-nowrap select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-600 active:bg-gray-100',
        props.className,
      )}
    />
  );
}

function TextInput(props: React.HTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        'h-9 rounded border border-gray-200 px-2.5 text-base text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-blue-600',
        props.className,
      )}
    />
  );
}

function CustomToolbar() {
  return (
    <Toolbar className="flex gap-2 p-2 border-b border-gray-200">
      <ColumnsPanelTrigger
        render={<ToolbarButton render={<Button>Columns</Button>} />}
      />
      <FilterPanelTrigger
        render={<ToolbarButton render={<Button>Filter</Button>} />}
      />
      <ExportCsv render={<ToolbarButton render={<Button>Export CSV</Button>} />} />
      <ExportPrint render={<ToolbarButton render={<Button>Print</Button>} />} />
      <QuickFilter>
        <div className="flex ml-auto">
          <QuickFilterControl
            aria-label="Search"
            placeholder="Search"
            render={<TextInput className="w-56 rounded-r-none border-r-0" />}
          />
          <QuickFilterClear
            render={
              <Button aria-label="Clear" className="rounded-l-none">
                <ClearIcon className="text-sm" />
              </Button>
            }
          />
        </div>
      </QuickFilter>
    </Toolbar>
  );
}

export default function GridToolbarCustom({ window }: { window: () => Window }) {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  // This is used only for the example, you can remove it.
  const documentBody = window !== undefined ? window().document.body : undefined;

  return (
    <div style={{ height: 400, width: '100%' }}>
      <TailwindDemoContainer documentBody={documentBody}>
        <DataGrid {...data} loading={loading} slots={{ toolbar: CustomToolbar }} />
      </TailwindDemoContainer>
    </div>
  );
}
