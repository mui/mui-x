import * as React from 'react';
import {
  DataGridPremium,
  Toolbar,
  useGridSelector,
  useGridApiContext,
  gridColumnLookupSelector,
  gridColumnReorderDragColSelector,
  gridRowGroupingSanitizedModelSelector,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled } from '@mui/material/styles';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: 'flex-start',
  overflow: 'auto',
  padding: theme.spacing(1),
  gap: theme.spacing(1),
}));

function CustomToolbar() {
  const apiRef = useGridApiContext();
  const rowGroupingModel = useGridSelector(
    apiRef,
    gridRowGroupingSanitizedModelSelector,
  );
  const columnsLookup = useGridSelector(apiRef, gridColumnLookupSelector);
  const draggedColumn = useGridSelector(apiRef, gridColumnReorderDragColSelector);
  const [draggedChip, setDraggedChip] = React.useState(null);

  const handleToolbarDragOver = (event) => {
    event.preventDefault();

    const draggedField = draggedChip || draggedColumn;
    if (draggedField && !rowGroupingModel.includes(draggedField)) {
      apiRef.current.addRowGroupingCriteria(draggedField);
    }
  };

  const handleToolbarDragLeave = (event) => {
    event.preventDefault();

    const draggedField = draggedChip || draggedColumn;
    if (draggedField && !event.currentTarget.contains(event.relatedTarget)) {
      apiRef.current.removeRowGroupingCriteria(draggedField);
    }
  };

  const handleChipDragStart = (field) => (event) => {
    setDraggedChip(field);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleChipDragEnd = () => {
    setDraggedChip(null);
  };

  const handleChipDragOver = (targetField) => (event) => {
    event.preventDefault();

    const draggedField = draggedChip || draggedColumn;
    if (!draggedField || draggedField === targetField) {
      return;
    }

    const currentIndex = rowGroupingModel.indexOf(draggedField);
    const targetIndex = rowGroupingModel.indexOf(targetField);

    if (currentIndex === -1 || targetIndex === -1) {
      return;
    }

    if (currentIndex !== targetIndex) {
      const newModel = [...rowGroupingModel];
      newModel.splice(currentIndex, 1);
      newModel.splice(targetIndex, 0, draggedField);
      apiRef.current.setRowGroupingModel(newModel);
    }
  };

  const removeRowGroup = (field) => {
    apiRef.current.removeRowGroupingCriteria(field);
  };

  return (
    <StyledToolbar
      aria-label="Row grouping"
      onDragOver={handleToolbarDragOver}
      onDragLeave={handleToolbarDragLeave}
    >
      {rowGroupingModel.length > 0 ? (
        <React.Fragment>
          {rowGroupingModel.map((field, index) => (
            <React.Fragment key={field}>
              {index > 0 && <ChevronRightIcon fontSize="small" color="action" />}
              <Chip
                key={field}
                label={columnsLookup[field].headerName ?? field}
                icon={<DragIndicatorIcon fontSize="small" />}
                sx={{
                  cursor: 'grab',
                  opacity:
                    draggedChip === field || draggedColumn === field ? 0.5 : 1,
                }}
                onDragStart={handleChipDragStart(field)}
                onDragEnd={handleChipDragEnd}
                onDragOver={handleChipDragOver(field)}
                onDelete={() => removeRowGroup(field)}
                draggable
              />
            </React.Fragment>
          ))}
        </React.Fragment>
      ) : (
        <Typography variant="body2" color="textSecondary" sx={{ flex: 1 }} noWrap>
          Drag columns here to create row groups
        </Typography>
      )}
    </StyledToolbar>
  );
}

export default function RowGroupingToolbar() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        initialState={{
          rowGrouping: {
            model: ['commodity', 'status'],
          },
        }}
        showToolbar
      />
    </div>
  );
}
