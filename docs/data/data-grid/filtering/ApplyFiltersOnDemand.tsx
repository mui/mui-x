import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  DataGridPro,
  GridAddIcon,
  GridDeleteForeverIcon,
  GridFilterPanelBase,
  GridPanelFooter,
  gridColumnDefinitionsSelector,
  gridFilterModelSelector,
  useGridApiContext,
} from '@mui/x-data-grid-pro';
import type {
  GridColDef,
  GridFilterItem,
  GridFilterModel,
  GridFilterPanelProps,
} from '@mui/x-data-grid-pro';

const rows = [
  { id: 1, name: 'Nike', category: 'Shoes', price: 120 },
  { id: 2, name: 'Adidas', category: 'Shoes', price: 100 },
  { id: 3, name: 'Puma', category: 'Apparel', price: 60 },
  { id: 4, name: 'Reebok', category: 'Apparel', price: 80 },
  { id: 5, name: 'Asics', category: 'Shoes', price: 140 },
];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 160 },
  { field: 'category', headerName: 'Category', width: 160 },
  { field: 'price', headerName: 'Price', type: 'number', width: 120 },
];

type CustomFilterPanelFooterProps = {
  filterModel: GridFilterModel;
  onFilterModelChange: (model: GridFilterModel) => void;
  onApply: () => void;
  disableApplyButton: boolean;
};

// A custom footer that re-implements the "Add filter" and "Remove all" actions of
// `GridFilterPanelBase` (which are disabled below) so they operate on the draft model, and adds an
// "Apply" button next to "Remove all".
function CustomFilterPanelFooter(props: CustomFilterPanelFooterProps) {
  const {
    filterModel,
    onFilterModelChange,
    onApply,
    disableApplyButton: applyDisabled,
  } = props;
  const apiRef = useGridApiContext();

  const handleAddFilter = () => {
    const filterableColumn = gridColumnDefinitionsSelector(apiRef).find(
      (column) => column.filterable !== false && column.filterOperators?.length,
    );
    if (!filterableColumn) {
      return;
    }
    const maxId = filterModel.items.reduce(
      (max, item) => (typeof item.id === 'number' && item.id > max ? item.id : max),
      0,
    );
    const createItem = (id: number): GridFilterItem => ({
      field: filterableColumn.field,
      operator: filterableColumn.filterOperators![0].value,
      id,
    });
    // When the model is empty, the panel is showing an uncommitted placeholder row. Committing it
    // and appending a new one mirrors the default panel's "Add filter" behavior, so the first click
    // adds a visible row instead of just replacing the placeholder.
    const items = filterModel.items.length
      ? [...filterModel.items, createItem(maxId + 1)]
      : [createItem(maxId + 1), createItem(maxId + 2)];
    onFilterModelChange({ ...filterModel, items });
  };

  const handleRemoveAll = () => {
    // "Remove all" only clears the draft; it is applied when the user clicks "Apply".
    onFilterModelChange({ ...filterModel, items: [] });
  };

  return (
    <GridPanelFooter>
      <Button size="small" startIcon={<GridAddIcon />} onClick={handleAddFilter}>
        Add filter
      </Button>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          size="small"
          startIcon={<GridDeleteForeverIcon />}
          onClick={handleRemoveAll}
        >
          Remove all
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={onApply}
          disabled={applyDisabled}
        >
          Apply
        </Button>
      </Box>
    </GridPanelFooter>
  );
}

// A filter panel that edits a draft filter model kept outside of the grid state.
// The draft is only synced to the grid (where filtering — or a server request — happens) when the
// user clicks "Apply". Because the panel unmounts when it closes, closing it without applying
// discards the draft: it is re-initialized from the active filter model the next time it opens.
function DeferredFilterPanel(props: GridFilterPanelProps) {
  const apiRef = useGridApiContext();
  const [draftFilterModel, setDraftFilterModel] = React.useState<GridFilterModel>(
    () => gridFilterModelSelector(apiRef),
  );
  const [isDirty, setIsDirty] = React.useState(false);

  const handleFilterModelChange = (model: GridFilterModel) => {
    setDraftFilterModel(model);
    setIsDirty(true);
  };

  const handleApply = () => {
    apiRef.current.setFilterModel(draftFilterModel);
    setIsDirty(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <GridFilterPanelBase
        {...props}
        filterModel={draftFilterModel}
        onFilterModelChange={handleFilterModelChange}
        disableAddFilterButton
        disableRemoveAllButton
      />
      <CustomFilterPanelFooter
        filterModel={draftFilterModel}
        onFilterModelChange={handleFilterModelChange}
        onApply={handleApply}
        disableApplyButton={!isDirty}
      />
    </Box>
  );
}

export default function ApplyFiltersOnDemand() {
  const [appliedCount, setAppliedCount] = React.useState(0);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        The filter model has been applied {appliedCount} time(s). Editing the panel
        only updates the draft — nothing is applied until you click{' '}
        <strong>Apply</strong>, and closing the panel discards unapplied changes.
      </Typography>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGridPro
          rows={rows}
          columns={columns}
          showToolbar
          slots={{
            filterPanel: DeferredFilterPanel,
            // render empty component, so loading indicator in filter panel form inputs is not shown
            // when
            loadIcon: () => null,
          }}
          onFilterModelChange={() => setAppliedCount((count) => count + 1)}
        />
      </Box>
    </Box>
  );
}
