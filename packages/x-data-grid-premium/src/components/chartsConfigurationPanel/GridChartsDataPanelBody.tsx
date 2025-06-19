import * as React from 'react';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import {
  getDataGridUtilityClass,
  gridColumnLookupSelector,
  GridShadowScrollArea,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from '../collapsible';
import { ResizablePanel, ResizablePanelHandle } from '../resizablePanel';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { GridChartsDataPanelField } from './GridChartsDataPanelField';
import {
  gridChartsCategoriesSelector,
  gridChartsSeriesSelector,
} from '../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { gridRowGroupingSanitizedModelSelector } from '../../hooks/features/rowGrouping/gridRowGroupingSelector';
import {
  gridPivotModelSelector,
  gridPivotActiveSelector,
} from '../../hooks/features/pivoting/gridPivotingSelectors';
import { getBlockedZones } from '../../hooks/features/chartsIntegration/utils';

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['chartsDataPanelBody'],
    availableFields: ['chartsDataPanelAvailableFields'],
    sections: ['chartsDataPanelSections'],
    scrollArea: ['chartsDataPanelScrollArea'],
    section: ['chartsDataPanelSection'],
    sectionTitle: ['chartsDataPanelSectionTitle'],
    fieldList: ['chartsDataPanelFieldList'],
    placeholder: ['chartsDataPanelPlaceholder'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridChartsDataPanelBodyRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsDataPanelBody',
})<{ ownerState: OwnerState }>({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const GridChartsDataPanelAvailableFields = styled(GridShadowScrollArea, {
  name: 'MuiDataGrid',
  slot: 'ChartsDataPanelAvailableFields',
})<{ ownerState: OwnerState }>({
  flex: 1,
  minHeight: 84,
  transition: vars.transition(['background-color'], {
    duration: vars.transitions.duration.short,
    easing: vars.transitions.easing.easeInOut,
  }),
  '&[data-drag-over="true"]': {
    backgroundColor: vars.colors.interactive.hover,
  },
});

const GridChartsDataPanelSections = styled(ResizablePanel, {
  name: 'MuiDataGrid',
  slot: 'ChartsDataPanelSections',
})<{ ownerState: OwnerState }>({
  position: 'relative',
  minHeight: 158,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

const GridChartsDataPanelScrollArea = styled(GridShadowScrollArea, {
  name: 'MuiDataGrid',
  slot: 'ChartsDataPanelScrollArea',
})<{ ownerState: OwnerState }>({
  height: '100%',
});

const GridChartsDataPanelSection = styled(Collapsible, {
  name: 'MuiDataGrid',
  slot: 'ChartsDataPanelSection',
  shouldForwardProp: (prop) => prop !== 'disabled',
})<{ ownerState: OwnerState; disabled: boolean }>(({ disabled }) => ({
  opacity: disabled ? 0.5 : 1,
  margin: vars.spacing(0.5, 1),
  transition: vars.transition(['border-color', 'background-color'], {
    duration: vars.transitions.duration.short,
    easing: vars.transitions.easing.easeInOut,
  }),
  '&[data-drag-over="true"]': {
    backgroundColor: vars.colors.interactive.hover,
    outline: `2px solid ${vars.colors.interactive.selected}`,
  },
}));

const GridChartsDataPanelSectionTitle = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsDataPanelSectionTitle',
})<{ ownerState: OwnerState }>({
  flex: 1,
  marginRight: vars.spacing(1.75),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: vars.spacing(1),
  font: vars.typography.font.body,
  fontWeight: vars.typography.fontWeight.medium,
});

const GridChartsDataPanelFieldList = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsDataPanelFieldList',
})<{ ownerState: OwnerState }>({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: vars.spacing(0.5, 0),
});

const GridChartsDataPanelPlaceholder = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsDataPanelPlaceholder',
})<{ ownerState: OwnerState }>({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textWrap: 'balance',
  textAlign: 'center',
  minHeight: 38,
  height: '100%',
  padding: vars.spacing(0, 1),
  color: vars.colors.foreground.muted,
  font: vars.typography.font.body,
});

const INITIAL_DRAG_STATE = { active: false, field: null, dropZone: null, initialZone: null };

