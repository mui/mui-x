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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
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

const ViewListItem = (props: {
  view: StateView;
  viewId: string;
  selected: boolean;
  onDelete: (viewId: string) => void;
  onSelect: (viewId: string) => void;
}) => {
  const { view, viewId, selected, onDelete, onSelect } = props;

  return (
    <ListItem
      disablePadding
      selected={selected}
      onClick={() => onSelect(viewId)}
      secondaryAction={
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
      }
    >
      <ListItemButton>
        <ListItemText primary={view.label} />
      </ListItemButton>
    </ListItem>
  );
};

const NewViewListButton = (props: {
  label: string;
  onLabelChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: () => void;
  isValid: boolean;
}) => {
  const { label, onLabelChange, onSubmit, isValid } = props;
  const [isAddingView, setIsAddingView] = React.useState(false);

  return (
    <React.Fragment>
      <Button endIcon={<AddIcon />} onClick={() => setIsAddingView(true)}>
        Add a custom view
      </Button>
      <Dialog onClose={() => setIsAddingView(false)} open={isAddingView}>
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
          />
          <DialogActions>
            <Button onClick={() => setIsAddingView(false)}>Cancel</Button>
            <Button
              onClick={() => {
                onSubmit();
                setIsAddingView(false);
              }}
              disabled={!isValid}
            >
              Create view
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

const CustomToolbar = () => {
  const apiRef = useGridApiContext();
  const [state, dispatch] = React.useReducer(demoReducer, DEMO_INITIAL_STATE);

  const createNewView = () => {
    dispatch({
      type: 'createView',
      value: apiRef.current.exportState(),
    });
  };

  const handleNewViewLabelChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    dispatch({ type: 'setNewViewLabel', label: e.target.value });
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

  return (
    <GridToolbarContainer style={{ height: 48 }}>
      <Button
        aria-describedby={popperId}
        type="button"
        size="small"
        onClick={handlePopperAnchorClick}
      >
        Custom views ({Object.keys(state.views).length})
      </Button>
      <ClickAwayListener onClickAway={handleClosePopper}>
        <Popper
          id={popperId}
          open={state.isMenuOpened}
          anchorEl={state.menuAnchorEl}
          transition
          placement="bottom-start"
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <List>
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
                </List>
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
};

export default function RestoreStateApiRef() {
  const apiRef = useGridApiRef();
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 500,
  });

  return (
    <Box sx={{ width: '100%', height: 400, bgcolor: 'background.paper' }}>
      <DataGridPro
        components={{ Toolbar: CustomToolbar }}
        loading={loading}
        apiRef={apiRef}
        pagination
        {...data}
      />
    </Box>
  );
}
