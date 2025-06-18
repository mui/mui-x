import * as React from 'react';
import { styled } from '@mui/system';
import { getDataGridUtilityClass, GridMenu } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { gridPivotActiveSelector, vars } from '@mui/x-data-grid-pro/internals';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import type { FieldTransferObject, DropPosition } from './GridChartsDataPanelBody';
import { GridChartsDataPanelFieldMenu } from './GridChartsDataPanelFieldMenu';
import { gridAggregationModelSelector } from '../../hooks/features/aggregation';
import { getAvailableAggregationFunctions } from '../../hooks/features/aggregation/gridAggregationUtils';
import { COLUMN_GROUP_ID_SEPARATOR } from '../../constants/columnGroups';

type GridChartsDataPanelFieldProps = {
  children: React.ReactNode;
  field: string;
  zone: 'categories' | 'series' | null;
  onDragStart: (zone: 'categories' | 'series' | null) => void;
  onDragEnd: () => void;
};

type OwnerState = GridChartsDataPanelFieldProps &
  Pick<DataGridPremiumProcessedProps, 'classes'> & {
    dropPosition: DropPosition;
    zone: 'categories' | 'series' | null;
  };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;
  const slots = {
    root: ['chartsDataPanelField'],
    name: ['chartsDataPanelFieldName'],
    actionContainer: ['chartsDataPanelFieldActionContainer'],
    dragIcon: ['chartsDataPanelFieldDragIcon'],
    checkbox: ['chartsDataPanelFieldCheckbox'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridChartsDataPanelFieldRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsDataPanelField',
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
      props: { zone: null },
      style: { borderTopColor: 'transparent', borderBottomColor: 'transparent' },
    },
  ],
  '&:hover': {
    backgroundColor: vars.colors.interactive.hover,
  },
});

const GridChartsDataPanelFieldName = styled('span', {
  name: 'MuiDataGrid',
  slot: 'ChartsDataPanelFieldName',
})<{ ownerState: OwnerState }>({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const GridChartsDataPanelFieldActionContainer = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsDataPanelFieldActionContainer',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  alignItems: 'center',
});

const GridChartsDataPanelFieldDragIcon = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsDataPanelFieldDragIcon',
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

export function AggregationSelect({
  aggFunc,
  field,
}: {
  aggFunc: string;
  field: FieldTransferObject['field'];
}) {
  const rootProps = useGridRootProps();
  const [aggregationMenuOpen, setAggregationMenuOpen] = React.useState(false);
  const aggregationMenuTriggerRef = React.useRef<HTMLDivElement>(null);
  const aggregationMenuTriggerId = React.useId();
  const aggregationMenuId = React.useId();

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
      ...(pivotActive ? [] : ['none']),
      ...getAvailableAggregationFunctions({
        aggregationFunctions: rootProps.aggregationFunctions,
        colDef: colDef(field),
        isDataSource: !!rootProps.dataSource,
      }),
    ],
    [colDef, field, pivotActive, rootProps.aggregationFunctions, rootProps.dataSource],
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
      } else {
        apiRef.current.setAggregationModel({ ...aggregationModel, [field]: func });
      }
      setAggregationMenuOpen(false);
    },
    [apiRef, field, getActualFieldName, pivotActive, aggregationModel, setAggregationMenuOpen],
  );

  return (
    <React.Fragment>
      <rootProps.slots.baseChip
        label={rootProps.aggregationFunctions[aggFunc]?.label ?? aggFunc}
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
              {rootProps.aggregationFunctions[func]?.label ?? func}
            </rootProps.slots.baseMenuItem>
          ))}
        </rootProps.slots.baseMenuList>
      </GridMenu>
    </React.Fragment>
  );
}

function GridChartsDataPanelField(props: GridChartsDataPanelFieldProps) {
  const { children, field, onDragStart, onDragEnd } = props;
  const rootProps = useGridRootProps();
  const [dropPosition, setDropPosition] = React.useState<DropPosition>(null);
  const section = props.zone;
  const ownerState = { ...props, classes: rootProps.classes, dropPosition, section };
  const classes = useUtilityClasses(ownerState);
  const apiRef = useGridPrivateApiContext();
  const aggregationModel = gridAggregationModelSelector(apiRef);

  const handleDragStart = React.useCallback(
    (event: React.DragEvent) => {
      const data: FieldTransferObject = { field, zone: section };
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

        const { field: droppedField, zone: originSection } = JSON.parse(
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

  return (
    <GridChartsDataPanelFieldRoot
      ownerState={ownerState}
      className={classes.root}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      draggable="true"
    >
      <GridChartsDataPanelFieldDragIcon ownerState={ownerState} className={classes.dragIcon}>
        <rootProps.slots.columnReorderIcon fontSize="small" />
      </GridChartsDataPanelFieldDragIcon>

      <GridChartsDataPanelFieldName ownerState={ownerState} className={classes.name}>
        {children}
      </GridChartsDataPanelFieldName>
      {section === 'series' && (
        <AggregationSelect aggFunc={aggregationModel[field] ?? 'none'} field={field} />
      )}
      <GridChartsDataPanelFieldActionContainer
        ownerState={ownerState}
        className={classes.actionContainer}
      >
        <GridChartsDataPanelFieldMenu field={field} zone={section} />
      </GridChartsDataPanelFieldActionContainer>
    </GridChartsDataPanelFieldRoot>
  );
}

export { GridChartsDataPanelField };
