# Data Grid - State

Initialize and read the state of the Data Grid.

## Initialize the state

Some state keys can be initialized with the `initialState` prop.
This prop has the same format as the returned value of `apiRef.current.exportState()`.

:::warning
The `initialState` can only be used to set the initial value of the state.
The Data Grid will not react if you change the `initialState` value later on.

If you need to fully control specific models, use the control props instead (for example [`prop.filterModel`](/x/react-data-grid/filtering/#controlled-filters) or [`prop.sortModel`](/x/react-data-grid/sorting/#controlled-sort-model)).
You can find more information on the corresponding feature documentation page.
:::

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function InitialState() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        initialState={{
          ...data.initialState,
          filter: {
            filterModel: {
              items: [{ field: 'quantity', operator: '>', value: 10000 }],
            },
          },
          sorting: {
            sortModel: [{ field: 'desk', sort: 'asc' }],
          },
        }}
      />
    </div>
  );
}

```

## Access the state

The state is exposed on the `apiRef` object.

:::warning
Do not access state values directly.
The state itself is not considered a public API and its structure can change.
:::

Data Grid packages expose a set of state selectors that take the `apiRef` as an argument and return a value.
You can use them to get data from the state without worrying about its internal structure.

### Direct selector access

The way to use a selector is to call it as a function with `apiRef` as its first argument:

```tsx
const paginationModel = gridPaginationModelSelector(apiRef);
```

:::warning
To make the developer experience better, selectors are typed to allow `apiRef` to reference a `null` value, but they throw an error if called before the state is initialized. Use selectors after the initialization in a `useEffect()` hook or in an event handler.
:::

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  DataGrid,
  useGridApiRef,
  gridPaginatedVisibleSortedGridRowIdsSelector,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function DirectSelector() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 10,
  });

  const apiRef = useGridApiRef();

  const handleSelectFirstVisibleRow = () => {
    const visibleRows = gridPaginatedVisibleSortedGridRowIdsSelector(apiRef);
    if (visibleRows.length === 0) {
      return;
    }

    apiRef.current?.selectRow(
      visibleRows[0],
      !apiRef.current.isRowSelected(visibleRows[0]),
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Button size="small" onClick={handleSelectFirstVisibleRow}>
        Toggle the selection of the 1st row of the page
      </Button>
      <Box sx={{ height: 400, mt: 1 }}>
        <DataGrid
          {...data}
          loading={loading}
          apiRef={apiRef}
          pageSizeOptions={[10]}
          initialState={{
            ...data.initialState,
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}

```

### With useGridSelector

If you only need to access the state value in the render of your components, use the `useGridSelector()` hook.
This hook ensures there is a reactive binding such that when the state changes, the component in which this hook is used is re-rendered.

```tsx
const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
```

:::warning
This hook can only be used inside the context of the Data Grid, such as within custom components.
Otherwise, you will get an error saying that the state is not initialized during the first render.
:::

```tsx
import * as React from 'react';
import {
  DataGrid,
  gridPageSelector,
  gridPageCountSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Pagination from '@mui/material/Pagination';

function Toolbar() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      sx={(theme) => ({ padding: theme.spacing(1.5, 0) })}
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

export default function UseGridSelector() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 10,
  });

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        hideFooter
        slots={{
          toolbar: Toolbar,
        }}
        showToolbar
      />
    </div>
  );
}

```

### Catalog of selectors

Some selectors have not yet been documented.



## Save and restore the state

The current state of the Data Grid can be exported using `apiRef.current.exportState()`.
It can then be restored by either passing the returned value to the `initialState` prop or to the `apiRef.current.restoreState()` method.

Watch out for controlled models and their callbacks (`onFilterModelChange` if you use `filterModel`, for instance), as the Data Grid calls those callbacks when restoring the state.
But if the callback is not defined or if calling it does not update the prop value, then the restored value will not be applied.

### Restore the state with initialState

