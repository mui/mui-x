import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import { GridColDef } from '@mui/x-data-grid';
import DragHandleIcon from '@mui/icons-material/DragIndicator';
import { useLazyRef } from '@mui/x-data-grid/hooks/utils/useLazyRef';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { PivotModel } from '../hooks/features/pivoting/useGridPivoting';

const GridPivotPanelContainerStyled = styled('div')({
  width: 250,
  overflow: 'hidden',
  position: 'relative',
});

const ResizeHandle = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
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
    padding: '8px 0',
    minHeight: 50,

    '&[data-drag-over="true"]': {
      backgroundColor: theme.palette.action.selected,
    },
  }),
);

const PivotSectionTitle = styled('div')(({ theme }) => ({
  ...theme.typography.caption,
  padding: '0 8px',
  textTransform: 'uppercase',
}));

const Placeholder = styled('div')(({ theme }) => {
  const horizontalMargin = 8;
  return {
    height: 40,
    border: `1px dashed ${theme.palette.grey[400]}`,
    borderRadius: 8,
    margin: `8px ${horizontalMargin}px 0`,
    width: `calc(100% - ${horizontalMargin * 2}px)`,
  };
});

const GridFieldItemContainer = styled('div')<{ dropPosition: DropPosition }>(({ theme }) => ({
  width: '100%',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',

  borderWidth: 0,
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderStyle: 'solid',
  borderColor: 'transparent',
  transition: 'border-color 0.3s',
  marginBottom: -1, // collapse horizontal borders
  variants: [
    { props: { dropPosition: 'top' }, style: { borderTopColor: theme.palette.primary.main } },
    {
      props: { dropPosition: 'bottom' },
      style: { borderBottomColor: theme.palette.primary.main },
    },
  ],

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

type DropPosition = 'top' | 'bottom' | null;

type UpdatePivotModel = (params: {
  field: string;
  targetSection: FieldTransferObject['modelKey'];
  originSection: FieldTransferObject['modelKey'];
  targetField?: string;
  targetFieldPosition?: DropPosition;
}) => void;

function GridFieldItem({
  children,
  field,
  modelKey,
  updatePivotModel,
  ...props
}: {
  children: React.ReactNode;
  field: FieldTransferObject['field'];
  modelKey: FieldTransferObject['modelKey'];
  updatePivotModel: UpdatePivotModel;
}) {
  const [dropPosition, setDropPosition] = React.useState<DropPosition>(null);

  const handleDragStart = React.useCallback(
    (event: React.DragEvent) => {
      const data: FieldTransferObject = { field, modelKey };
      event.dataTransfer.setData('text/plain', JSON.stringify(data));
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.setDragImage(
        (event.target as HTMLElement).parentElement!,
        event.nativeEvent.offsetX,
        event.nativeEvent.offsetY,
      );
    },
    [field, modelKey],
  );

  const getDropPosition = React.useCallback((event: React.DragEvent): DropPosition => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const y = event.clientY - rect.top;
    if (y < rect.height / 2) {
      return 'top';
    }
    return 'bottom';
  }, []);

  const handleDragOver = React.useCallback(
    (event: React.DragEvent) => {
      if (!event.currentTarget.contains(event.relatedTarget as HTMLElement)) {
        setDropPosition(getDropPosition(event));
      }
    },
    [getDropPosition],
  );

  const handleDragLeave = React.useCallback((event: React.DragEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget as HTMLElement)) {
      setDropPosition(null);
    }
  }, []);

  const handleDrop = React.useCallback(
    (event: React.DragEvent) => {
      setDropPosition(null);
      if (!event.currentTarget.contains(event.relatedTarget as HTMLElement)) {
        event.preventDefault();

        const position = getDropPosition(event);

        const { field: droppedField, modelKey: originSection } = JSON.parse(
          event.dataTransfer.getData('text/plain'),
        ) as FieldTransferObject;

        updatePivotModel({
          field: droppedField,
          targetField: field,
          targetFieldPosition: position,
          originSection,
          targetSection: modelKey,
        });
      }
    },
    [field, updatePivotModel, modelKey, getDropPosition],
  );

  return (
    <GridFieldItemContainer
      {...props}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      dropPosition={dropPosition}
    >
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

  const updatePivotModel = React.useCallback<UpdatePivotModel>(
    ({ field, targetSection, originSection, targetField, targetFieldPosition }) => {
      if (field === targetField) {
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
          const newSectionArray = [...prev[targetSection]];
          let toIndex = newSectionArray.length;
          if (targetField) {
            const fromIndex = newSectionArray.findIndex((item) => {
              if (typeof item === 'string') {
                return item === field;
              }
              return item.field === field;
            });
            if (fromIndex > -1) {
              newSectionArray.splice(fromIndex, 1);
            }
            toIndex = newSectionArray.findIndex((item) => {
              if (typeof item === 'string') {
                return item === targetField;
              }
              return item.field === targetField;
            });
            if (targetFieldPosition === 'bottom') {
              toIndex += 1;
            }
          }

          newSectionArray.splice(toIndex, 0, newItem);
          newModel[targetSection] = newSectionArray;
        }
        if (targetSection !== originSection && originSection) {
          newModel[originSection] = prev[originSection].filter((f) => {
            if (typeof f === 'string') {
              return f !== field;
            }
            return f.field !== field;
          });
        }
        return newModel;
      });
    },
    [onPivotModelChange],
  );

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.removeAttribute('data-drag-over');

    // The drop event was already handled by a child
    if (event.defaultPrevented) {
      return;
    }

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
    updatePivotModel({ field, targetSection, originSection });
  };

  const handleDragOver = React.useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnter = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
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
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-section="rows"
        ref={useAutoAnimate()[0]}
      >
        <PivotSectionTitle>Rows</PivotSectionTitle>
        {pivotModel.rows.length === 0 && <Placeholder />}
        {pivotModel.rows.length > 0 &&
          pivotModel.rows.map((field) => {
            return (
              <GridFieldItem
                key={field}
                field={field}
                modelKey="rows"
                data-field={field}
                updatePivotModel={updatePivotModel}
              >
                {getColumnName(field)}
              </GridFieldItem>
            );
          })}
      </PivotSectionContainer>
      <Divider />
      <PivotSectionContainer
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-section="columns"
        ref={useAutoAnimate()[0]}
      >
        <PivotSectionTitle>Columns</PivotSectionTitle>
        {pivotModel.columns.length === 0 && <Placeholder />}
        {pivotModel.columns.length > 0 &&
          pivotModel.columns.map(({ field, sort }) => {
            return (
              <GridFieldItem
                key={field}
                field={field}
                modelKey="columns"
                updatePivotModel={updatePivotModel}
              >
                {getColumnName(field)} {sort}
              </GridFieldItem>
            );
          })}
      </PivotSectionContainer>
      <Divider />
      <PivotSectionContainer
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-section="values"
        ref={useAutoAnimate()[0]}
      >
        <PivotSectionTitle>Values</PivotSectionTitle>
        {pivotModel.values.length === 0 && <Placeholder />}
        {pivotModel.values.length > 0 &&
          pivotModel.values.map(({ field, aggFunc }) => {
            return (
              <GridFieldItem
                key={field}
                field={field}
                modelKey="values"
                updatePivotModel={updatePivotModel}
              >
                {getColumnName(field)} {aggFunc}
              </GridFieldItem>
            );
          })}
      </PivotSectionContainer>
      <Divider />
      <PivotSectionContainer
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-section={null}
        ref={useAutoAnimate()[0]}
      >
        <PivotSectionTitle>Available fields</PivotSectionTitle>
        {availableFields.map((field) => {
          return (
            <GridFieldItem
              key={field}
              field={field}
              modelKey={null}
              updatePivotModel={updatePivotModel}
            >
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
          <Switch
            checked={pivotMode}
            onChange={(e) => onPivotModeChange(e.target.checked)}
            size="small"
          />
        }
        sx={{ marginLeft: 0, py: 1 }}
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
