# Data Grid - Copy and paste

Copy and paste data using clipboard.

## Clipboard copy

You can copy selected grid data to the clipboard using the <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">C</kbd></kbd> (<kbd><kbd class="key">⌘ Command</kbd>+<kbd class="key">C</kbd></kbd> on macOS) keyboard shortcut.
The copied cell values are separated by a tab (`\t`) character and the rows are separated by a new line (`\n`) character.

The priority of the data copied to the clipboard is the following, from highest to lowest:

1. If more than one cell is selected (see [Cell selection<span class="plan-premium" title="Premium plan"></span>](/x/react-data-grid/cell-selection/)), the selected cells are copied
2. If one or more rows are selected (see [Row selection](/x/react-data-grid/row-selection/)), the selected rows are copied
3. If there is a single cell selected, the single cell is copied

```tsx
import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function ClipboardCopy() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 20,
  });

  const [copiedData, setCopiedData] = React.useState('');

  const initialState = {
    ...data.initialState,
    columns: {
      columnVisibilityModel: {
        id: false,
        desk: false,
      },
    },
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 400 }}>
        <DataGridPremium
          {...data}
          initialState={initialState}
          checkboxSelection
          disableRowSelectionOnClick
          cellSelection
          onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
          ignoreValueFormatterDuringExport
        />
      </div>
      <Alert severity="info" sx={{ width: '100%', mt: 1 }}>
        <AlertTitle>Copied data:</AlertTitle>
        <code
          style={{
            display: 'block',
            maxHeight: 200,
            overflow: 'auto',
            whiteSpace: 'pre-line',
          }}
        >
          {copiedData}
        </code>
      </Alert>
    </div>
  );
}

```

## Clipboard paste [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

:::info

<details style="margin: 0">
  <summary markdown="span">Video preview</summary>
  <video muted loop playsinline controls style="margin-top: 8px">
    <source src="https://github-production-user-asset-6210df.s3.amazonaws.com/13808724/237996024-abfcb5c6-9db6-4677-9ba7-ae97de441080.mov" type="video/mp4" />
  </video>
</details>
:::

:::warning
To make sure the copied cells are formatted correctly and can be parsed,
it is recommended to set the `ignoreValueFormatterDuringExport` prop to `true`.
During clipboard copy operation, the raw cell values will be copied instead of the formatted values,
so that the values can be parsed correctly during the paste operation.

```tsx
<DataGridPremium ignoreValueFormatterDuringExport />
```

:::

