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
import { GridChartsConfigurationPanelField } from './GridChartsConfigurationPanelField';
import {
  gridChartsCategoriesSelector,
  gridChartsSeriesSelector,
} from '../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { gridRowGroupingSanitizedModelSelector } from '../../hooks/features/rowGrouping/gridRowGroupingSelector';

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['chartsConfigurationPanelBody'],
    availableFields: ['chartsConfigurationPanelAvailableFields'],
    sections: ['chartsConfigurationPanelSections'],
    scrollArea: ['chartsConfigurationPanelScrollArea'],
    section: ['chartsConfigurationPanelSection'],
    sectionTitle: ['chartsConfigurationPanelSectionTitle'],
    fieldList: ['chartsConfigurationPanelFieldList'],
    placeholder: ['chartsConfigurationPanelPlaceholder'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridChartsConfigurationPanelBodyRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsConfigurationPanelBody',
})<{ ownerState: OwnerState }>({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const GridChartsConfigurationPanelAvailableFields = styled(GridShadowScrollArea, {
  name: 'MuiDataGrid',
  slot: 'ChartsConfigurationPanelAvailableFields',
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

const GridChartsConfigurationPanelSections = styled(ResizablePanel, {
  name: 'MuiDataGrid',
  slot: 'ChartsConfigurationPanelSections',
})<{ ownerState: OwnerState }>({
  position: 'relative',
  minHeight: 158,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

const GridChartsConfigurationPanelScrollArea = styled(GridShadowScrollArea, {
  name: 'MuiDataGrid',
  slot: 'ChartsConfigurationPanelScrollArea',
})<{ ownerState: OwnerState }>({
  height: '100%',
});

const GridChartsConfigurationPanelSection = styled(Collapsible, {
  name: 'MuiDataGrid',
  slot: 'ChartsConfigurationPanelSection',
})<{ ownerState: OwnerState }>({
  margin: vars.spacing(0.5, 1),
  transition: vars.transition(['border-color', 'background-color'], {
    duration: vars.transitions.duration.short,
    easing: vars.transitions.easing.easeInOut,
  }),
  '&[data-drag-over="true"]': {
    backgroundColor: vars.colors.interactive.hover,
    outline: `2px solid ${vars.colors.interactive.selected}`,
  },
});

const GridChartsConfigurationPanelSectionTitle = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsConfigurationPanelSectionTitle',
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

const GridChartsConfigurationPanelFieldList = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsConfigurationPanelFieldList',
})<{ ownerState: OwnerState }>({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: vars.spacing(0.5, 0),
});

const GridChartsConfigurationPanelPlaceholder = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsConfigurationPanelPlaceholder',
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

const INITIAL_DRAG_STATE = { active: false, dropZone: null, initialZone: null };

export interface FieldTransferObject {
  field: string;
  zone: 'categories' | 'series' | null;
}

export type DropPosition = 'top' | 'bottom' | null;

function GridChartsConfigurationPanelBody({ searchValue }: { searchValue: string }) {
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const categories = useGridSelector(apiRef, gridChartsCategoriesSelector);
  const series = useGridSelector(apiRef, gridChartsSeriesSelector);
  const classes = useUtilityClasses(rootProps);
  const columns = useGridSelector(apiRef, gridColumnLookupSelector);
  const rowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);

  const getColumnName = React.useCallback(
    (field: string) => {
      const column = columns[field];
      return column?.headerName || field;
    },
    [columns],
  );

  const availableFields = React.useMemo(() => {
    const notUsedFields = Object.keys(columns).filter(
      (field) =>
        columns[field].chartable &&
        !categories.includes(field) &&
        !series.includes(field) &&
        !rowGroupingModel.includes(field),
    );
    if (searchValue) {
      return notUsedFields.filter((field) => {
        const fieldName = getColumnName(field);
        return fieldName.toLowerCase().includes(searchValue.toLowerCase());
      });
    }
    return notUsedFields;
  }, [searchValue, columns, rowGroupingModel, categories, series, getColumnName]);

  const [drag, setDrag] = React.useState<{
    active: boolean;
    dropZone: FieldTransferObject['zone'];
    initialZone: FieldTransferObject['zone'];
  }>(INITIAL_DRAG_STATE);

  const handleDragStart = (zone: FieldTransferObject['zone']) => {
    setDrag({ active: true, initialZone: zone, dropZone: null });
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
    <GridChartsConfigurationPanelBodyRoot
      ownerState={rootProps}
      className={classes.root}
      data-dragging={drag.active}
      onDragLeave={handleDragLeave}
    >
      <GridChartsConfigurationPanelAvailableFields
        ownerState={rootProps}
        className={classes.availableFields}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        data-section={null}
        data-drag-over={drag.active && drag.dropZone === null}
      >
        {availableFields.length === 0 && (
          <GridChartsConfigurationPanelPlaceholder
            ownerState={rootProps}
            className={classes.placeholder}
          >
            {apiRef.current.getLocaleText('pivotNoFields')}
          </GridChartsConfigurationPanelPlaceholder>
        )}
        {availableFields.length > 0 && (
          <GridChartsConfigurationPanelFieldList
            ownerState={rootProps}
            className={classes.fieldList}
          >
            {availableFields.map((field) => (
              <GridChartsConfigurationPanelField
                key={field}
                field={field}
                zone={null}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                {getColumnName(field)}
              </GridChartsConfigurationPanelField>
            ))}
          </GridChartsConfigurationPanelFieldList>
        )}
      </GridChartsConfigurationPanelAvailableFields>
      <GridChartsConfigurationPanelSections
        ownerState={rootProps}
        className={classes.sections}
        direction="vertical"
      >
        <ResizablePanelHandle />
        <GridChartsConfigurationPanelScrollArea
          ownerState={rootProps}
          className={classes.scrollArea}
        >
          <GridChartsConfigurationPanelSection
            ownerState={rootProps}
            className={classes.section}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            data-section="categories"
            data-drag-over={drag.dropZone === 'categories'}
          >
            <CollapsibleTrigger aria-label={apiRef.current.getLocaleText('pivotRows')}>
              <GridChartsConfigurationPanelSectionTitle
                ownerState={rootProps}
                className={classes.sectionTitle}
              >
                Categories
                {categories.length > 0 && (
                  <rootProps.slots.baseBadge badgeContent={categories.length} />
                )}
              </GridChartsConfigurationPanelSectionTitle>
            </CollapsibleTrigger>
            <CollapsiblePanel>
              {categories.length === 0 && (
                <GridChartsConfigurationPanelPlaceholder
                  ownerState={rootProps}
                  className={classes.placeholder}
                >
                  Drag to use column as category
                </GridChartsConfigurationPanelPlaceholder>
              )}
              {categories.length > 0 && (
                <GridChartsConfigurationPanelFieldList
                  ownerState={rootProps}
                  className={classes.fieldList}
                >
                  {categories.map((field) => (
                    <GridChartsConfigurationPanelField
                      key={field}
                      field={field}
                      zone="categories"
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      {getColumnName(field)}
                    </GridChartsConfigurationPanelField>
                  ))}
                </GridChartsConfigurationPanelFieldList>
              )}
            </CollapsiblePanel>
          </GridChartsConfigurationPanelSection>

          <GridChartsConfigurationPanelSection
            ownerState={rootProps}
            className={classes.section}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            data-section="series"
            data-drag-over={drag.dropZone === 'series'}
          >
            <CollapsibleTrigger aria-label={apiRef.current.getLocaleText('pivotColumns')}>
              <GridChartsConfigurationPanelSectionTitle
                ownerState={rootProps}
                className={classes.sectionTitle}
              >
                Series
                {series.length > 0 && <rootProps.slots.baseBadge badgeContent={series.length} />}
              </GridChartsConfigurationPanelSectionTitle>
            </CollapsibleTrigger>
            <CollapsiblePanel>
              {series.length === 0 && (
                <GridChartsConfigurationPanelPlaceholder
                  ownerState={rootProps}
                  className={classes.placeholder}
                >
                  Drag to use column as series
                </GridChartsConfigurationPanelPlaceholder>
              )}
              {series.length > 0 && (
                <GridChartsConfigurationPanelFieldList
                  ownerState={rootProps}
                  className={classes.fieldList}
                >
                  {series.map((field) => (
                    <GridChartsConfigurationPanelField
                      key={field}
                      field={field}
                      zone="series"
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      {getColumnName(field)}
                    </GridChartsConfigurationPanelField>
                  ))}
                </GridChartsConfigurationPanelFieldList>
              )}
            </CollapsiblePanel>
          </GridChartsConfigurationPanelSection>
        </GridChartsConfigurationPanelScrollArea>
      </GridChartsConfigurationPanelSections>
    </GridChartsConfigurationPanelBodyRoot>
  );
}

export { GridChartsConfigurationPanelBody };
