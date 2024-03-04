import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import { GridColDef } from '@mui/x-data-grid';
import DragHandleIcon from '@mui/icons-material/DragIndicator';
import { useLazyRef } from '@mui/x-data-grid/hooks/utils/useLazyRef';
import { PivotModel } from '../hooks/features/pivoting/useGridPivoting';

const GridPivotPanelContainerStyled = styled('div')({
  width: 250,
  overflow: 'hidden',
  position: 'relative',
});

const ResizeHandle = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: 6,
  cursor: 'ew-resize',
  borderLeft: '1px solid var(--DataGrid-rowBorderColor)',
  transition: 'border-left 0.2s',
  '&:hover': {
    borderLeft: `1px solid ${theme.palette.action.active}`,
  },
}));

const useResize = <TElement extends HTMLElement>(options: {
  getInitialWidth: (handleElement: TElement) => number;
  onWidthChange: (newWidth: number, handleElement: TElement) => void;
}) => {
  const resizeHandleRef = React.useRef<TElement>(null);
  const optionsRef = React.useRef(options);
  React.useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  React.useEffect(() => {
    const handle = resizeHandleRef.current;
    if (!handle) {
      return undefined;
    }

    const { onWidthChange, getInitialWidth } = optionsRef.current;

    let startX: null | number = null;
    let startWidth: null | number = null;

    const handleMouseMove = (event: MouseEvent) => {
      if (startX === null || startWidth === null) {
        return;
      }
      const newWidth = startWidth + (startX - event.clientX);
      onWidthChange(newWidth, handle);
    };

    const handleMouseUp = () => {
      startX = null;
      startWidth = null;

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      startX = event.clientX;
      startWidth = getInitialWidth(handle);

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    handle.addEventListener('mousedown', handleMouseDown);

    return () => {
      handle.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return {
    ref: resizeHandleRef,
  };
};

export function GridPivotPanelContainer({ children }: { children: React.ReactNode }) {
  const { ref } = useResize({
    getInitialWidth: (handle) => {
      return handle.parentElement!.offsetWidth;
    },
    onWidthChange: (newWidth, handle) => {
      handle.parentElement!.style.width = `${newWidth}px`;
    },
  });

  return (
    <GridPivotPanelContainerStyled>
      <ResizeHandle ref={ref as any} />
      {children}
    </GridPivotPanelContainerStyled>
  );
}

const PivotSectionContainer = styled('div')<{ 'data-section': FieldTransferObject['modelKey'] }>(
  ({ theme }) => ({
    padding: '8px 12px',
    minHeight: 50,

    '&[data-drag-over="true"]': {
      backgroundColor: theme.palette.action.selected,
    },
  }),
);

const PivotSectionTitle = styled('div')(({ theme }) => ({
  ...theme.typography.caption,
  textTransform: 'uppercase',
}));

const Placeholder = styled('div')({
  height: 50,
  width: '100%',
  border: '1px dashed #bbb',
  borderRadius: 8,
});

const GridFieldItemContainer = styled('div')(({ theme }) => ({
  width: '100%',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DragHandle = styled('div')({
  display: 'flex',
  cursor: 'pointer',
  marginRight: 4,
});

interface FieldTransferObject {
  field: string;
  modelKey: 'columns' | 'rows' | 'values' | null;
}

function GridFieldItem({
  children,
  field,
  modelKey,
  ...props
}: {
  children: React.ReactNode;
  field: FieldTransferObject['field'];
  modelKey: FieldTransferObject['modelKey'];
}) {
  const handleDragStart = React.useCallback(
    (event: React.DragEvent) => {
      const data: FieldTransferObject = { field, modelKey };
      event.dataTransfer.setData('text/plain', JSON.stringify(data));
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.setDragImage(
        event.target.parentElement!,
        event.nativeEvent.offsetX,
        event.nativeEvent.offsetY,
      );
    },
    [field, modelKey],
  );

  return (
    <GridFieldItemContainer {...props}>
      <DragHandle draggable="true" onDragStart={handleDragStart}>
        <DragHandleIcon fontSize="small" />
      </DragHandle>
      {children}
    </GridFieldItemContainer>
  );
}

function GridPivotPanelContent({
  pivotModel,
  columns,
  onPivotModelChange,
}: {
  pivotModel: PivotModel;
  columns: GridColDef[];
  onPivotModelChange: React.Dispatch<React.SetStateAction<PivotModel>>;
}) {
  const [fields] = React.useState(() => columns.map((col) => col.field));

  const initialColumnsLookup = useLazyRef(() => {
    return columns.reduce(
      (acc, column) => {
        acc[column.field] = column;
        return acc;
      },
      {} as Record<string, GridColDef>,
    );
  }).current;

  const getColumnName = React.useCallback(
    (field: string) => {
      const column = initialColumnsLookup[field];
      return column?.headerName || field;
    },
    [initialColumnsLookup],
  );

  const availableFields = React.useMemo(() => {
    return fields.filter((field) => {
      if (pivotModel.rows.includes(field)) {
        return false;
      }
      if (pivotModel.columns.find((col) => col.field === field)) {
        return false;
      }
      if (pivotModel.values.find((obj) => obj.field === field)) {
        return false;
      }
      return true;
    });
  }, [pivotModel.columns, pivotModel.rows, pivotModel.values, fields]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const { field, modelKey: originSection } = JSON.parse(
      event.dataTransfer.getData('text/plain'),
    ) as FieldTransferObject;
    const targetSection = event.currentTarget.getAttribute(
      'data-section',
    ) as FieldTransferObject['modelKey'];
    if (originSection === targetSection) {
      return;
    }
    event.currentTarget.removeAttribute('data-drag-over');
    onPivotModelChange((prev) => {
      const newModel = { ...prev };
      if (targetSection) {
        const newItem = targetSection === 'rows' ? field : { field };
        if (targetSection === 'values') {
          newItem.aggFunc = 'sum';
        }
        if (targetSection === 'columns') {
          newItem.sort = 'asc';
        }
        newModel[targetSection] = [...prev[targetSection], newItem];
      }
      if (originSection) {
        newModel[originSection] = prev[originSection].filter((f) => {
          if (typeof f === 'string') {
            return f !== field;
          }
          return f.field !== field;
        });
      }
      return newModel;
    });
  };

  const handleDragOver = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (!event.currentTarget.contains(event.relatedTarget as HTMLElement)) {
      event.currentTarget.setAttribute('data-drag-over', 'true');
    }
  }, []);

  const handleDragLeave = React.useCallback((event: React.DragEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget as HTMLElement)) {
      event.currentTarget.removeAttribute('data-drag-over');
    }
  }, []);

  return (
    <div>
      <PivotSectionContainer
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-section="rows"
      >
        <PivotSectionTitle>Rows</PivotSectionTitle>
        {pivotModel.rows.length === 0 && <Placeholder />}
        {pivotModel.rows.length > 0 &&
          pivotModel.rows.map((field) => {
            return (
              <GridFieldItem key={field} field={field} modelKey="rows" data-field={field}>
                {getColumnName(field)}
              </GridFieldItem>
            );
          })}
      </PivotSectionContainer>
      <Divider />
      <PivotSectionContainer
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-section="columns"
      >
        <PivotSectionTitle>Columns</PivotSectionTitle>
        {pivotModel.columns.length === 0 && <Placeholder />}
        {pivotModel.columns.length > 0 &&
          pivotModel.columns.map(({ field, sort }) => {
            return (
              <GridFieldItem key={field} field={field} modelKey="columns">
                {getColumnName(field)} {sort}
              </GridFieldItem>
            );
          })}
      </PivotSectionContainer>
      <Divider />
      <PivotSectionContainer
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-section="values"
      >
        <PivotSectionTitle>Values</PivotSectionTitle>
        {pivotModel.values.length === 0 && <Placeholder />}
        {pivotModel.values.length > 0 &&
          pivotModel.values.map(({ field, aggFunc }) => {
            return (
              <GridFieldItem key={field} field={field} modelKey="values">
                {getColumnName(field)} {aggFunc}
              </GridFieldItem>
            );
          })}
      </PivotSectionContainer>
      <PivotSectionContainer
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-section={null}
      >
        <PivotSectionTitle>Available fields</PivotSectionTitle>
        {availableFields.map((field) => {
          return (
            <GridFieldItem key={field} field={field} modelKey={null}>
              {getColumnName(field)}
            </GridFieldItem>
          );
        })}
      </PivotSectionContainer>
    </div>
  );
}

export function GridPivotPanel({
  pivotModel,
  initialColumns,
  onPivotModelChange,
  pivotMode,
  onPivotModeChange,
}: {
  pivotModel: any;
}) {
  return (
    <React.Fragment>
      <FormControlLabel
        control={
          <Switch checked={pivotMode} onChange={(e) => onPivotModeChange(e.target.checked)} />
        }
        label="Pivot"
      />
      <Divider />
      {pivotMode && (
        <GridPivotPanelContent
          pivotModel={pivotModel}
          columns={initialColumns}
          onPivotModelChange={onPivotModelChange}
        />
      )}
    </React.Fragment>
  );
}