You can paste data from clipboard using the <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">V</kbd></kbd> (<kbd><kbd class="key">⌘ Command</kbd>+<kbd class="key">V</kbd></kbd> on macOS) keyboard shortcut.
The paste operation only affects cells in the columns that are [`editable`](/x/react-data-grid/editing/#making-a-column-editable).

Same as with editing, you can use `valueParser` to modify the pasted value and `valueSetter` to update the row with new values.
See [Value parser and value setter](/x/react-data-grid/editing/#value-parser-and-value-setter) section of the editing documentation for more details.

The behavior of the clipboard paste operation depends on the selection state of the Data Grid and the data pasted from clipboard.
The priority is the following, from highest to lowest:

1. If multiple cells are selected (see [Cell selection<span class="plan-premium" title="Premium plan"></span>](/x/react-data-grid/cell-selection/)), the selected cells are updated with the pasted values.
2. If one or more rows are selected (see [Row selection](/x/react-data-grid/row-selection/)), the selected rows are updated with the pasted values.
3. If a single cell is selected, the values are pasted starting from the selected cell.

```tsx
import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ClipboardPaste() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 20,
    editable: true,
  });

  const initialState = {
    ...data.initialState,
    columns: {
      columnVisibilityModel: {
        id: false,
        desk: false,
      },
    },
  };

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        loading={loading}
        initialState={initialState}
        checkboxSelection
        disableRowSelectionOnClick
        ignoreValueFormatterDuringExport
        cellSelection
      />
    </div>
  );
}

```

### Disable clipboard paste

To disable clipboard paste, set the `disableClipboardPaste` prop to `true`:

```tsx
import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ClipboardPasteDisabled() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 6,
    editable: true,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium {...data} disableClipboardPaste />
    </div>
  );
}

```

### Persisting pasted data

Clipboard paste uses the same API for persistence as [Editing](/x/react-data-grid/editing/persistence/)—use the `processRowUpdate` prop to persist the updated row in your data source:

```tsx
processRowUpdate?: (newRow: R, oldRow: R) => Promise<R> | R;
```

The row will be updated with a value returned by the `processRowUpdate` callback.
If the callback throws or returns a rejected promise, the row will not be updated.

The demo below shows how to persist the pasted data in the browser's `sessionStorage`.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridValidRowModel,
  DataGridPremiumProps,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';

const initialRows = [
  {
    id: '9feb3743-fbf1-585b-ae15-25a1e91126d1',
    desk: 'D-7702',
    commodity: 'Frozen Concentrated Orange Juice',
    traderName: 'Jeffrey Nichols',
    traderEmail: 'weg@tozezew.mz',
    quantity: 22542,
    filledQuantity: 0.6027859107443883,
  },
  {
    id: '6aa80501-f0f1-50e4-95d9-94eac5536d24',
    desk: 'D-5855',
    commodity: 'Oats',
    traderName: 'Henrietta Gill',
    traderEmail: 'ha@ovuewadip.ca',
    quantity: 39244,
    filledQuantity: 0.5139893996534503,
  },
  {
    id: 'd4d49ff6-9a37-5490-94b3-c3dea5c8f787',
    desk: 'D-8853',
    commodity: 'Cocoa',
    traderName: 'Harriet Peters',
    traderEmail: 'wezbibil@meced.pt',
    quantity: 81111,
    filledQuantity: 0.24879486136282378,
  },
  {
    id: '1db4a0e5-aca2-5ae7-89f1-aca3756c6c2c',
    desk: 'D-3882',
    commodity: 'Wheat',
    traderName: 'Polly Sims',
    traderEmail: 'ujaacazas@pobgag.ye',
    quantity: 91665,
    filledQuantity: 0.7220967653957344,
  },
  {
    id: 'cc24d3fc-0d9b-56f1-8cdd-89199092e711',
    desk: 'D-94',
    commodity: 'Sugar No.14',
    traderName: 'Jim Pratt',
    traderEmail: 'irno@re.iq',
    quantity: 98763,
    filledQuantity: 0.9177019734110953,
  },
  {
    id: '181ae856-c185-5895-a996-9ed822f31721',
    desk: 'D-8570',
    commodity: 'Frozen Concentrated Orange Juice',
    traderName: 'Erik Kelley',
    traderEmail: 'pado@dawom.ar',
    quantity: 8524,
    filledQuantity: 0.5193571093383388,
  },
  {
    id: '3a199260-246e-5bb7-a20e-04d4dfae798d',
    desk: 'D-2253',
    commodity: 'Adzuki bean',
    traderName: 'Victor Howell',
    traderEmail: 'zi@orager.cl',
    quantity: 60806,
    filledQuantity: 0.9243989080024998,
  },
  {
    id: 'ad1bdfe2-4dbd-58bb-b432-f4c50b2e8de8',
    desk: 'D-6307',
    commodity: 'Soybeans',
    traderName: 'Ethan Clark',
    traderEmail: 'wij@nepocreh.tt',
    quantity: 48391,
    filledQuantity: 0.7982062780269058,
  },
  {
    id: '6040095c-da9b-507f-8bc2-5c0511019d2c',
    desk: 'D-2429',
    commodity: 'Corn',
    traderName: 'Katie Long',
    traderEmail: 'doga@raecu.gg',
    quantity: 51252,
    filledQuantity: 0.08549910247404979,
  },
  {
    id: '1f90134c-c9b0-556f-b60b-cd7d150f124c',
    desk: 'D-4598',
    commodity: 'Soybeans',
    traderName: 'Etta Marsh',
    traderEmail: 'riztuw@rol.jo',
    quantity: 59123,
    filledQuantity: 0.619099166145155,
  },
  {
    id: 'f3fb76f5-82b4-562e-b873-bec5f9a09e07',
    desk: 'D-9116',
    commodity: 'Soybean Meal',
    traderName: 'Emma Wilkerson',
    traderEmail: 'vispuhgoh@adkimac.kr',
    quantity: 4861,
    filledQuantity: 0.756222999382843,
  },
  {
    id: '468f03c0-ee5a-51d4-807e-e65b108ed7ca',
    desk: 'D-9046',
    commodity: 'Robusta coffee',
    traderName: 'Douglas Boone',
    traderEmail: 'givuce@jisalta.jp',
    quantity: 41630,
    filledQuantity: 0.5862118664424694,
  },
  {
    id: '856c6022-f062-57fe-a618-b8a044d94995',
    desk: 'D-5940',
    commodity: 'Coffee C',
    traderName: 'Delia Collins',
    traderEmail: 'ga@pukop.kg',
    quantity: 42184,
    filledQuantity: 0.17279063151905935,
  },
  {
    id: 'e67a7da2-623e-5a37-afe7-d9d61f6c6707',
    desk: 'D-166',
    commodity: 'Oats',
    traderName: 'Carl Allison',
    traderEmail: 'biviv@loucu.jm',
    quantity: 42818,
    filledQuantity: 0.24769956560325096,
  },
  {
    id: 'fde4e74d-77f8-5325-8401-8093cea3b48d',
    desk: 'D-2177',
    commodity: 'Soybean Oil',
    traderName: 'Jeffrey Stone',
    traderEmail: 'vaj@wazvi.fr',
    quantity: 66766,
    filledQuantity: 0.3001977054189258,
  },
  {
    id: '874e66e5-435d-555c-9ccf-4a776446b1c3',
    desk: 'D-1732',
    commodity: 'Oats',
    traderName: 'Jason Holland',
    traderEmail: 'lef@nameteh.com',
    quantity: 79141,
    filledQuantity: 0.3829999620929733,
  },
  {
    id: '95379b05-69e2-56da-997c-3e5c3892af8d',
    desk: 'D-5479',
    commodity: 'Rapeseed',
    traderName: 'Alfred Cortez',
    traderEmail: 'loeg@ufooni.eu',
    quantity: 77715,
    filledQuantity: 0.35680370584829185,
  },
  {
    id: 'b71a1c39-dd89-59e4-90ed-0eba4708d2bf',
    desk: 'D-7786',
    commodity: 'Frozen Concentrated Orange Juice',
    traderName: 'Eddie Olson',
    traderEmail: 'sigjap@vas.sc',
    quantity: 78507,
    filledQuantity: 0.7016953902199804,
  },
  {
    id: '8d3305fd-40a5-5b91-a677-7c3a12f42abb',
    desk: 'D-3166',
    commodity: 'Frozen Concentrated Orange Juice',
    traderName: 'Louisa Coleman',
    traderEmail: 'nezcen@mihrotab.pa',
    quantity: 47797,
    filledQuantity: 0.16090968052388224,
  },
  {
    id: '1da5290b-1990-58a5-bcba-bd0ab6a38ce9',
    desk: 'D-6935',
    commodity: 'Soybean Oil',
    traderName: 'Franklin Barrett',
    traderEmail: 'be@fejafo.au',
    quantity: 95833,
    filledQuantity: 0.47529556624544783,
  },
];

const visibleFields = [
  'commodity',
  'traderName',
  'traderEmail',
  'quantity',
  'filledQuantity',
];

const useSessionStorageData = () => {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 0,
    maxColumns: 7,
    editable: true,
    visibleFields,
  });

  const [rows] = React.useState(() => {
    try {
      const lsData = sessionStorage.getItem('clipboardImportRows');
      if (lsData) {
        const parsedData = JSON.parse(lsData);
        if (Array.isArray(parsedData)) {
          return parsedData;
        }
      }
    } catch (error) {
      // session storage is not available
    }
    return initialRows;
  });

  const rowsRef = React.useRef([...rows]);

  const updateRow = React.useCallback((newRow: GridValidRowModel) => {
    const index = rowsRef.current.findIndex((row) => row.id === newRow.id);
    rowsRef.current[index] = newRow;
    sessionStorage.setItem('clipboardImportRows', JSON.stringify(rowsRef.current));
  }, []);

  return {
    data: { ...data, rows },
    updateRow,
  };
};

