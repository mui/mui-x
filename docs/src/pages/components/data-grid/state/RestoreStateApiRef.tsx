import * as React from 'react';
import { DataGridPro, GridInitialState, useGridApiRef } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';

interface DemoState {
  views: { [id: string]: { label: string; value: GridInitialState } };
  newViewLabel: string;
  activeViewId: string | null;
}

type DemoActions =
  | { type: 'createView'; value: GridInitialState }
  | { type: 'deleteView'; id: string }
  | { type: 'setNewViewLabel'; label: string }
  | { type: 'setActiveView'; id: string | null };

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
      };
    }

    case 'setNewViewLabel': {
      return {
        ...state,
        newViewLabel: action.label,
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
  activeViewId: null,
};

export default function RestoreStateApiRef() {
  const apiRef = useGridApiRef();
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 500,
  });
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

  const handleDeleteView = (viewId: string) => {
    dispatch({ type: 'deleteView', id: viewId });
  };

  const handleSetActiveView = (viewId: string) => {
    apiRef.current.restoreState(state.views[viewId].value);
    dispatch({ type: 'setActiveView', id: viewId });
  };

  const isNewViewLabelValid = React.useMemo(() => {
    if (state.newViewLabel.length === 0) {
      return false;
    }

    return Object.values(state.views).every(
      (view) => view.label !== state.newViewLabel,
    );
  }, [state.views, state.newViewLabel]);

  return (
    <Stack spacing={2} alignItems="flex-start" style={{ width: '100%' }}>
      <Stack direction="row" spacing={2}>
        <TextField
          label="New view label"
          value={state.newViewLabel}
          onChange={handleNewViewLabelChange}
          size="small"
        />
        <IconButton onClick={createNewView} disabled={!isNewViewLabelValid}>
          <AddIcon />
        </IconButton>
      </Stack>
      <Stack direction="row" spacing={1}>
        {Object.entries(state.views).map(([viewId, view]) => (
          <Chip
            label={view.label}
            onDelete={() => handleDeleteView(viewId)}
            variant={viewId === state.activeViewId ? 'filled' : 'outlined'}
            onClick={() => handleSetActiveView(viewId)}
          />
        ))}
      </Stack>
      <Box sx={{ width: '100%', height: 400, bgcolor: 'background.paper' }}>
        <DataGridPro loading={loading} apiRef={apiRef} pagination {...data} />
      </Box>
    </Stack>
  );
}
