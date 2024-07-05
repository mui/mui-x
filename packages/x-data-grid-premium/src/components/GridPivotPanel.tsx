import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import { GridColDef, GridSortDirection } from '@mui/x-data-grid';
import useLazyRef from '@mui/utils/useLazyRef';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { PivotModel } from '../hooks/features/pivoting/useGridPivoting';
import { useResize } from '../hooks/utils/useResize';
import type { DataGridPremiumProcessedProps } from '../models/dataGridPremiumProps';
import { useGridRootProps } from '../typeOverloads/reexports';
import { getAvailableAggregationFunctions } from '../hooks/features/aggregation/gridAggregationUtils';

const GridPivotPanelContainerStyled = styled('div')({
  width: 250,
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
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
  userSelect: 'none',
  touchAction: 'pan-x',
  '&:hover': {
    borderLeft: `1px solid ${theme.palette.action.active}`,
  },
}));

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
    flexShrink: 0,

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

const GridFieldItemContainer = styled('div')<{
  dropPosition: DropPosition;
  section: FieldTransferObject['modelKey'];
}>(({ theme }) => ({
  width: '100%',
  padding: '0 4px',
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
    {
      props: { section: null },
      style: { padding: '4px' },
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

const sortDirections: GridSortDirection[] = ['asc', 'desc', undefined];

function SortSelect({
  sort,
  field,
  onPivotModelChange,
}: {
  sort: PivotModel['columns'][number]['sort'];
  field: FieldTransferObject['field'];
  onPivotModelChange: React.Dispatch<React.SetStateAction<PivotModel>>;
}) {
  const rootProps = useGridRootProps();

  return (
    <rootProps.slots.baseSelect
      size="small"
      variant="standard"
      sx={{ marginLeft: 'auto', fontSize: '12px' }}
      value={sort || ''}
      onChange={(event) => {
        const newValue = (event.target.value || undefined) as GridSortDirection;
        onPivotModelChange((prev) => {
          return {
            ...prev,
            columns: prev.columns.map((col) => {
              if (col.field === field) {
                return {
                  ...col,
                  sort: newValue!,
                };
              }
              return col;
            }),
          };
        });
      }}
    >
      {sortDirections.map((sortDirection) => (
        <rootProps.slots.baseSelectOption
          key={sortDirection || ''}
          value={sortDirection || ''}
          // @ts-ignore FIXME
          style={{ fontSize: '12px' }}
        >
          {sortDirection === 'asc' && 'A — Z'}
          {sortDirection === 'desc' && 'Z — A'}
          {sortDirection === undefined && 'None'}
        </rootProps.slots.baseSelectOption>
      ))}
    </rootProps.slots.baseSelect>
  );
}

function AggregationSelect({
  aggFunc,
  field,
  onPivotModelChange,
  colDef,
}: {
  aggFunc: PivotModel['values'][number]['aggFunc'];
  field: FieldTransferObject['field'];
  onPivotModelChange: React.Dispatch<React.SetStateAction<PivotModel>>;
  colDef: GridColDef;
}) {
  const rootProps = useGridRootProps();

  const availableAggregationFunctions = React.useMemo(
    () =>
      getAvailableAggregationFunctions({
        aggregationFunctions: rootProps.aggregationFunctions,
        colDef,
      }),
    [colDef, rootProps.aggregationFunctions],
  );

  return (
    <rootProps.slots.baseSelect
      size="small"
      variant="standard"
      sx={{ marginLeft: 'auto', fontSize: '12px' }}
      value={aggFunc}
      onChange={(event) => {
        const newValue = event.target.value as string;
        onPivotModelChange((prev) => {
          return {
            ...prev,
            values: prev.values.map((col) => {
              if (col.field === field) {
                return {
                  ...col,
                  aggFunc: newValue,
                };
              }
              return col;
            }),
          };
        });
      }}
    >
      {availableAggregationFunctions.map((func) => (
        <rootProps.slots.baseSelectOption
          key={func}
          value={func}
          // @ts-ignore FIXME
          style={{ fontSize: '12px' }}
        >
          {func}
        </rootProps.slots.baseSelectOption>
      ))}
    </rootProps.slots.baseSelect>
  );
}

function GridFieldItem({
  children,
  field,
  updatePivotModel,
  onPivotModelChange,
  slots,
  slotProps,
  ...props
}: {
  children: React.ReactNode;
  field: FieldTransferObject['field'];
  updatePivotModel: UpdatePivotModel;
  onPivotModelChange: React.Dispatch<React.SetStateAction<PivotModel>>;
  slots: DataGridPremiumProcessedProps['slots'];
  slotProps: DataGridPremiumProcessedProps['slotProps'];
} & (
  | { modelKey: 'columns'; sort: PivotModel['columns'][number]['sort'] }
  | { modelKey: 'rows' }
  | { modelKey: 'values'; aggFunc: PivotModel['values'][number]['aggFunc']; colDef: GridColDef }
  | { modelKey: null }
)) {
  const [dropPosition, setDropPosition] = React.useState<DropPosition>(null);

  const handleDragStart = React.useCallback(
    (event: React.DragEvent) => {
      const data: FieldTransferObject = { field, modelKey: props.modelKey };
      event.dataTransfer.setData('text/plain', JSON.stringify(data));
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.setDragImage(
        (event.target as HTMLElement).parentElement!,
        event.nativeEvent.offsetX,
        event.nativeEvent.offsetY,
      );
    },
    [field, props.modelKey],
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
          targetSection: props.modelKey,
        });
      }
    },
    [field, updatePivotModel, props.modelKey, getDropPosition],
  );

  const handleDeleteClick = React.useCallback(() => {
    updatePivotModel({
      field,
      targetSection: null,
      originSection: props.modelKey,
    });
  }, [field, props.modelKey, updatePivotModel]);

  return (
    <GridFieldItemContainer
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      dropPosition={dropPosition}
      section={props.modelKey}
    >
      <DragHandle draggable="true" onDragStart={handleDragStart}>
        <slots.columnReorderIcon fontSize="small" />
      </DragHandle>
      {children}
      <div style={{ marginLeft: 'auto' }}>
        {props.modelKey === 'columns' && (
          <SortSelect sort={props.sort} field={field} onPivotModelChange={onPivotModelChange} />
        )}
        {props.modelKey === 'values' && (
          <AggregationSelect
            aggFunc={props.aggFunc}
            field={field}
            colDef={props.colDef}
            onPivotModelChange={onPivotModelChange}
          />
        )}
        {props.modelKey !== null && (
          <slots.baseIconButton onClick={handleDeleteClick} size="small" edge="end">
            <slots.filterPanelDeleteIcon fontSize="inherit" />
          </slots.baseIconButton>
        )}
      </div>
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
  const rootProps = useGridRootProps();

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

          if (targetSection === 'values') {
            const availableAggregationFunctions = getAvailableAggregationFunctions({
              aggregationFunctions: rootProps.aggregationFunctions,
              colDef: initialColumnsLookup[field],
            });
            newSectionArray.splice(toIndex, 0, {
              field,
              aggFunc: availableAggregationFunctions[0],
            });
            newModel.values = newSectionArray as PivotModel['values'];
          } else if (targetSection === 'columns') {
            newSectionArray.splice(toIndex, 0, { field, sort: 'asc' });
            newModel.columns = newSectionArray as PivotModel['columns'];
          } else if (targetSection === 'rows') {
            newSectionArray.splice(toIndex, 0, field);
            newModel.rows = newSectionArray as PivotModel['rows'];
          }
        }
        if (targetSection !== originSection && originSection) {
          // @ts-ignore FIXME
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
    [initialColumnsLookup, onPivotModelChange, rootProps.aggregationFunctions],
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 1,
      }}
    >
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
                onPivotModelChange={onPivotModelChange}
                slots={rootProps.slots}
                slotProps={rootProps.slotProps}
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
          pivotModel.columns.map((item) => {
            const { field, sort } = item;
            return (
              <GridFieldItem
                key={field}
                field={field}
                modelKey="columns"
                updatePivotModel={updatePivotModel}
                onPivotModelChange={onPivotModelChange}
                slots={rootProps.slots}
                slotProps={rootProps.slotProps}
                sort={sort}
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
                onPivotModelChange={onPivotModelChange}
                slots={rootProps.slots}
                slotProps={rootProps.slotProps}
                aggFunc={aggFunc}
                colDef={initialColumnsLookup[field]}
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
        data-section={null}
        ref={useAutoAnimate()[0]}
        sx={{ flexShrink: 1, overflow: 'auto' }}
      >
        <PivotSectionTitle>Available fields</PivotSectionTitle>
        {availableFields.map((field) => {
          return (
            <GridFieldItem
              key={field}
              field={field}
              modelKey={null}
              updatePivotModel={updatePivotModel}
              onPivotModelChange={onPivotModelChange}
              slots={rootProps.slots}
              slotProps={rootProps.slotProps}
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
  pivotParams,
}: {
  pivotParams: NonNullable<DataGridPremiumProcessedProps['pivotParams']>;
}) {
  const { pivotMode, onPivotModeChange, pivotModel, onPivotModelChange } = pivotParams;

  return (
    <React.Fragment>
      <div>
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
      </div>
      <Divider />
      {pivotMode && (
        <GridPivotPanelContent
          pivotModel={pivotModel}
          columns={pivotParams.initialColumns ?? []}
          onPivotModelChange={onPivotModelChange}
        />
      )}
    </React.Fragment>
  );
}