export default function ClipboardPastePersistence() {
  const { data, updateRow } = useSessionStorageData();

  const processRowUpdate: NonNullable<DataGridPremiumProps['processRowUpdate']> = (
    newRow,
  ) => {
    updateRow(newRow);
    return newRow;
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: 8 }}>
        <Button onClick={() => sessionStorage.removeItem('clipboardImportRows')}>
          Clear session storage
        </Button>
      </div>
      <div style={{ height: 400 }}>
        <DataGridPremium
          {...data}
          disableRowSelectionOnClick
          checkboxSelection
          cellSelection
          processRowUpdate={processRowUpdate}
          ignoreValueFormatterDuringExport
        />
      </div>
    </div>
  );
}

```

### Events

The following events are fired during the clipboard paste operation:

- `clipboardPasteStart` - fired when the clipboard paste operation starts
- `clipboardPasteEnd` - fired when all row updates from clipboard paste have been processed

For convenience, you can also listen to these events using their respective props:

- `onClipboardPasteStart`
- `onClipboardPasteEnd`

Additionally, there is the `onBeforeClipboardPasteStart` prop, which is called before the clipboard paste operation starts
and can be used to cancel or confirm the paste operation:

```tsx
const onBeforeClipboardPasteStart = async () => {
  const confirmed = window.confirm('Are you sure you want to paste?');
  if (!confirmed) {
    throw new Error('Paste operation cancelled');
  }
};

