import * as React from 'react';
import {
  DataGridPremium,
  Toolbar,
  ToolbarButton,
  useGridSelector,
  useGridApiContext,
  gridColumnLookupSelector,
  gridColumnReorderDragColSelector,
  gridRowGroupingSanitizedModelSelector,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import { styled } from '@mui/material/styles';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: 'flex-start',
  overflow: 'auto',
  padding: theme.spacing(1, 1.5),
  gap: theme.spacing(0.75),
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

    if (
      draggedColumn &&
      !rowGroupingModel.includes(draggedColumn) &&
      columnsLookup[draggedColumn].groupable
    ) {
      apiRef.current.addRowGroupingCriteria(draggedColumn);
    }
  };

  const handleToolbarDragLeave = (event) => {
    event.preventDefault();

    if (draggedColumn && !event.currentTarget.contains(event.relatedTarget)) {
      apiRef.current.removeRowGroupingCriteria(draggedColumn);
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

  const moveRowGroup = (field, position) => {
    if (position < 0 || position > rowGroupingModel.length) {
      return;
    }

    const currentIndex = rowGroupingModel.indexOf(field);
    const newModel = [...rowGroupingModel];
    newModel.splice(currentIndex, 1);
    newModel.splice(position, 0, field);
    apiRef.current.setRowGroupingModel(newModel);
  };

  const removeRowGroup = (field) => {
    if (columnsLookup[field].groupable) {
      apiRef.current.removeRowGroupingCriteria(field);
    }
  };

  return (
    <StyledToolbar
      aria-label="Row grouping"
      onDragOver={handleToolbarDragOver}
      onDragLeave={handleToolbarDragLeave}
    >
      <MoveUpIcon fontSize="small" color="action" sx={{ mr: 0.75 }} />
      {rowGroupingModel.length > 0 ? (
        <React.Fragment>
          {rowGroupingModel.map((field, index) => {
            const isDraggedField = draggedChip === field || draggedColumn === field;
            const isGroupable = columnsLookup[field].groupable;
            const label = columnsLookup[field].headerName ?? field;

            return (
              <React.Fragment key={field}>
                {index > 0 && <ChevronRightIcon fontSize="small" color="action" />}
                <ToolbarButton
                  id={field}
                  render={({
                    children,
                    color,
                    size,
                    ref,
                    onKeyDown,
                    ...chipProps
                  }) => {
                    const handleKeyDown = (event) => {
                      if (event.key === 'ArrowRight' && event.shiftKey) {
                        moveRowGroup(field, index + 1);
                      } else if (event.key === 'ArrowLeft' && event.shiftKey) {
                        moveRowGroup(field, index - 1);
                      } else {
                        onKeyDown?.(event);
                      }
                    };

                    return (
                      <Chip
                        {...chipProps}
                        ref={ref}
                        label={label}
                        sx={{ cursor: 'grab', opacity: isDraggedField ? 0.5 : 1 }}
                        onDelete={() => removeRowGroup(field)}
                        deleteIcon={!isGroupable ? <span /> : undefined}
                        onKeyDown={handleKeyDown}
                        onDragStart={handleChipDragStart(field)}
                        onDragEnd={handleChipDragEnd}
                        onDragOver={handleChipDragOver(field)}
                        draggable
                      />
                    );
                  }}
                />
              </React.Fragment>
            );
          })}
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
  const apiRef = useGridApiRef();

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
        apiRef={apiRef}
        showToolbar
      />
    </div>
  );
}
