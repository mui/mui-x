# Data Grid - Layout

The Data Grid offers multiple layout modes.

:::error
By default, the Data Grid has **no intrinsic dimensions**.
Instead, it takes up the space given by its parent.
The Data Grid will raise an error in the console if its container has no intrinsic dimensions.
:::

## Flex parent container

The Data Grid can be placed inside a flex container with `flex-direction: column`.
Without setting the minimum and maximum height, the Data Grid takes as much space as it needs to display all rows.

:::warning
Consider setting `maxHeight` on the flex parent container, otherwise row virtualization will not be able to improve performance by limiting the number of elements rendered in the DOM.
:::

```tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function FlexGrid() {
  const [nbRows, setNbRows] = React.useState(3);
  const removeRow = () => setNbRows((x) => Math.max(0, x - 1));
  const addRow = () => setNbRows((x) => Math.min(100, x + 1));

  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button size="small" onClick={removeRow}>
          Remove a row
        </Button>
        <Button size="small" onClick={addRow}>
          Add a row
        </Button>
      </Stack>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <DataGrid {...data} rows={data.rows.slice(0, nbRows)} loading={loading} />
      </div>
    </Box>
  );
}

```

:::success
The flex parent in the demo above is effectively equivalent [`autoHeight`](/x/react-data-grid/layout/#auto-height) prop, but with the added benefit of being able to set the minimum and maximum height of the parent container.
:::

### Minimum and maximum height

In the demo below, the Data Grid is placed inside a flex container with a minimum height of `200px` and a maximum height of `400px` and adapts its height when the number of rows changes.

```tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Typography from '@mui/material/Typography';

const minHeight = 200;
const maxHeight = 400;

export default function MinMaxHeightGrid() {
  const [nbRows, setNbRows] = React.useState(3);
  const removeRow = () => setNbRows((x) => Math.max(0, x - 1));
  const addRow = () => setNbRows((x) => Math.min(100, x + 1));
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button size="small" onClick={removeRow}>
          Remove a row
        </Button>
        <Button size="small" onClick={addRow}>
          Add a row
        </Button>
      </Stack>
      <div style={{ position: 'relative' }} ref={containerRef}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxHeight,
            minHeight,
          }}
        >
          <DataGrid {...data} rows={data.rows.slice(0, nbRows)} loading={loading} />
        </div>

        {/** Visualize max and min container height */}
        <ContainerMeasurements containerRef={containerRef} />
      </div>
    </Box>
  );
}

function ContainerMeasurements({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [containerHeight, setContainerHeight] = React.useState(0);

  React.useEffect(() => {
    const target = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      setContainerHeight(entries[0].contentRect.height);
    });
    if (target) {
      observer.observe(target);
    }
    return () => {
      observer.disconnect();
    };
  }, [containerRef]);

  const label = `${containerHeight}px`;

  if (containerHeight === 0) {
    return null;
  }

  return (
    <Box
      sx={(theme) => ({
        position: 'absolute',
        top: 0,
        left: -20,
        width: 20,
        height: containerHeight,
        borderColor: theme.palette.text.secondary,
        borderStyle: 'dashed',
        borderTopWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
      })}
    >
      <Typography
        sx={(theme) => ({
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'rotate(180deg) translate(0, 50%)',
          writingMode: 'vertical-lr',
          color: theme.palette.text.secondary,
          textWrap: 'nowrap',
          lineHeight: 1.2,
          fontSize: '15px',
        })}
      >
        {label}
      </Typography>
    </Box>
  );
}

```

## Percentage dimensions

When using percentages (%) for height or width, make sure that the Data Grid's parent container has intrinsic dimensions.
Browsers adjust the element based on a percentage of its parent's size.
If the parent has no size, the percentage will be zero.

## Predefined dimensions

You can predefine dimensions for the parent of the Data Grid.

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function FixedSizeGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 5,
    maxColumns: 6,
  });

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 350, width: '100%' }}>
        <DataGrid {...data} />
      </div>
    </div>
  );
}

```

## Overlay height

When data grid has no content, overlays (such as
["Loading"](/x/react-data-grid/overlays/#loading-overlay) or
["No rows"](/x/react-data-grid/overlays/#no-rows-overlay))
take the height of two rows by default.

To customize the overlay height, use the `--DataGrid-overlayHeight` CSS variable.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .no-rows-primary': {
    fill: '#3D4751',
    ...theme.applyStyles('light', {
      fill: '#AEB8C2',
    }),
  },
  '& .no-rows-secondary': {
    fill: '#1D2126',
    ...theme.applyStyles('light', {
      fill: '#E8EAED',
    }),
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={96}
        viewBox="0 0 452 257"
        aria-hidden
        focusable="false"
      >
        <path
          className="no-rows-primary"
          d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
        />
        <path
          className="no-rows-primary"
          d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
        />
        <path
          className="no-rows-primary"
          d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
        />
        <path
          className="no-rows-secondary"
          d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
        />
      </svg>
      <Box sx={{ mt: 2 }}>No rows</Box>
    </StyledGridOverlay>
  );
}

export default function GridOverlayHeight() {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <DataGrid
        columns={[{ field: 'ID' }, { field: 'First name' }, { field: 'Last name' }]}
        rows={[]}
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        sx={{ '--DataGrid-overlayHeight': '300px' }}
      />
    </Box>
  );
}

```

## Auto height

:::error
This prop is deprecated, use the [flex parent container](/x/react-data-grid/layout/#flex-parent-container) instead.
:::

The `autoHeight` prop enables the Data Grid to adjust its size based on its content.
This means that the Data Grid's height will be determined by the number of rows, ensuring that all rows will be visible to the user simultaneously.

```tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function AutoHeightGrid() {
  const [nbRows, setNbRows] = React.useState(3);
  const removeRow = () => setNbRows((x) => Math.max(0, x - 1));
  const addRow = () => setNbRows((x) => Math.min(100, x + 1));

  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button size="small" onClick={removeRow}>
          Remove a row
        </Button>
        <Button size="small" onClick={addRow}>
          Add a row
        </Button>
      </Stack>
      <DataGrid
        autoHeight
        {...data}
        loading={loading}
        rows={data.rows.slice(0, nbRows)}
      />
    </Box>
  );
}

```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
