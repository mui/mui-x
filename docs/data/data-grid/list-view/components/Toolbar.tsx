import * as React from 'react';
import {
  GridClearIcon,
  GridDeleteIcon,
  GridRowId,
  GridToolbarProps,
  gridRowSelectionCountSelector,
  gridRowSelectionIdsSelector,
  useGridApiContext,
  useGridSelector,
  Toolbar as ToolbarRoot,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  ToolbarButton,
} from '@mui/x-data-grid-premium';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import { ToolbarAddItem } from './ToolbarAddItem';
import { ToolbarColumnsItem } from './ToolbarColumnsItem';
import { ToolbarSortItem } from './ToolbarSortItem';
import { ToolbarDensityItem } from './ToolbarDensityItem';
import { ToolbarFilterItem } from './ToolbarFilterItem';
import { DrawerProps } from './Drawer';

export interface ToolbarProps extends GridToolbarProps {
  container?: DrawerProps['container'];
  listView?: boolean;
  handleDelete?: (ids: GridRowId[]) => void;
  handleUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Toolbar(props: ToolbarProps) {
  const { listView = false, container, handleUpload, handleDelete } = props;
  const apiRef = useGridApiContext();
  const selectionCount = useGridSelector(apiRef, gridRowSelectionCountSelector);
  const showSelectionOptions = selectionCount > 0;

  const handleClearSelection = () => {
    apiRef.current.setRowSelectionModel({ type: 'include', ids: new Set() });
  };

  const handleDeleteSelectedRows = () => {
    handleClearSelection();
    const selectedRows = gridRowSelectionIdsSelector(apiRef);
    handleDelete?.(Array.from(selectedRows.keys()));
  };

  const itemProps = {
    listView,
    container,
  };

  return (
    <ToolbarRoot>
      {showSelectionOptions ? (
        <React.Fragment>
          <ToolbarButton sx={{ mr: 0.5 }} onClick={handleClearSelection}>
            <GridClearIcon fontSize="small" />
          </ToolbarButton>

          <Typography variant="body2">{selectionCount} selected</Typography>

          <ToolbarButton sx={{ ml: 'auto' }} onClick={handleDeleteSelectedRows}>
            <GridDeleteIcon fontSize="small" />
          </ToolbarButton>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ToolbarColumnsItem {...itemProps} />
          <ToolbarFilterItem {...itemProps} />
          <ToolbarSortItem {...itemProps} />
          <ToolbarDensityItem {...itemProps} />
          <ToolbarAddItem {...itemProps} handleUpload={handleUpload} />
          <QuickFilter>
            <QuickFilterControl
              render={({ ref, ...other }) => (
                <TextField
                  {...other}
                  sx={{ width: 260, ml: 'auto' }}
                  inputRef={ref}
                  aria-label="Search"
                  placeholder="Search..."
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: other.value ? (
                      <InputAdornment position="end">
                        <QuickFilterClear
                          edge="end"
                          size="small"
                          aria-label="Clear search"
                          sx={{ marginRight: -0.75 }}
                        >
                          <CancelIcon fontSize="small" />
                        </QuickFilterClear>
                      </InputAdornment>
                    ) : null,
                  }}
                />
              )}
            />
          </QuickFilter>
        </React.Fragment>
      )}
    </ToolbarRoot>
  );
}
