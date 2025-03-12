import * as React from 'react';
import { styled } from '@mui/system';
import {
  getDataGridUtilityClass,
  gridClasses,
  GridColDef,
  GridMenu,
  GridSlotProps,
  GridSortDirection,
  NotRendered,
} from '@mui/x-data-grid';
import composeClasses from '@mui/utils/composeClasses';
import { DataGridProcessedProps, vars } from '@mui/x-data-grid/internals';
import useId from '@mui/utils/useId';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { GridPivotModel } from '../../hooks/features/pivoting/gridPivotingInterfaces';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getAvailableAggregationFunctions } from '../../hooks/features/aggregation/gridAggregationUtils';
import { GridPivotFieldMenu } from './GridPivotFieldMenu';
import type { DropPosition, FieldTransferObject, UpdatePivotModel } from './GridPivotPanelBody';

type GridPivotFieldProps = {
  children: React.ReactNode;
  field: FieldTransferObject['field'];
  pivotModel: GridPivotModel;
  updatePivotModel: UpdatePivotModel;
  onPivotModelChange: React.Dispatch<React.SetStateAction<GridPivotModel>>;
  slots: DataGridPremiumProcessedProps['slots'];
  slotProps: DataGridPremiumProcessedProps['slotProps'];
  onDragStart: (modelKey: FieldTransferObject['modelKey']) => void;
  onDragEnd: () => void;
} & (
  | { modelKey: 'columns'; sort: GridPivotModel['columns'][number]['sort']; hidden?: boolean }
  | { modelKey: 'rows'; hidden?: boolean }
  | {
      modelKey: 'values';
      aggFunc: GridPivotModel['values'][number]['aggFunc'];
      colDef: GridColDef;
      hidden?: boolean;
    }
  | { modelKey: null }
);

type OwnerState = GridPivotFieldProps & Pick<DataGridProcessedProps, 'classes'>;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes, modelKey } = ownerState;
  const sorted = modelKey === 'columns' && ownerState.sort;
  const slots = {
    root: ['pivotField', sorted && 'pivotField--sorted'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridPivotFieldRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PivotField',
  overridesResolver: (props, styles) => [
    { [`&.${gridClasses['pivotField--sorted']}`]: styles['pivotField--sorted'] },
    styles.pivotField,
  ],
  shouldForwardProp: (prop) =>
    prop !== 'dropPosition' && prop !== 'section' && prop !== 'ownerState',
})<{
  ownerState: OwnerState;
  dropPosition: DropPosition;
  section: FieldTransferObject['modelKey'];
}>({
  flexShrink: 0,
  position: 'relative',
  padding: vars.spacing(0, 1, 0, 2),
  height: 32,
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing(0.5),
  borderWidth: 0,
  borderTopWidth: 2,
  borderBottomWidth: 2,
  borderStyle: 'solid',
  borderColor: 'transparent',
  margin: '-1px 0', // collapse vertical borders
  cursor: 'grab',
  variants: [
    { props: { dropPosition: 'top' }, style: { borderTopColor: vars.colors.interactive.selected } },
    {
      props: { dropPosition: 'bottom' },
      style: { borderBottomColor: vars.colors.interactive.selected },
    },
    {
      props: { section: null },
      style: { borderTopColor: 'transparent', borderBottomColor: 'transparent' },
    },
  ],
  '&:hover': {
    backgroundColor: vars.colors.interactive.hover,
  },
});

