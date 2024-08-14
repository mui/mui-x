import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import { GridColDef, GridSortDirection } from '@mui/x-data-grid';
import useLazyRef from '@mui/utils/useLazyRef';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import FormControlLabel, { formControlLabelClasses } from '@mui/material/FormControlLabel';
import Typography, { typographyClasses } from '@mui/material/Typography';
import { svgIconClasses } from '@mui/material/SvgIcon';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { PivotModel } from '../../../hooks/features/pivoting/useGridPivoting';
import { useGridRootProps } from '../../../typeOverloads/reexports';
import { getAvailableAggregationFunctions } from '../../../hooks/features/aggregation/gridAggregationUtils';

function AutoAnimateContainer(props: React.HTMLAttributes<HTMLDivElement>) {
  const [parent] = useAutoAnimate({ duration: 150 });
  return <div ref={parent} {...props} />;
}

const PivotSectionContainer = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const PivotSection = styled(AutoAnimateContainer)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  transition: 'background-color 0.15s ease-in-out',
  '& + &': {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  '&[data-drag-over="true"]': {
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
  },
}));

const PivotSectionTitle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  fontSize: theme.typography.pxToRem(14),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.secondary,
  padding: theme.spacing(1.25, 2.5),
  [`.${svgIconClasses.root}`]: {
    fontSize: theme.typography.pxToRem(18),
  },
}));

const PivotSectionList = styled(AutoAnimateContainer)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
});

const PivotSectionPlaceholder = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 60,
  margin: theme.spacing(0, 2.5, 2),
  border: `1px dashed ${theme.palette.grey[400]}`,
  borderRadius: 4,
  color: theme.palette.text.secondary,
  transitionProperty: 'color, border-color',
  transitionDuration: '0.15s',
  transitionTimingFunction: 'ease-in-out',
  '[data-dragging="true"] &': {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
  '[data-drag-over="true"] &': {
    borderWidth: 2,
    borderStyle: 'solid',
  },
}));