You can pass the state returned by `apiRef.current.exportState()` to the `initialState` prop.

In the demo below, clicking on **Recreate the 2nd grid** will re-mount the second Data Grid with the current state of the first Grid.

```tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {
  DataGridPro,
  GridInitialState,
  GridSlotProps,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  useGridApiContext,
  useGridRootProps,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    syncState: (stateToSave: GridInitialState) => void;
  }
}

function GridCustomToolbar({ syncState }: GridSlotProps['toolbar']) {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Button
        size="small"
        startIcon={<rootProps.slots.columnSelectorIcon />}
        onClick={() => syncState(apiRef.current.exportState())}
        {...rootProps.slotProps?.baseButton}
      >
        Recreate the 2nd grid
      </Button>
    </GridToolbarContainer>
  );
}

export default function RestoreStateInitialState() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const [savedState, setSavedState] = React.useState<{
    count: number;
    initialState: GridInitialState;
  }>({ count: 0, initialState: data.initialState! });

  const syncState = React.useCallback((newInitialState: GridInitialState) => {
    setSavedState((prev) => ({
      count: prev.count + 1,
      initialState: newInitialState,
    }));
  }, []);

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Box sx={{ height: 336 }}>
        <DataGridPro
          {...data}
          loading={loading}
          slots={{ toolbar: GridCustomToolbar }}
          slotProps={{ toolbar: { syncState } }}
          showToolbar
        />
      </Box>
      <Box sx={{ height: 300 }}>
        <DataGridPro
          {...data}
          loading={loading}
          initialState={savedState.initialState}
          key={savedState.count}
        />
      </Box>
    </Stack>
  );
}

```

:::warning
If you restore the page using `initialState` before the data is fetched, the Data Grid will automatically move to the first page.
:::

### Save and restore the state from external storage

You can use `apiRef.current.exportState()` to save a snapshot of the state to an external storage (for example using local storage or redux).
This way the state can be persisted on refresh or navigating to another page.

In the following demo, the state is saved to `localStorage` and restored when the page is refreshed.
This is done by listening on the `beforeunload` event.
When the component is unmounted, the `useLayoutEffect` cleanup function is being used instead.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useDemoData } from '@mui/x-data-grid-generator';
import {
  GridInitialState,
  DataGridPremium,
  useGridApiRef,
} from '@mui/x-data-grid-premium';

export default function SaveAndRestoreStateInitialState() {
  const apiRef = useGridApiRef();
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 10,
  });

  const [initialState, setInitialState] = React.useState<GridInitialState>();

  const saveSnapshot = React.useCallback(() => {
    if (apiRef?.current?.exportState && localStorage) {
      const currentState = apiRef.current.exportState();
      localStorage.setItem('dataGridState', JSON.stringify(currentState));
    }
  }, [apiRef]);

  React.useLayoutEffect(() => {
    const stateFromLocalStorage = localStorage?.getItem('dataGridState');
    setInitialState(stateFromLocalStorage ? JSON.parse(stateFromLocalStorage) : {});

    // handle refresh and navigating away/refreshing
    window.addEventListener('beforeunload', saveSnapshot);

    return () => {
      // in case of an SPA remove the event-listener
      window.removeEventListener('beforeunload', saveSnapshot);
      saveSnapshot();
    };
  }, [saveSnapshot]);

  if (!initialState) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ height: 300, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        loading={loading}
        initialState={{
          ...data.initialState,
          ...initialState,
        }}
      />
    </Box>
  );
}

