import * as React from 'react';
import { styled } from '@mui/system';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import { GridColDef } from '@mui/x-data-grid';
import { PivotModel } from '../hooks/features/pivoting/useGridPivoting';

const GridPivotPanelContainerStyled = styled('div')({
  width: 250,
  overflow: 'hidden',
  position: 'relative',
});

const ResizeHandle = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: 6,
  cursor: 'ew-resize',
  borderLeft: '1px solid #eee',
  transition: 'border-left 0.2s',
  '&:hover': {
    borderLeft: '2px solid #aaa',
  },
});

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

const PivotSectionContainer = styled('div')<{ 'data-section': FieldTransferObject['modelKey'] }>({
  padding: '8px 12px',
});

const Placeholder = styled('div')({
  height: 50,
  width: '100%',
  backgroundColor: '#f2f2f2',
  border: '1px dashed #bbb',
  borderRadius: 8,
});

const GridFieldItemContainer = styled('div')({
  width: '100%',
  padding: '4px',
  '&:hover': {
    backgroundColor: '#f2f2f2',
  },
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
  return (
    <GridFieldItemContainer
      draggable="true"
      onDragStart={(event) => {
        const data: FieldTransferObject = { field, modelKey };
        event.dataTransfer.setData('text/plain', JSON.stringify(data));
        event.dataTransfer.dropEffect = 'move';
      }}
      {...props}
    >
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

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  return (
    <div>
      <PivotSectionContainer onDrop={handleDrop} onDragOver={handleDragOver} data-section="rows">
        <div>Rows</div>
        {pivotModel.rows.length === 0 && <Placeholder />}
        {pivotModel.rows.length > 0 &&
          pivotModel.rows.map((field) => {
            return (
              <GridFieldItem key={field} field={field} modelKey="rows" data-field={field}>
                {field}
              </GridFieldItem>
            );
          })}
      </PivotSectionContainer>
      <Divider />
      <PivotSectionContainer onDrop={handleDrop} onDragOver={handleDragOver} data-section="columns">
        <div>Columns</div>
        {pivotModel.columns.length === 0 && <Placeholder />}
        {pivotModel.columns.length > 0 &&
          pivotModel.columns.map(({ field, sort }) => {
            return (
              <GridFieldItem key={field} field={field} modelKey="columns">
                {field} {sort}
              </GridFieldItem>
            );
          })}
      </PivotSectionContainer>
      <Divider />
      <PivotSectionContainer onDrop={handleDrop} onDragOver={handleDragOver} data-section="values">
        <div>Values</div>
        {pivotModel.values.length === 0 && <Placeholder />}
        {pivotModel.values.length > 0 &&
          pivotModel.values.map(({ field, aggFunc }) => {
            return (
              <GridFieldItem key={field} field={field} modelKey="values">
                {field} {aggFunc}
              </GridFieldItem>
            );
          })}
      </PivotSectionContainer>
      <PivotSectionContainer onDrop={handleDrop} onDragOver={handleDragOver} data-section={null}>
        {availableFields.map((field) => {
          return (
            <GridFieldItem key={field} field={field} modelKey={null}>
              {field}
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