export interface FieldTransferObject {
  field: string;
  zone: 'categories' | 'series' | null;
}

export type DropPosition = 'top' | 'bottom' | null;

interface GridChartsDataPanelBodyProps {
  searchValue: string;
}

function GridChartsDataPanelBody({ searchValue }: GridChartsDataPanelBodyProps) {
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const categories = useGridSelector(apiRef, gridChartsCategoriesSelector);
  const series = useGridSelector(apiRef, gridChartsSeriesSelector);
  const classes = useUtilityClasses(rootProps);
  const columns = useGridSelector(apiRef, gridColumnLookupSelector);
  const rowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);
  const pivotModel = useGridSelector(apiRef, gridPivotModelSelector);
  const pivotActive = useGridSelector(apiRef, gridPivotActiveSelector);

  const blockedZonesLookup = React.useMemo(
    () =>
      new Map<string, string[]>(
        Object.keys(columns).map((field) => [field, getBlockedZones(columns[field])]),
      ),
    [columns],
  );

  const pivotingModelValues = React.useMemo(
    () => pivotModel.values.map((value) => value.field),
    [pivotModel.values],
  );

  const availableFields = React.useMemo(() => {
    const notUsedFields = Object.keys(columns).filter(
      (field) =>
        columns[field].chartable &&
        !categories.includes(field) &&
        !series.includes(field) &&
        !rowGroupingModel.includes(field) &&
        (!pivotActive || !pivotingModelValues.includes(field)),
    );
    if (searchValue) {
      return notUsedFields.filter((field) => {
        const fieldName = apiRef.current.chartsIntegration.getColumnName(field);
        return fieldName.toLowerCase().includes(searchValue.toLowerCase());
      });
    }
    return notUsedFields;
  }, [
    apiRef,
    searchValue,
    columns,
    rowGroupingModel,
    pivotActive,
    pivotingModelValues,
    categories,
    series,
  ]);

  const [drag, setDrag] = React.useState<{
    active: boolean;
    field: string | null;
    dropZone: FieldTransferObject['zone'];
    initialZone: FieldTransferObject['zone'];
  }>(INITIAL_DRAG_STATE);

  const disabledSections = React.useMemo(() => {
    if (!drag.field) {
      return new Set<string>();
    }
    return new Set<string>(getBlockedZones(columns[drag.field]));
  }, [columns, drag.field]);

  const handleDragStart = (field: string, zone: FieldTransferObject['zone']) => {
    setDrag({ active: true, field, initialZone: zone, dropZone: null });
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

    const { field, zone: originSection } = JSON.parse(
      event.dataTransfer.getData('text/plain'),
    ) as FieldTransferObject;
    const targetSection = event.currentTarget.getAttribute(
      'data-section',
    ) as FieldTransferObject['zone'];
    if (originSection === targetSection) {
      return;
    }

    apiRef.current.chartsIntegration.updateDataReference(field, originSection, targetSection);
  };

  const handleDragOver = React.useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnter = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as HTMLElement)) {
      const dropZone = event.currentTarget.getAttribute(
        'data-section',
      ) as FieldTransferObject['zone'];
      setDrag((v) => ({ ...v, active: true, dropZone }));
    }
  }, []);

  const handleDragLeave = React.useCallback((event: React.DragEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget as HTMLElement)) {
      setDrag((v) => ({ ...v, active: true, dropZone: v.initialZone }));
    }
  }, []);

  return (
    <GridChartsDataPanelBodyRoot
      ownerState={rootProps}
      className={classes.root}
      data-dragging={drag.active}
      onDragLeave={handleDragLeave}
    >
      <GridChartsDataPanelAvailableFields
        ownerState={rootProps}
        className={classes.availableFields}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        data-section={null}
        data-drag-over={drag.active && drag.dropZone === null}
      >
        {availableFields.length === 0 && (
          <GridChartsDataPanelPlaceholder ownerState={rootProps} className={classes.placeholder}>
            {apiRef.current.getLocaleText('chartsConfigurationNoFields')}
          </GridChartsDataPanelPlaceholder>
        )}
        {availableFields.length > 0 && (
          <GridChartsDataPanelFieldList ownerState={rootProps} className={classes.fieldList}>
            {availableFields.map((field) => (
              <GridChartsDataPanelField
                key={field}
                field={field}
                zone={null}
                blockedZones={blockedZonesLookup.get(field)}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                {apiRef.current.chartsIntegration.getColumnName(field)}
              </GridChartsDataPanelField>
            ))}
          </GridChartsDataPanelFieldList>
        )}
      </GridChartsDataPanelAvailableFields>
      <GridChartsDataPanelSections
        ownerState={rootProps}
        className={classes.sections}
        direction="vertical"
      >
        <ResizablePanelHandle />
        <GridChartsDataPanelScrollArea ownerState={rootProps} className={classes.scrollArea}>
          <GridChartsDataPanelSection
            ownerState={rootProps}
            className={classes.section}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            disabled={disabledSections.has('categories')}
            data-section="categories"
            data-drag-over={!disabledSections.has('categories') && drag.dropZone === 'categories'}
          >
            <CollapsibleTrigger
              aria-label={apiRef.current.getLocaleText('chartsConfigurationCategories')}
            >
              <GridChartsDataPanelSectionTitle
                ownerState={rootProps}
                className={classes.sectionTitle}
              >
                {apiRef.current.getLocaleText('chartsConfigurationCategories')}
                {categories.length > 0 && (
                  <rootProps.slots.baseBadge badgeContent={categories.length} />
                )}
              </GridChartsDataPanelSectionTitle>
            </CollapsibleTrigger>
            <CollapsiblePanel>
              {categories.length === 0 && (
                <GridChartsDataPanelPlaceholder
                  ownerState={rootProps}
                  className={classes.placeholder}
                >
                  Drag to use column as category
                </GridChartsDataPanelPlaceholder>
              )}
              {categories.length > 0 && (
                <GridChartsDataPanelFieldList ownerState={rootProps} className={classes.fieldList}>
                  {categories.map((field) => (
                    <GridChartsDataPanelField
                      key={field}
                      field={field}
                      zone="categories"
                      blockedZones={blockedZonesLookup.get(field)}
                      disabled={disabledSections.has('categories')}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      {apiRef.current.chartsIntegration.getColumnName(field)}
                    </GridChartsDataPanelField>
                  ))}
                </GridChartsDataPanelFieldList>
              )}
            </CollapsiblePanel>
          </GridChartsDataPanelSection>

          <GridChartsDataPanelSection
            ownerState={rootProps}
            className={classes.section}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            disabled={disabledSections.has('series')}
            data-section="series"
            data-drag-over={!disabledSections.has('series') && drag.dropZone === 'series'}
          >
            <CollapsibleTrigger
              aria-label={apiRef.current.getLocaleText('chartsConfigurationSeries')}
            >
              <GridChartsDataPanelSectionTitle
                ownerState={rootProps}
                className={classes.sectionTitle}
              >
                {apiRef.current.getLocaleText('chartsConfigurationSeries')}
                {series.length > 0 && <rootProps.slots.baseBadge badgeContent={series.length} />}
              </GridChartsDataPanelSectionTitle>
            </CollapsibleTrigger>
            <CollapsiblePanel>
              {series.length === 0 && (
                <GridChartsDataPanelPlaceholder
                  ownerState={rootProps}
                  className={classes.placeholder}
                >
                  Drag to use column as series
                </GridChartsDataPanelPlaceholder>
              )}
              {series.length > 0 && (
                <GridChartsDataPanelFieldList ownerState={rootProps} className={classes.fieldList}>
                  {series.map((field) => (
                    <GridChartsDataPanelField
                      key={field}
                      field={field}
                      zone="series"
                      blockedZones={blockedZonesLookup.get(field)}
                      disabled={disabledSections.has('series')}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      {apiRef.current.chartsIntegration.getColumnName(field)}
                    </GridChartsDataPanelField>
                  ))}
                </GridChartsDataPanelFieldList>
              )}
            </CollapsiblePanel>
          </GridChartsDataPanelSection>
        </GridChartsDataPanelScrollArea>
      </GridChartsDataPanelSections>
    </GridChartsDataPanelBodyRoot>
  );
}

export { GridChartsDataPanelBody };