```

### Restore the state with apiRef

You can pass the state returned by `apiRef.current.exportState()` to the `apiRef.current.restoreState` method.
In the demo below, clicking on **Save current view** will create a snapshot of the changes made in the state, considering the initial state.
You can apply these changes on the Data Grid later selecting a saved view in the **Custom view** menu.

```tsx
import * as React from 'react';
import {
  DataGridPro,
  GridInitialState,
  useGridApiContext,
  useGridApiRef,
  GridToolbarContainer,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Fade from '@mui/material/Fade';
import Popper from '@mui/material/Popper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

interface StateView {
  label: string;
  value: GridInitialState;
}

interface DemoState {
  views: { [id: string]: StateView };
  newViewLabel: string;
  activeViewId: string | null;
  isMenuOpened: boolean;
  menuAnchorEl: HTMLElement | null;
}

type DemoActions =
  | { type: 'createView'; value: GridInitialState }
  | { type: 'deleteView'; id: string }
  | { type: 'setNewViewLabel'; label: string }
  | { type: 'setActiveView'; id: string | null }
  | { type: 'togglePopper'; element: HTMLElement }
  | { type: 'closePopper' };

const demoReducer: React.Reducer<DemoState, DemoActions> = (state, action) => {
  switch (action.type) {
    case 'createView': {
      const id = Math.random().toString();

      return {
        ...state,
        activeViewId: id,
        newViewLabel: '',
        views: {
          ...state.views,
          [id]: { label: state.newViewLabel, value: action.value },
        },
      };
    }

    case 'deleteView': {
      const views = Object.fromEntries(
        Object.entries(state.views).filter(([id]) => id !== action.id),
      );

      let activeViewId: string | null;
      if (state.activeViewId !== action.id) {
        activeViewId = state.activeViewId;
      } else {
        const viewIds = Object.keys(state.views);

        if (viewIds.length === 0) {
          activeViewId = null;
        } else {
          activeViewId = viewIds[0];
        }
      }

      return {
        ...state,
        views,
        activeViewId,
      };
    }

    case 'setActiveView': {
      return {
        ...state,
        activeViewId: action.id,
        isMenuOpened: false,
      };
    }

    case 'setNewViewLabel': {
      return {
        ...state,
        newViewLabel: action.label,
      };
    }

    case 'togglePopper': {
      return {
        ...state,
        isMenuOpened: !state.isMenuOpened,
        menuAnchorEl: action.element,
      };
    }

    case 'closePopper': {
      return {
        ...state,
        isMenuOpened: false,
      };
    }

    default: {
      return state;
    }
  }
};

const DEMO_INITIAL_STATE: DemoState = {
  views: {},
  newViewLabel: '',
  isMenuOpened: false,
  menuAnchorEl: null,
  activeViewId: null,
};

function ViewListItem(props: {
  view: StateView;
  viewId: string;
  selected: boolean;
  onDelete: (viewId: string) => void;
  onSelect: (viewId: string) => void;
}) {
  const { view, viewId, selected, onDelete, onSelect, ...other } = props;

  return (
    <MenuItem selected={selected} onClick={() => onSelect(viewId)} {...other}>
      {view.label}
      <IconButton
        edge="end"
        aria-label="delete"
        size="small"
        onClick={(event) => {
          event.stopPropagation();
          onDelete(viewId);
        }}
      >
        <DeleteIcon />
      </IconButton>
    </MenuItem>
  );
}

function NewViewListButton(props: {
  label: string;
  onLabelChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: () => void;
  isValid: boolean;
}) {
  const { label, onLabelChange, onSubmit, isValid } = props;
  const [isAddingView, setIsAddingView] = React.useState(false);

  const handleSubmitForm: React.FormEventHandler = (event) => {
    onSubmit();
    setIsAddingView(false);
    event.preventDefault();
  };

  return (
    <React.Fragment>
      <Button
        endIcon={<AddIcon />}
        size="small"
        onClick={() => setIsAddingView(true)}
      >
        Save current view
      </Button>
      <Dialog onClose={() => setIsAddingView(false)} open={isAddingView}>
        <form onSubmit={handleSubmitForm}>
          <DialogTitle>New custom view</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              value={label}
              onChange={onLabelChange}
              margin="dense"
              size="small"
              label="Custom view label"
              variant="standard"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => setIsAddingView(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              Create view
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

function CustomToolbar() {
  const apiRef = useGridApiContext();
  const [state, dispatch] = React.useReducer(demoReducer, DEMO_INITIAL_STATE);

  const createNewView = () => {
    dispatch({
      type: 'createView',
      value: apiRef.current.exportState(),
    });
  };

  const handleNewViewLabelChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    dispatch({ type: 'setNewViewLabel', label: event.target.value });
  };

  const handleDeleteView = React.useCallback((viewId: string) => {
    dispatch({ type: 'deleteView', id: viewId });
  }, []);

  const handleSetActiveView = (viewId: string) => {
    apiRef.current.restoreState(state.views[viewId].value);
    dispatch({ type: 'setActiveView', id: viewId });
  };

  const handlePopperAnchorClick = (event: React.MouseEvent) => {
    dispatch({ type: 'togglePopper', element: event.currentTarget as HTMLElement });
    event.stopPropagation();
  };

  const handleClosePopper = () => {
    dispatch({ type: 'closePopper' });
  };

  const isNewViewLabelValid = React.useMemo(() => {
    if (state.newViewLabel.length === 0) {
      return false;
    }

    return Object.values(state.views).every(
      (view) => view.label !== state.newViewLabel,
    );
  }, [state.views, state.newViewLabel]);

  const canBeMenuOpened = state.isMenuOpened && Boolean(state.menuAnchorEl);
  const popperId = canBeMenuOpened ? 'transition-popper' : undefined;

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      dispatch({ type: 'closePopper' });
    } else if (event.key === 'Escape') {
      dispatch({ type: 'closePopper' });
    }
  };

  return (
    <GridToolbarContainer>
      <Button
        aria-describedby={popperId}
        type="button"
        size="small"
        id="custom-view-button"
        aria-controls={state.isMenuOpened ? 'custom-view-menu' : undefined}
        aria-expanded={state.isMenuOpened ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handlePopperAnchorClick}
      >
        Custom view ({Object.keys(state.views).length})
      </Button>
      <ClickAwayListener onClickAway={handleClosePopper}>
        <Popper
          id={popperId}
          open={state.isMenuOpened}
          anchorEl={state.menuAnchorEl}
          role={undefined}
          transition
          placement="bottom-start"
          sx={{ zIndex: 'modal' }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <MenuList
                  autoFocusItem={state.isMenuOpened}
                  id="custom-view-menu"
                  aria-labelledby="custom-view-button"
                  onKeyDown={handleListKeyDown}
                >
                  {Object.entries(state.views).map(([viewId, view]) => (
                    <ViewListItem
                      key={viewId}
                      view={view}
                      viewId={viewId}
                      selected={viewId === state.activeViewId}
                      onDelete={handleDeleteView}
                      onSelect={handleSetActiveView}
                    />
                  ))}
                </MenuList>
              </Paper>
            </Fade>
          )}
        </Popper>
      </ClickAwayListener>
      <NewViewListButton
        label={state.newViewLabel}
        onLabelChange={handleNewViewLabelChange}
        onSubmit={createNewView}
        isValid={isNewViewLabelValid}
      />
    </GridToolbarContainer>
  );
}

export default function RestoreStateApiRef() {
  const apiRef = useGridApiRef();
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 500,
  });

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGridPro
        slots={{ toolbar: CustomToolbar }}
        showToolbar
        loading={loading}
        apiRef={apiRef}
        pagination
        {...data}
      />
    </Box>
  );
}

```

#### Restore part of the state

It is possible to restore specific properties of the state using the `apiRef.current.restoreState()` method.
For instance, to only restore the pinned columns:

```ts
apiRef.current.restoreState({
  pinnedColumns: ['brand'],
});
```

:::warning
Most of the state keys are not fully independent.

Restoring pagination without restoring filters or sorting will work, but the rows displayed after the re-import will not be the same as before the export.
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
