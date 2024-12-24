import * as React from 'react';
import clsx from 'clsx';
import { DataGrid, Grid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import ClearIcon from '@mui/icons-material/Clear';

const Button = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(function Button(props, ref) {
  return (
    <button
      ref={ref}
      type="button"
      {...props}
      className={clsx(
        'flex h-9 items-center justify-center rounded border border-gray-200 bg-gray-50 px-2.5 text-sm font-medium text-gray-900 whitespace-nowrap select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-600 active:bg-gray-100',
        props.className,
      )}
    />
  );
});

const TextInput = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLInputElement>
>(function Input(props, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={clsx(
        'h-9 rounded border border-gray-200 px-2.5 text-base text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-blue-600',
        props.className,
      )}
    />
  );
});

function Toolbar() {
  return (
    <Grid.Toolbar.Root>
      <Grid.QuickFilter.Root>
        <Grid.QuickFilter.Control
          aria-label="Search"
          placeholder="Search"
          render={<TextInput className="w-56" />}
        />
        <Grid.QuickFilter.Clear
          render={
            <Button aria-label="Clear">
              <ClearIcon className="text-sm" />
            </Button>
          }
        />
      </Grid.QuickFilter.Root>
    </Grid.Toolbar.Root>
  );
}

export default function GridQuickFilterCustom() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} loading={loading} slots={{ toolbar: Toolbar }} />
    </div>
  );
}
