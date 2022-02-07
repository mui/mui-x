import * as React from 'react';
import PropTypes from 'prop-types';
import { DataGridPro, useGridApiContext, useGridApiRef } from '@mui/x-data-grid-pro';
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
import DoneIcon from '@mui/icons-material/Done';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import Popper from '@mui/material/Popper';

const demoReducer = (state, action) => {
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

      let activeViewId;
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

const DEMO_INITIAL_STATE = {
  views: {},
  newViewLabel: '',
  isMenuOpened: false,
  menuAnchorEl: null,
  activeViewId: null,
};

const ViewListItem = (props) => {
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

ViewListItem.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  view: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.shape({
      columns: PropTypes.shape({
        columnVisibilityModel: PropTypes.object,
      }),
      detailPanel: PropTypes.shape({
        expandedRowIds: PropTypes.arrayOf(
          PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        ).isRequired,
      }),
      filter: PropTypes.shape({
        filterModel: PropTypes.object,
      }),
      pagination: PropTypes.shape({
        page: PropTypes.number,
        pageSize: PropTypes.number,
      }),
      pinnedColumns: PropTypes.shape({
        left: PropTypes.arrayOf(PropTypes.string),
        right: PropTypes.arrayOf(PropTypes.string),
      }),
      preferencePanel: PropTypes.shape({
        open: PropTypes.bool.isRequired,
        openedPanelValue: PropTypes.oneOf(['columns', 'filters']),
      }),
      rowGrouping: PropTypes.shape({
        model: PropTypes.arrayOf(PropTypes.string),
      }),
      sorting: PropTypes.shape({
        sortModel: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
  }).isRequired,
  viewId: PropTypes.string.isRequired,
};

const NewViewListItem = (props) => {
  const { label, onLabelChange, onSubmit, isValid } = props;
  const [isAddingView, setIsAddingView] = React.useState(false);

  if (isAddingView) {
    return (
      <ListItem
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="delete"
            size="small"
            onClick={() => {
              onSubmit();
              setIsAddingView(false);
            }}
            disabled={!isValid}
          >
            <DoneIcon />
          </IconButton>
        }
      >
        <TextField
          value={label}
          onChange={onLabelChange}
          size="small"
          label="Custom view label"
          variant="standard"
        />
      </ListItem>
    );
  }

  return (
    <ListItem>
      <Button
        size="small"
        startIcon={<AddIcon />}
        onClick={() => setIsAddingView(true)}
      >
        Add a custom view
      </Button>
    </ListItem>
  );
};

NewViewListItem.propTypes = {
  isValid: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onLabelChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
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

  const handleNewViewLabelChange = (e) => {
    dispatch({ type: 'setNewViewLabel', label: e.target.value });
  };

  const handleDeleteView = React.useCallback((viewId) => {
    dispatch({ type: 'deleteView', id: viewId });
  }, []);

  const handleSetActiveView = (viewId) => {
    apiRef.current.restoreState(state.views[viewId].value);
    dispatch({ type: 'setActiveView', id: viewId });
  };

  const handlePopperAnchorClick = (event) => {
    dispatch({ type: 'togglePopper', element: event.currentTarget });
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
    <React.Fragment>
      <Button
        aria-describedby={popperId}
        type="button"
        onClick={handlePopperAnchorClick}
      >
        Custom views
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

                  <Divider />
                  <NewViewListItem
                    label={state.newViewLabel}
                    onLabelChange={handleNewViewLabelChange}
                    onSubmit={createNewView}
                    isValid={isNewViewLabelValid}
                  />
                </List>
              </Paper>
            </Fade>
          )}
        </Popper>
      </ClickAwayListener>
    </React.Fragment>
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
