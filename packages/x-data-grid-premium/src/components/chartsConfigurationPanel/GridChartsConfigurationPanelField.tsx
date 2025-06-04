import * as React from 'react';
import { styled } from '@mui/system';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import type { FieldTransferObject, DropPosition } from './GridChartsConfigurationPanelBody';
import { GridChartsConfigurationPanelFieldMenu } from './GridChartsConfigurationPanelFieldMenu';

type GridChartsConfigurationPanelFieldProps = {
  children: React.ReactNode;
  field: string;
  zone: 'categories' | 'series' | null;
  onDragStart: (zone: 'categories' | 'series' | null) => void;
  onDragEnd: () => void;
};

type OwnerState = GridChartsConfigurationPanelFieldProps &
  Pick<DataGridPremiumProcessedProps, 'classes'> & {
    dropPosition: DropPosition;
    zone: 'categories' | 'series' | null;
  };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;
  const slots = {
    root: ['chartsConfigurationPanelField'],
    name: ['chartsConfigurationPanelFieldName'],
    actionContainer: ['chartsConfigurationPanelFieldActionContainer'],
    dragIcon: ['chartsConfigurationPanelFieldDragIcon'],
    checkbox: ['chartsConfigurationPanelFieldCheckbox'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridChartsConfigurationPanelFieldRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsConfigurationPanelField',
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

const GridChartsConfigurationPanelFieldName = styled('span', {
  name: 'MuiDataGrid',
  slot: 'ChartsConfigurationPanelFieldName',
})<{ ownerState: OwnerState }>({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const GridChartsConfigurationPanelFieldActionContainer = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsConfigurationPanelFieldActionContainer',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  alignItems: 'center',
});

const GridChartsConfigurationPanelFieldDragIcon = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsConfigurationPanelFieldDragIcon',
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

function GridChartsConfigurationPanelField(props: GridChartsConfigurationPanelFieldProps) {
  const { children, field, onDragStart, onDragEnd } = props;
  const rootProps = useGridRootProps();
  const [dropPosition, setDropPosition] = React.useState<DropPosition>(null);
  const section = props.zone;
  const ownerState = { ...props, classes: rootProps.classes, dropPosition, section };
  const classes = useUtilityClasses(ownerState);
  const apiRef = useGridPrivateApiContext();

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
    <GridChartsConfigurationPanelFieldRoot
      ownerState={ownerState}
      className={classes.root}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      draggable="true"
    >
      <GridChartsConfigurationPanelFieldDragIcon
        ownerState={ownerState}
        className={classes.dragIcon}
      >
        <rootProps.slots.columnReorderIcon fontSize="small" />
      </GridChartsConfigurationPanelFieldDragIcon>

      <GridChartsConfigurationPanelFieldName ownerState={ownerState} className={classes.name}>
        {children}
      </GridChartsConfigurationPanelFieldName>

      <GridChartsConfigurationPanelFieldActionContainer
        ownerState={ownerState}
        className={classes.actionContainer}
      >
        <GridChartsConfigurationPanelFieldMenu field={field} zone={section} />
      </GridChartsConfigurationPanelFieldActionContainer>
    </GridChartsConfigurationPanelFieldRoot>
  );
}

export { GridChartsConfigurationPanelField };
