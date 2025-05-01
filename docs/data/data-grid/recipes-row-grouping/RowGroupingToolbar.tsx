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
  useKeepGroupedColumnsHidden,
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
  const [draggedChip, setDraggedChip] = React.useState<string | null>(null);

  const handleToolbarDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const draggedField = draggedChip || draggedColumn;
    if (draggedField && !rowGroupingModel.includes(draggedField)) {
      apiRef.current.addRowGroupingCriteria(draggedField);
    }
  };

  const handleToolbarDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const draggedField = draggedChip || draggedColumn;
    if (draggedField && !event.currentTarget.contains(event.relatedTarget as Node)) {
      apiRef.current.removeRowGroupingCriteria(draggedField);
    }
  };

  const handleChipDragStart =
    (field: string) => (event: React.DragEvent<HTMLDivElement>) => {
      setDraggedChip(field);
      event.dataTransfer.effectAllowed = 'move';
    };

  const handleChipDragEnd = () => {
    setDraggedChip(null);
  };

  const handleChipDragOver =
    (targetField: string) => (event: React.DragEvent<HTMLDivElement>) => {
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

  const moveRowGroup = (field: string, position: number) => {
    if (position < 0 || position > rowGroupingModel.length) {
      return;
    }

    const currentIndex = rowGroupingModel.indexOf(field);
    const newModel = [...rowGroupingModel];
    newModel.splice(currentIndex, 1);
    newModel.splice(position, 0, field);
    apiRef.current.setRowGroupingModel(newModel);
  };

  const removeRowGroup = (field: string) => {
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
          {rowGroupingModel.map((field, index) => {
            const isDraggedField = draggedChip === field || draggedColumn === field;
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
                    // TODO: Fix keyboard navigation once re-ordereda
                    const handleKeyDown = (
                      event: React.KeyboardEvent<HTMLDivElement>,
                    ) => {
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
                        ref={ref as React.Ref<HTMLDivElement>}
                        label={columnsLookup[field].headerName ?? field}
                        icon={<DragIndicatorIcon fontSize="small" />}
                        sx={{ cursor: 'grab', opacity: isDraggedField ? 0.5 : 1 }}
                        onDelete={() => removeRowGroup(field)}
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

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['commodity', 'status'],
      },
    },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        initialState={initialState}
        apiRef={apiRef}
        showToolbar
      />
    </div>
  );
}
