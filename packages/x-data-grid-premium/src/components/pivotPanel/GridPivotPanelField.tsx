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
  useGridSelector,
} from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { GridColumnSortButton, vars } from '@mui/x-data-grid-pro/internals';
import useId from '@mui/utils/useId';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { GridPivotModel } from '../../hooks/features/pivoting/gridPivotingInterfaces';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getAvailableAggregationFunctions } from '../../hooks/features/aggregation/gridAggregationUtils';
import { GridPivotPanelFieldMenu } from './GridPivotPanelFieldMenu';
import type { FieldTransferObject } from './GridPivotPanelBody';
import type { DropPosition } from '../../hooks/features/pivoting/gridPivotingInterfaces';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { gridPivotInitialColumnsSelector } from '../../hooks/features/pivoting/gridPivotingSelectors';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';

type GridPivotPanelFieldProps = {
  children: React.ReactNode;
  field: FieldTransferObject['field'];
  onDragStart: (modelKey: FieldTransferObject['modelKey']) => void;
  onDragEnd: () => void;
} & (
  | { modelKey: 'columns'; modelValue: GridPivotModel['columns'][number] }
  | { modelKey: 'rows'; modelValue: GridPivotModel['rows'][number] }
  | { modelKey: 'values'; modelValue: GridPivotModel['values'][number] }
  | { modelKey: null }
);

type OwnerState = GridPivotPanelFieldProps &
  Pick<DataGridPremiumProcessedProps, 'classes'> & {
    dropPosition: DropPosition;
    section: FieldTransferObject['modelKey'];
  };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes, modelKey } = ownerState;
  const sorted = modelKey === 'columns' && ownerState.modelValue.sort;
  const slots = {
    root: ['pivotPanelField', sorted && 'pivotPanelField--sorted'],
    name: ['pivotPanelFieldName'],
    actionContainer: ['pivotPanelFieldActionContainer'],
    dragIcon: ['pivotPanelFieldDragIcon'],
    checkbox: ['pivotPanelFieldCheckbox'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridPivotPanelFieldRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PivotPanelField',
  overridesResolver: (props, styles) => [
    { [`&.${gridClasses['pivotPanelField--sorted']}`]: styles['pivotPanelField--sorted'] },
    styles.pivotPanelField,
  ],
})<{ ownerState: OwnerState }>({
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

const GridPivotPanelFieldName = styled('span', {
  name: 'MuiDataGrid',
  slot: 'PivotPanelFieldName',
})<{ ownerState: OwnerState }>({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const GridPivotPanelFieldActionContainer = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PivotPanelFieldActionContainer',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  alignItems: 'center',
});

const GridPivotPanelFieldDragIcon = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PivotPanelFieldDragIcon',
})<{ ownerState: OwnerState }>({
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

const GridPivotPanelFieldCheckbox = styled(NotRendered<GridSlotProps['baseCheckbox']>, {
  name: 'MuiDataGrid',
  slot: 'PivotPanelFieldCheckbox',
})<{ ownerState: OwnerState }>({
  flex: 1,
  position: 'relative',
  margin: vars.spacing(0, 0, 0, -1),
  cursor: 'grab',
});

function AggregationSelect({
  aggFunc,
  field,
}: {
  aggFunc: GridPivotModel['values'][number]['aggFunc'];
  field: FieldTransferObject['field'];
}) {
  const rootProps = useGridRootProps();
  const [aggregationMenuOpen, setAggregationMenuOpen] = React.useState(false);
  const aggregationMenuTriggerRef = React.useRef<HTMLDivElement>(null);
  const aggregationMenuTriggerId = useId();
  const aggregationMenuId = useId();

  const apiRef = useGridApiContext();
  const initialColumns = useGridSelector(apiRef, gridPivotInitialColumnsSelector);
  const colDef = initialColumns.get(field) as GridColDef;

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
    apiRef.current.setPivotModel((prev) => {
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

function GridPivotPanelField(props: GridPivotPanelFieldProps) {
  const { children, field, onDragStart, onDragEnd } = props;
  const rootProps = useGridRootProps();
  const [dropPosition, setDropPosition] = React.useState<DropPosition>(null);
  const section = props.modelKey;
  const ownerState = { ...props, classes: rootProps.classes, dropPosition, section };
  const classes = useUtilityClasses(ownerState);
  const apiRef = useGridPrivateApiContext();

  const handleDragStart = React.useCallback(
    (event: React.DragEvent) => {
      const data: FieldTransferObject = { field, modelKey: section };
      event.dataTransfer.setData('text/plain', JSON.stringify(data));
      event.dataTransfer.dropEffect = 'move';
      onDragStart(section);
    },
    [field, onDragStart, section],
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

        apiRef.current.updatePivotModel({
          field: droppedField,
          targetField: field,
          targetFieldPosition: position,
          originSection,
          targetSection: section,
        });
      }
    },
    [getDropPosition, apiRef, field, section],
  );

  const handleSort = () => {
    const currentSort = section === 'columns' ? props.modelValue.sort : null;
    let newValue: GridSortDirection;

    if (currentSort === 'asc') {
      newValue = 'desc';
    } else if (currentSort === 'desc') {
      newValue = undefined;
    } else {
      newValue = 'asc';
    }

    apiRef.current.setPivotModel((prev) => {
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
    if (section) {
      apiRef.current.setPivotModel((prev) => {
        return {
          ...prev,
          [section]: prev[section].map((col) => {
            if (col.field === field) {
              return { ...col, hidden: !event.target.checked };
            }
            return col;
          }),
        };
      });
    }
  };

  const hideable = section !== null;

  return (
    <GridPivotPanelFieldRoot
      ownerState={ownerState}
      className={classes.root}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      draggable="true"
    >
      <GridPivotPanelFieldDragIcon ownerState={ownerState} className={classes.dragIcon}>
        <rootProps.slots.columnReorderIcon fontSize="small" />
      </GridPivotPanelFieldDragIcon>

      {hideable ? (
        <GridPivotPanelFieldCheckbox
          ownerState={ownerState}
          className={classes.checkbox}
          as={rootProps.slots.baseCheckbox}
          size="small"
          density="compact"
          {...rootProps.slotProps?.baseCheckbox}
          checked={!props.modelValue.hidden || false}
          onChange={handleVisibilityChange}
          label={children}
        />
      ) : (
        <GridPivotPanelFieldName ownerState={ownerState} className={classes.name}>
          {children}
        </GridPivotPanelFieldName>
      )}

      <GridPivotPanelFieldActionContainer
        ownerState={ownerState}
        className={classes.actionContainer}
      >
        {section === 'columns' && (
          <GridColumnSortButton
            field={field}
            direction={props.modelValue.sort}
            sortingOrder={rootProps.sortingOrder}
            onClick={handleSort}
          />
        )}
        {section === 'values' && (
          <AggregationSelect aggFunc={props.modelValue.aggFunc} field={field} />
        )}
        <GridPivotPanelFieldMenu field={field} modelKey={section} />
      </GridPivotPanelFieldActionContainer>
    </GridPivotPanelFieldRoot>
  );
}

export { GridPivotPanelField };
