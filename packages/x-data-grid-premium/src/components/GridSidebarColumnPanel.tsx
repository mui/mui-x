import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { GridColDef, GridSortDirection } from '@mui/x-data-grid';
import useLazyRef from '@mui/utils/useLazyRef';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { PivotModel } from '../hooks/features/pivoting/useGridPivoting';
import type { DataGridPremiumProcessedProps } from '../models/dataGridPremiumProps';
import { useGridRootProps } from '../typeOverloads/reexports';
import { getAvailableAggregationFunctions } from '../hooks/features/aggregation/gridAggregationUtils';
import { GridSidebarCloseButton, GridSidebarHeader } from './GridSidebar';

const PivotSectionContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const PivotSection = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1, 0),
  overflow: 'auto',
  '& + &': {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
}));

const PivotSectionTitle = styled('div')(({ theme }) => ({
  ...theme.typography.caption,
  fontSize: theme.typography.body2.fontSize,
  color: theme.palette.text.secondary,
  padding: theme.spacing(0, 2),
}));

const PivotSectionPlaceholder = styled('div')(({ theme }) => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    margin: theme.spacing(1, 2),
    border: `1px dashed ${theme.palette.grey[400]}`,
    borderRadius: 4,
    color: theme.palette.text.secondary,
    transitionProperty: 'color, border-color',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease-in-out',
    '[data-drag-over="true"] &': {
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
    },
  };
});

const GridFieldItemContainer = styled('div')<{
  dropPosition: DropPosition;
  section: FieldTransferObject['modelKey'];
}>(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '35px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  borderWidth: 0,
  borderTopWidth: 2,
  borderBottomWidth: 2,
  borderStyle: 'solid',
  borderColor: 'transparent',
  transition: 'border-color 0.15s ease-in-out',
  margin: '-2px 0', // collapse vertical borders
  variants: [
    { props: { dropPosition: 'top' }, style: { borderTopColor: theme.palette.primary.main } },
    {
      props: { dropPosition: 'bottom' },
      style: { borderBottomColor: theme.palette.primary.main },
    },
    {
      props: { section: null },
    },
  ],
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const FieldItemLabel = styled('span')({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

const DragHandle = styled('div')(({ theme }) => ({
  display: 'flex',
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  marginLeft: '-5px',
}));

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
      sx={{ fontSize: '12px' }}
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
      sx={{ fontSize: 'small' }}
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
      <FieldItemLabel>{children}</FieldItemLabel>
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
    </GridFieldItemContainer>
  );
}

function GridSidebarColumnBody({
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
    <PivotSectionContainer>
      <PivotSection>
        <div
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          data-section={null}
          ref={useAutoAnimate()[0]}
        >
          {availableFields.length === 0 && (
            <PivotSectionPlaceholder>Drag here to remove from pivot</PivotSectionPlaceholder>
          )}
          {availableFields.length > 0 &&
            availableFields.map((field) => {
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
        </div>
      </PivotSection>

      <PivotSection>
        <div
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          data-section="rows"
          ref={useAutoAnimate()[0]}
        >
          <PivotSectionTitle>Rows</PivotSectionTitle>
          {pivotModel.rows.length === 0 && (
            <PivotSectionPlaceholder>Drag here to create rows</PivotSectionPlaceholder>
          )}
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
        </div>

        <div
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          data-section="columns"
          ref={useAutoAnimate()[0]}
        >
          <PivotSectionTitle>Columns</PivotSectionTitle>
          {pivotModel.columns.length === 0 && (
            <PivotSectionPlaceholder>Drag here to create columns</PivotSectionPlaceholder>
          )}
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
        </div>

        <div
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          data-section="values"
          ref={useAutoAnimate()[0]}
        >
          <PivotSectionTitle>Values</PivotSectionTitle>
          {pivotModel.values.length === 0 && (
            <PivotSectionPlaceholder>Drag here to create values</PivotSectionPlaceholder>
          )}
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
        </div>
      </PivotSection>
    </PivotSectionContainer>
  );
}

export function GridSidebarColumnPanel({
  pivotParams,
}: {
  pivotParams: NonNullable<DataGridPremiumProcessedProps['pivotParams']>;
}) {
  const { pivotMode, onPivotModeChange, pivotModel, onPivotModelChange } = pivotParams;

  return (
    <React.Fragment>
      <GridSidebarHeader>
        <FormControlLabel
          control={
            <Switch
              checked={pivotMode}
              onChange={(e) => onPivotModeChange(e.target.checked)}
              size="small"
            />
          }
          sx={{ ml: -1 }}
          label="Pivot"
          slotProps={{
            typography: {
              variant: 'body2',
            },
          }}
        />
        <GridSidebarCloseButton />
      </GridSidebarHeader>
      {pivotMode && (
        <GridSidebarColumnBody
          pivotModel={pivotModel}
          columns={pivotParams.initialColumns ?? []}
          onPivotModelChange={onPivotModelChange}
        />
      )}
    </React.Fragment>
  );
}