<DataGridPremium onBeforeClipboardPasteStart={onBeforeClipboardPasteStart} />;
```

The demo below uses the [`Dialog`](/material-ui/react-dialog/) component for paste confirmation.
If confirmed, the Data Grid displays a loading indicator during the paste operation.

```tsx
import * as React from 'react';
import { DataGridPremium, DataGridPremiumProps } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export default function ClipboardPasteEvents() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 6,
    editable: true,
  });
  const [loading, setLoading] = React.useState(false);

  const processRowUpdate = React.useCallback<
    NonNullable<DataGridPremiumProps['processRowUpdate']>
  >(async (newRow) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    return newRow;
  }, []);

  const initialState = {
    ...data.initialState,
    columns: {
      columnVisibilityModel: {
        id: false,
        desk: false,
      },
    },
  };

  const confirm = useConfirm();
  const confirmPaste = React.useCallback<() => Promise<void>>(() => {
    return new Promise((resolve, reject) => {
      confirm.open((confirmed) => {
        if (confirmed) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }, [confirm]);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGridPremium
        {...data}
        loading={loading}
        initialState={initialState}
        cellSelection
        processRowUpdate={processRowUpdate}
        onBeforeClipboardPasteStart={confirmPaste}
        onClipboardPasteStart={() => setLoading(true)}
        onClipboardPasteEnd={() => setLoading(false)}
        ignoreValueFormatterDuringExport
        disableRowSelectionOnClick
      />

      <Dialog
        open={confirm.isOpen}
        onClose={confirm.cancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you want to paste?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This will overwrite the selected cells.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirm.cancel}>Cancel</Button>
          <Button onClick={confirm.confirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const useConfirm = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const callbackRef = React.useRef<((confirmed: boolean) => void) | null>(null);

  const open = React.useCallback((callback: (confirmed: boolean) => void) => {
    setIsOpen(true);
    callbackRef.current = callback;
  }, []);

  const cancel = React.useCallback(() => {
    setIsOpen(false);
    callbackRef.current?.(false);
    callbackRef.current = null;
  }, []);

  const confirm = React.useCallback(() => {
    setIsOpen(false);
    callbackRef.current?.(true);
    callbackRef.current = null;
  }, []);

  return {
    open,
    isOpen,
    cancel,
    confirm,
  };
};

```

## Format of the clipboard data

By default, the clipboard copy and paste operations use the following format:

- The cell values are separated by a tab (`\t`) character.
- The rows are separated by a new line (`\n`) character.

You can use `clipboardCopyCellDelimiter` and `splitClipboardPastedText` props to change the format:

```tsx
<DataGridPremium
  {...otherProps}
  // support comma separated values
  clipboardCopyCellDelimiter={','}
  splitClipboardPastedText={(text) => text.split('\n').map((row) => row.split(','))}
/>
```

The demo below uses `,` (comma) character as a cell delimiter for both copy and paste operations:

```tsx
import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ClipboardPasteDelimiter() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 20,
    editable: true,
  });

  const initialState = {
    ...data.initialState,
    columns: {
      columnVisibilityModel: {
        id: false,
        desk: false,
      },
    },
  };

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        initialState={initialState}
        disableRowSelectionOnClick
        ignoreValueFormatterDuringExport
        cellSelection
        clipboardCopyCellDelimiter={','}
        splitClipboardPastedText={(text) =>
          text.split('\n').map((row) => row.split(','))
        }
      />
    </div>
  );
}

```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