const PivotField = styled('div')<{
  dropPosition: DropPosition;
  section: FieldTransferObject['modelKey'];
}>(({ theme }) => ({
  flexShrink: 0,
  paddingRight: theme.spacing(1.5),
  height: '35px',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  borderWidth: 0,
  borderTopWidth: 2,
  borderBottomWidth: 2,
  borderStyle: 'solid',
  borderColor: 'transparent',
  margin: '-1px 0', // collapse vertical borders
  cursor: 'grab',
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

const PivotFieldLabel = styled('div')(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  [`.${formControlLabelClasses.root}`]: {
    width: '100%',
    cursor: 'grab',
  },
  [`.${typographyClasses.root}`]: {
    fontSize: theme.typography.pxToRem(14),
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
}));

const PivotFieldDragHandle = styled('div')(({ theme }) => ({
  display: 'flex',
  color: theme.palette.text.primary,
  opacity: 0,
  marginRight: theme.spacing(-0.5),
  '[draggable="true"]:hover > &': {
    opacity: 0.3,
  },
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

function PivotSectionListItem({
  children,
  field,
  updatePivotModel,
  onPivotModelChange,
  slots,
  slotProps,
  onDragStart,
  onDragEnd,
  ...props
}: {
  children: React.ReactNode;
  field: FieldTransferObject['field'];
  updatePivotModel: UpdatePivotModel;
  onPivotModelChange: React.Dispatch<React.SetStateAction<PivotModel>>;
  slots: DataGridPremiumProcessedProps['slots'];
  slotProps: DataGridPremiumProcessedProps['slotProps'];
  onDragStart: (modelKey: FieldTransferObject['modelKey']) => void;
  onDragEnd: () => void;
} & (
  | { modelKey: 'columns'; sort: PivotModel['columns'][number]['sort'] }
  | { modelKey: 'rows' }
  | { modelKey: 'values'; aggFunc: PivotModel['values'][number]['aggFunc']; colDef: GridColDef }
  | { modelKey: null }
)) {
  const [dropPosition, setDropPosition] = React.useState<DropPosition>(null);
  const rootProps = useGridRootProps();

  const handleDragStart = React.useCallback(
    (event: React.DragEvent) => {
      const data: FieldTransferObject = { field, modelKey: props.modelKey };
      event.dataTransfer.setData('text/plain', JSON.stringify(data));
      event.dataTransfer.dropEffect = 'move';
      onDragStart(props.modelKey);
    },
    [field, onDragStart, props.modelKey],
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
    [getDropPosition, updatePivotModel, field, props.modelKey],
  );

  const isSelectable = props.modelKey !== null;

  return (
    <PivotField
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      dropPosition={dropPosition}
      section={props.modelKey}
      draggable="true"
    >
      <PivotFieldDragHandle>
        <slots.columnReorderIcon fontSize="small" />
      </PivotFieldDragHandle>

      <PivotFieldLabel>
        {isSelectable ? (
          <FormControlLabel
            control={
              <rootProps.slots.baseCheckbox
                size="small"
                {...rootProps.slotProps?.baseCheckbox}
                // TODO: implement column visibility
                defaultChecked
              />
            }
            label={children}
          />
        ) : (
          <Typography>{children}</Typography>
        )}
      </PivotFieldLabel>

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
      <rootProps.slots.baseIconButton size="small" {...rootProps.slotProps?.baseIconButton}>
        <rootProps.slots.columnMenuIcon fontSize="small" />
      </rootProps.slots.baseIconButton>
    </PivotField>
  );
}

const INITIAL_DRAG_STATE = { active: false, dropZone: null, initialModelKey: null };

export function GridSidebarColumnPanelBody({
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
  const [drag, setDrag] = React.useState<{
    active: boolean;
    dropZone: FieldTransferObject['modelKey'];
    initialModelKey: FieldTransferObject['modelKey'];
  }>(INITIAL_DRAG_STATE);

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

  const handleDragStart = (modelKey: FieldTransferObject['modelKey']) => {
    setDrag({ active: true, initialModelKey: modelKey, dropZone: null });
  };

  const handleDragEnd = () => {
    setDrag(INITIAL_DRAG_STATE);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    setDrag(INITIAL_DRAG_STATE);

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
      const dropZone = event.currentTarget.getAttribute(
        'data-section',
      ) as FieldTransferObject['modelKey'];
      setDrag((v) => ({ ...v, active: true, dropZone }));
    }
  }, []);

  const handleDragLeave = React.useCallback((event: React.DragEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget as HTMLElement)) {
      setDrag((v) => ({ ...v, active: true, dropZone: v.initialModelKey }));
    }
  }, []);

  return (
    <PivotSectionContainer data-dragging={drag.active} onDragLeave={handleDragLeave}>
      <PivotSection
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        data-section={null}
        data-drag-over={drag.active && drag.dropZone === null}
      >
        {availableFields.length === 0 && (
          <PivotSectionPlaceholder>Drag here to remove from pivot</PivotSectionPlaceholder>
        )}
        {availableFields.length > 0 && (
          <PivotSectionList>
            {availableFields.map((field) => {
              return (
                <PivotSectionListItem
                  key={field}
                  field={field}
                  modelKey={null}
                  updatePivotModel={updatePivotModel}
                  onPivotModelChange={onPivotModelChange}
                  slots={rootProps.slots}
                  slotProps={rootProps.slotProps}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  {getColumnName(field)}
                </PivotSectionListItem>
              );
            })}
          </PivotSectionList>
        )}
      </PivotSection>

      <PivotSection
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        data-section="rows"
        data-drag-over={drag.dropZone === 'rows'}
      >
        <PivotSectionTitle>
          {/* TODO: Replace with pivotRowsIcon or a more generic rowsIcon */}
          <rootProps.slots.densityStandardIcon />
          Rows
        </PivotSectionTitle>
        {pivotModel.rows.length === 0 && (
          <PivotSectionPlaceholder>Drag here to create rows</PivotSectionPlaceholder>
        )}
        {pivotModel.rows.length > 0 && (
          <PivotSectionList>
            {pivotModel.rows.map((field) => {
              return (
                <PivotSectionListItem
                  key={field}
                  field={field}
                  modelKey="rows"
                  data-field={field}
                  updatePivotModel={updatePivotModel}
                  onPivotModelChange={onPivotModelChange}
                  slots={rootProps.slots}
                  slotProps={rootProps.slotProps}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  {getColumnName(field)}
                </PivotSectionListItem>
              );
            })}
          </PivotSectionList>
        )}
      </PivotSection>

      <PivotSection
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        data-section="columns"
        data-drag-over={drag.dropZone === 'columns'}
      >
        <PivotSectionTitle>
          {/* TODO: Replace with pivotColumnsIcon or a more generic columnsIcon */}
          <rootProps.slots.columnSelectorIcon />
          Columns
        </PivotSectionTitle>
        {pivotModel.columns.length === 0 && (
          <PivotSectionPlaceholder>Drag here to create columns</PivotSectionPlaceholder>
        )}
        {pivotModel.columns.length > 0 && (
          <PivotSectionList>
            {pivotModel.columns.map((item) => {
              const { field, sort } = item;
              return (
                <PivotSectionListItem
                  key={field}
                  field={field}
                  modelKey="columns"
                  updatePivotModel={updatePivotModel}
                  onPivotModelChange={onPivotModelChange}
                  slots={rootProps.slots}
                  slotProps={rootProps.slotProps}
                  sort={sort}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  {getColumnName(field)}
                </PivotSectionListItem>
              );
            })}
          </PivotSectionList>
        )}
      </PivotSection>

      <PivotSection
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        data-section="values"
        data-drag-over={drag.dropZone === 'values'}
      >
        <PivotSectionTitle>
          {/* TODO: Replace with pivotValuesIcon or a more generic valuesIcon */}
          <rootProps.slots.columnMenuAggregationIcon />
          Values
        </PivotSectionTitle>
        {pivotModel.values.length === 0 && (
          <PivotSectionPlaceholder>Drag here to create values</PivotSectionPlaceholder>
        )}
        {pivotModel.values.length > 0 && (
          <PivotSectionList>
            {pivotModel.values.map(({ field, aggFunc }) => {
              return (
                <PivotSectionListItem
                  key={field}
                  field={field}
                  modelKey="values"
                  updatePivotModel={updatePivotModel}
                  onPivotModelChange={onPivotModelChange}
                  slots={rootProps.slots}
                  slotProps={rootProps.slotProps}
                  aggFunc={aggFunc}
                  colDef={initialColumnsLookup[field]}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  {getColumnName(field)}
                </PivotSectionListItem>
              );
            })}
          </PivotSectionList>
        )}
      </PivotSection>
    </PivotSectionContainer>
  );
}
