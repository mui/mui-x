'use client';
import * as React from 'react';
import useId from '@mui/utils/useId';
import { styled } from '@mui/system';
import {
  getDataGridUtilityClass,
  GridMenu,
  GridSlotProps,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { gridPivotActiveSelector, NotRendered, vars } from '@mui/x-data-grid-pro/internals';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { useGridPrivateApiContext } from '../../../hooks/utils/useGridPrivateApiContext';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { FieldTransferObject, DropPosition } from './GridChartsPanelDataBody';
import { GridChartsPanelDataFieldMenu } from './GridChartsPanelDataFieldMenu';
import { gridAggregationModelSelector } from '../../../hooks/features/aggregation';
import { gridRowGroupingSanitizedModelSelector } from '../../../hooks/features/rowGrouping/gridRowGroupingSelector';
import {
  getAggregationFunctionLabel,
  getAvailableAggregationFunctions,
} from '../../../hooks/features/aggregation/gridAggregationUtils';
import type { GridChartsIntegrationSection } from '../../../hooks/features/chartsIntegration/gridChartsIntegrationInterfaces';
import { COLUMN_GROUP_ID_SEPARATOR } from '../../../constants/columnGroups';

const AGGREGATION_FUNCTION_NONE = 'none';

type GridChartsPanelDataFieldProps = {
  children: React.ReactNode;
  field: string;
  section: GridChartsIntegrationSection;
  blockedSections?: string[];
  dimensionsLabel: string;
  valuesLabel: string;
  disabled?: boolean;
  selected?: boolean;
  onChange?: (field: string, section: GridChartsIntegrationSection) => void;
  onDragStart: (field: string, section: GridChartsIntegrationSection) => void;
  onDragEnd: () => void;
};

type OwnerState = GridChartsPanelDataFieldProps &
  Pick<DataGridPremiumProcessedProps, 'classes'> & {
    dropPosition: DropPosition;
    section: GridChartsIntegrationSection;
  };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;
  const slots = {
    root: ['chartsPanelDataField'],
    name: ['chartsPanelDataFieldName'],
    actionContainer: ['chartsPanelDataFieldActionContainer'],
    dragIcon: ['chartsPanelDataFieldDragIcon'],
    checkbox: ['chartsPanelDataFieldCheckbox'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridChartsPanelDataFieldRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelDataField',
})<{ ownerState: OwnerState; disabled: boolean }>(({ disabled }) => ({
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
  cursor: disabled ? 'not-allowed' : 'grab',
  opacity: disabled ? 0.5 : 1,
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
}));

const GridChartsPanelDataFieldName = styled('span', {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelDataFieldName',
})<{ ownerState: OwnerState }>({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const GridChartsPanelDataFieldActionContainer = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelDataFieldActionContainer',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  alignItems: 'center',
});

const GridChartsPanelDataFieldDragIcon = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelDataFieldDragIcon',
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

const GridChartsPanelDataFieldCheckbox = styled(NotRendered<GridSlotProps['baseCheckbox']>, {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelDataFieldCheckbox',
})<{ ownerState: OwnerState }>({
  flex: 1,
  position: 'relative',
  margin: vars.spacing(0, 0, 0, -1),
  cursor: 'grab',
});

export function AggregationSelect({
  aggFunc,
  field,
}: {
  aggFunc: string;
  field: FieldTransferObject['field'];
}) {
  const { slots, slotProps, aggregationFunctions, dataSource } = useGridRootProps();
  const [aggregationMenuOpen, setAggregationMenuOpen] = React.useState(false);
  const aggregationMenuTriggerRef = React.useRef<HTMLDivElement>(null);
  const aggregationMenuTriggerId = useId();
  const aggregationMenuId = useId();

  const apiRef = useGridApiContext();
  const aggregationModel = gridAggregationModelSelector(apiRef);
  const pivotActive = gridPivotActiveSelector(apiRef);

  const getActualFieldName = React.useCallback(
    (fieldName: string) =>
      pivotActive ? fieldName.split(COLUMN_GROUP_ID_SEPARATOR).slice(-1)[0] : fieldName,
    [pivotActive],
  );

  const colDef = React.useCallback(
    (fieldName: string) => apiRef.current.getColumn(getActualFieldName(fieldName)),
    [apiRef, getActualFieldName],
  );

  const availableAggregationFunctions = React.useMemo(
    () => [
      ...(pivotActive ? [] : [AGGREGATION_FUNCTION_NONE]),
      ...getAvailableAggregationFunctions({
        aggregationFunctions,
        colDef: colDef(field),
        isDataSource: !!dataSource,
      }),
    ],
    [colDef, field, pivotActive, aggregationFunctions, dataSource],
  );

  const handleClick = React.useCallback(
    (func: string) => {
      if (pivotActive) {
        const fieldName = getActualFieldName(field);
        apiRef.current.setPivotModel((prev) => ({
          ...prev,
          values: prev.values.map((col) => {
            if (col.field === fieldName) {
              return { ...col, aggFunc: func };
            }
            return col;
          }),
        }));
      } else if (func === AGGREGATION_FUNCTION_NONE) {
        const updatedAggregationModel = { ...aggregationModel };
        delete updatedAggregationModel[field];
        apiRef.current.setAggregationModel(updatedAggregationModel);
      } else {
        apiRef.current.setAggregationModel({ ...aggregationModel, [field]: func });
      }

      setAggregationMenuOpen(false);
    },
    [apiRef, field, getActualFieldName, pivotActive, aggregationModel, setAggregationMenuOpen],
  );

  return availableAggregationFunctions.length > 0 ? (
    <React.Fragment>
      <slots.baseChip
        label={getAggregationFunctionLabel({
          apiRef,
          aggregationRule: {
            aggregationFunctionName: aggFunc,
            aggregationFunction: aggregationFunctions[aggFunc] || {},
          },
        })}
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
        <slots.baseMenuList
          id={aggregationMenuId}
          aria-labelledby={aggregationMenuTriggerId}
          autoFocusItem
          {...slotProps?.baseMenuList}
        >
          {availableAggregationFunctions.map((func) => (
            <slots.baseMenuItem
              key={func}
              selected={aggFunc === func}
              onClick={() => handleClick(func)}
              {...slotProps?.baseMenuItem}
            >
              {getAggregationFunctionLabel({
                apiRef,
                aggregationRule: {
                  aggregationFunctionName: func,
                  aggregationFunction: aggregationFunctions[func] || {},
                },
              })}
            </slots.baseMenuItem>
          ))}
        </slots.baseMenuList>
      </GridMenu>
    </React.Fragment>
  ) : null;
}

function GridChartsPanelDataField(props: GridChartsPanelDataFieldProps) {
  const {
    children,
    field,
    section,
    blockedSections,
    dimensionsLabel,
    valuesLabel,
    selected,
    disabled,
    onChange,
    onDragStart,
    onDragEnd,
  } = props;
  const { slots, slotProps, classes: classesRootProps } = useGridRootProps();
  const [dropPosition, setDropPosition] = React.useState<DropPosition>(null);
  const ownerState = { ...props, classes: classesRootProps, dropPosition, section };
  const classes = useUtilityClasses(ownerState);
  const apiRef = useGridPrivateApiContext();
  const aggregationModel = useGridSelector(apiRef, gridAggregationModelSelector);
  const rowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);
  const isRowGroupingEnabled = React.useMemo(() => rowGroupingModel.length > 0, [rowGroupingModel]);

  const handleDragStart = React.useCallback(
    (event: React.DragEvent) => {
      const data: FieldTransferObject = { field, section };
      event.dataTransfer.setData('text/plain', JSON.stringify(data));
      event.dataTransfer.dropEffect = 'move';
      onDragStart(field, section);
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
      if (disabled) {
        return;
      }

      if (!event.currentTarget.contains(event.relatedTarget as HTMLElement)) {
        setDropPosition(getDropPosition(event));
      }
    },
    [disabled, getDropPosition],
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

        const { field: droppedField, section: originSection } = JSON.parse(
          event.dataTransfer.getData('text/plain'),
        ) as FieldTransferObject;

        apiRef.current.chartsIntegration.updateDataReference(
          droppedField,
          originSection,
          section,
          field,
          position || undefined,
        );
      }
    },
    [getDropPosition, apiRef, field, section],
  );

  const hideable = section !== null;

  return (
    <slots.baseTooltip
      title={disabled ? apiRef.current.getLocaleText('chartsFieldBlocked') : undefined}
      enterDelay={1000}
      {...slotProps?.baseTooltip}
    >
      <GridChartsPanelDataFieldRoot
        ownerState={ownerState}
        className={classes.root}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        draggable={!disabled}
        disabled={!!disabled}
      >
        <GridChartsPanelDataFieldDragIcon ownerState={ownerState} className={classes.dragIcon}>
          <slots.columnReorderIcon fontSize="small" />
        </GridChartsPanelDataFieldDragIcon>

        {hideable ? (
          <GridChartsPanelDataFieldCheckbox
            ownerState={ownerState}
            className={classes.checkbox}
            as={slots.baseCheckbox}
            size="small"
            density="compact"
            {...slotProps?.baseCheckbox}
            checked={selected || false}
            onChange={() => onChange && onChange(field, section)}
            label={children}
          />
        ) : (
          <GridChartsPanelDataFieldName ownerState={ownerState} className={classes.name}>
            {children}
          </GridChartsPanelDataFieldName>
        )}

        <GridChartsPanelDataFieldActionContainer
          ownerState={ownerState}
          className={classes.actionContainer}
        >
          {isRowGroupingEnabled && section === 'values' && (
            <AggregationSelect
              aggFunc={aggregationModel[field] ?? AGGREGATION_FUNCTION_NONE}
              field={field}
            />
          )}
          <GridChartsPanelDataFieldMenu
            field={field}
            section={section}
            blockedSections={blockedSections}
            dimensionsLabel={dimensionsLabel}
            valuesLabel={valuesLabel}
          />
        </GridChartsPanelDataFieldActionContainer>
      </GridChartsPanelDataFieldRoot>
    </slots.baseTooltip>
  );
}

export { GridChartsPanelDataField };