const GridPivotFieldName = styled('span')({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const GridPivotFieldActionContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const GridPivotFieldDragIcon = styled('div')({
  position: 'absolute',
  left: -1,
  width: 16,
  display: 'flex',
  justifyContent: 'center',
  color: vars.colors.foreground.base,
  opacity: 0,
  '[draggable="true"]:hover > &': {
    opacity: 0.3,
  },
});

const GridPivotFieldCheckbox = styled(NotRendered<GridSlotProps['baseCheckbox']>)({
  flex: 1,
  position: 'relative',
  margin: vars.spacing(0, 0, 0, -1),
  cursor: 'grab',
});

function AggregationSelect({
  aggFunc,
  field,
  onPivotModelChange,
  colDef,
}: {
  aggFunc: GridPivotModel['values'][number]['aggFunc'];
  field: FieldTransferObject['field'];
  onPivotModelChange: React.Dispatch<React.SetStateAction<GridPivotModel>>;
  colDef: GridColDef;
}) {
  const rootProps = useGridRootProps();
  const [aggregationMenuOpen, setAggregationMenuOpen] = React.useState(false);
  const aggregationMenuTriggerRef = React.useRef<HTMLDivElement>(null);
  const aggregationMenuTriggerId = useId();
  const aggregationMenuId = useId();

  const availableAggregationFunctions = React.useMemo(
    () =>
      getAvailableAggregationFunctions({
        aggregationFunctions: rootProps.aggregationFunctions,
        colDef,
        isDataSource: false,
      }),
    [colDef, rootProps.aggregationFunctions],
  );

  const handleClick = (func: string) => {
    onPivotModelChange((prev) => {
      return {
        ...prev,
        values: prev.values.map((col) => {
          if (col.field === field) {
            return { ...col, aggFunc: func };
          }
          return col;
        }),
      };
    });
    setAggregationMenuOpen(false);
  };

  return (
    <React.Fragment>
      <rootProps.slots.baseChip
        label={aggFunc}
        size="small"
        variant="outlined"
        ref={aggregationMenuTriggerRef}
        id={aggregationMenuTriggerId}
        aria-haspopup="true"
        aria-controls={aggregationMenuOpen ? aggregationMenuId : undefined}
        aria-expanded={aggregationMenuOpen ? 'true' : undefined}
        onClick={() => setAggregationMenuOpen(!aggregationMenuOpen)}
      />
      <GridMenu
        open={aggregationMenuOpen}
        onClose={() => setAggregationMenuOpen(false)}
        target={aggregationMenuTriggerRef.current}
        position="bottom-start"
      >
        <rootProps.slots.baseMenuList
          id={aggregationMenuId}
          aria-labelledby={aggregationMenuTriggerId}
          autoFocusItem
          {...rootProps.slotProps?.baseMenuList}
        >
          {availableAggregationFunctions.map((func) => (
            <rootProps.slots.baseMenuItem
              key={func}
              selected={aggFunc === func}
              onClick={() => handleClick(func)}
              {...rootProps.slotProps?.baseMenuItem}
            >
              {func}
            </rootProps.slots.baseMenuItem>
          ))}
        </rootProps.slots.baseMenuList>
      </GridMenu>
    </React.Fragment>
  );
}

function GridPivotField(props: GridPivotFieldProps) {
  const {
    children,
    field,
    pivotModel,
    slots,
    updatePivotModel,
    onPivotModelChange,
    onDragStart,
    onDragEnd,
  } = props;
  const rootProps = useGridRootProps();
  const ownerState = { ...props, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const [dropPosition, setDropPosition] = React.useState<DropPosition>(null);

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

  const handleSort = () => {
    const currentSort = props.modelKey === 'columns' ? props.sort : null;
    let newValue: GridSortDirection;

    if (currentSort === 'asc') {
      newValue = 'desc';
    } else if (currentSort === 'desc') {
      newValue = undefined;
    } else {
      newValue = 'asc';
    }

    onPivotModelChange((prev) => {
      return {
        ...prev,
        columns: prev.columns.map((col) => {
          if (col.field === field) {
            return {
              ...col,
              sort: newValue,
            };
          }
          return col;
        }),
      };
    });
  };

  const handleVisibilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.modelKey) {
      onPivotModelChange((prev) => {
        return {
          ...prev,
          [props.modelKey]: prev[props.modelKey].map((col) => {
            if (col.field === field) {
              return { ...col, hidden: !event.target.checked };
            }
            return col;
          }),
        };
      });
    }
  };

  const hideable = props.modelKey !== null;

  return (
    <GridPivotFieldRoot
      ownerState={ownerState}
      className={classes.root}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      dropPosition={dropPosition}
      section={props.modelKey}
      draggable="true"
    >
      <GridPivotFieldDragIcon>
        <slots.columnReorderIcon fontSize="small" />
      </GridPivotFieldDragIcon>

      {hideable ? (
        <GridPivotFieldCheckbox
          as={rootProps.slots.baseCheckbox}
          size="small"
          density="compact"
          truncate
          {...rootProps.slotProps?.baseCheckbox}
          checked={!props.hidden}
          onChange={handleVisibilityChange}
          label={children}
        />
      ) : (
        <GridPivotFieldName>{children}</GridPivotFieldName>
      )}

      <GridPivotFieldActionContainer>
        {props.modelKey === 'columns' && (
          // TODO: finalize this functionality
          // - do we need to define an index here?
          // - should rootProps.disableColumnSorting, colDef.sortable, and colDef.hideSortIcons be respected in pivot mode?
          <rootProps.slots.columnHeaderSortIcon
            field={field}
            direction={props.sort}
            index={undefined}
            sortingOrder={rootProps.sortingOrder}
            {...rootProps.slotProps?.columnHeaderSortIcon}
            onClick={handleSort}
          />
        )}
        {props.modelKey === 'values' && (
          <AggregationSelect
            aggFunc={props.aggFunc}
            field={field}
            colDef={props.colDef}
            onPivotModelChange={onPivotModelChange}
          />
        )}
        <GridPivotFieldMenu
          field={field}
          modelKey={props.modelKey}
          pivotModel={pivotModel}
          updatePivotModel={updatePivotModel}
        />
      </GridPivotFieldActionContainer>
    </GridPivotFieldRoot>
  );
}

export { GridPivotField };
