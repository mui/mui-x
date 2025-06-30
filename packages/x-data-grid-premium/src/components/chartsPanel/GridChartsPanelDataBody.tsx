'use client';
import * as React from 'react';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import {
  getDataGridUtilityClass,
  GridShadowScrollArea,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from '../collapsible';
import { ResizablePanel, ResizablePanelHandle } from '../resizablePanel';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { GridChartsPanelDataField } from './GridChartsPanelDataField';
import {
  gridChartableColumnsSelector,
  gridChartsCategoriesSelector,
  gridChartsIntegrationActiveChartIdSelector,
  gridChartsSeriesSelector,
} from '../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { getBlockedSections } from '../../hooks/features/chartsIntegration/utils';
import type { GridChartsIntegrationSection } from '../../hooks/features/chartsIntegration/gridChartsIntegrationInterfaces';

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['chartsPanelDataBody'],
    availableFields: ['chartsPanelDataAvailableFields'],
    sections: ['chartsPanelDataSections'],
    scrollArea: ['chartsPanelDataScrollArea'],
    section: ['chartsPanelDataSection'],
    sectionTitle: ['chartsPanelDataSectionTitle'],
    fieldList: ['chartsPanelDataFieldList'],
    placeholder: ['chartsPanelDataPlaceholder'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridChartsPanelDataBodyRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelDataBody',
})<{ ownerState: OwnerState }>({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const GridChartsPanelDataAvailableFields = styled(GridShadowScrollArea, {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelDataAvailableFields',
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

const GridChartsPanelDataSections = styled(ResizablePanel, {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelDataSections',
})<{ ownerState: OwnerState }>({
  position: 'relative',
  minHeight: 158,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

const GridChartsPanelDataScrollArea = styled(GridShadowScrollArea, {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelDataScrollArea',
})<{ ownerState: OwnerState }>({
  height: '100%',
});

const GridChartsPanelDataSection = styled(Collapsible, {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelDataSection',
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

const GridChartsPanelDataSectionTitle = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelDataSectionTitle',
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

const GridChartsPanelDataFieldList = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelDataFieldList',
})<{ ownerState: OwnerState }>({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: vars.spacing(0.5, 0),
});

const GridChartsPanelDataPlaceholder = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelDataPlaceholder',
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

const INITIAL_DRAG_STATE = { active: false, field: null, dropSection: null, initialSection: null };

export interface FieldTransferObject {
  field: string;
  section: GridChartsIntegrationSection;
}

export type DropPosition = 'top' | 'bottom' | null;

interface GridChartsPanelDataBodyProps {
  searchValue: string;
}

function GridChartsPanelDataBody({ searchValue }: GridChartsPanelDataBodyProps) {
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const activeChartId = useGridSelector(apiRef, gridChartsIntegrationActiveChartIdSelector);
  const categories = useGridSelector(apiRef, gridChartsCategoriesSelector, activeChartId);
  const series = useGridSelector(apiRef, gridChartsSeriesSelector, activeChartId);
  const classes = useUtilityClasses(rootProps);
  const chartableColumns = useGridSelector(apiRef, gridChartableColumnsSelector);

  const blockedSectionsLookup = React.useMemo(
    () =>
      new Map<string, string[]>(
        Object.values(chartableColumns).map((column) => [column.field, getBlockedSections(column)]),
      ),
    [chartableColumns],
  );

  const availableFields = React.useMemo(() => {
    const notUsedFields = Object.keys(chartableColumns).filter(
      (field) =>
        !categories.some((category) => category.field === field) &&
        !series.some((seriesItem) => seriesItem.field === field),
    );
    if (searchValue) {
      return notUsedFields.filter((field) => {
        const fieldName = apiRef.current.chartsIntegration.getColumnName(field);
        return fieldName.toLowerCase().includes(searchValue.toLowerCase());
      });
    }
    return notUsedFields;
  }, [apiRef, searchValue, chartableColumns, categories, series]);

  const [drag, setDrag] = React.useState<{
    active: boolean;
    field: string | null;
    dropSection: FieldTransferObject['section'];
    initialSection: FieldTransferObject['section'];
  }>(INITIAL_DRAG_STATE);

  const disabledSections = React.useMemo(() => {
    if (!drag.field) {
      return new Set<string>();
    }
    return new Set<string>(blockedSectionsLookup.get(drag.field));
  }, [blockedSectionsLookup, drag.field]);

  const handleDragStart = (field: string, section: FieldTransferObject['section']) => {
    setDrag({ active: true, field, initialSection: section, dropSection: null });
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

    const { field, section: originSection } = JSON.parse(
      event.dataTransfer.getData('text/plain'),
    ) as FieldTransferObject;
    const targetSection = event.currentTarget.getAttribute(
      'data-section',
    ) as FieldTransferObject['section'];
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
      const dropSection = event.currentTarget.getAttribute(
        'data-section',
      ) as FieldTransferObject['section'];
      setDrag((v) => ({ ...v, active: true, dropSection }));
    }
  }, []);

  const handleDragLeave = React.useCallback((event: React.DragEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget as HTMLElement)) {
      setDrag((v) => ({ ...v, active: true, dropSection: v.initialSection }));
    }
  }, []);

  const handleChange = React.useCallback(
    (field: string, section: GridChartsIntegrationSection) => {
      const apiMethod =
        section === 'categories' ? apiRef.current.updateCategories : apiRef.current.updateSeries;
      apiMethod(activeChartId, (currentItems) =>
        currentItems.map((item) =>
          item.field === field ? { ...item, hidden: item.hidden !== true } : item,
        ),
      );
    },
    [apiRef, activeChartId],
  );

  return (
    <GridChartsPanelDataBodyRoot
      ownerState={rootProps}
      className={classes.root}
      data-dragging={drag.active}
      onDragLeave={handleDragLeave}
    >
      <GridChartsPanelDataAvailableFields
        ownerState={rootProps}
        className={classes.availableFields}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        data-section={null}
        data-drag-over={drag.active && drag.dropSection === null}
      >
        {availableFields.length === 0 && (
          <GridChartsPanelDataPlaceholder ownerState={rootProps} className={classes.placeholder}>
            {apiRef.current.getLocaleText('chartsConfigurationNoFields')}
          </GridChartsPanelDataPlaceholder>
        )}
        {availableFields.length > 0 && (
          <GridChartsPanelDataFieldList ownerState={rootProps} className={classes.fieldList}>
            {availableFields.map((field) => (
              <GridChartsPanelDataField
                key={field}
                field={field}
                section={null}
                blockedSections={blockedSectionsLookup.get(field)}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                {apiRef.current.chartsIntegration.getColumnName(field)}
              </GridChartsPanelDataField>
            ))}
          </GridChartsPanelDataFieldList>
        )}
      </GridChartsPanelDataAvailableFields>
      <GridChartsPanelDataSections
        ownerState={rootProps}
        className={classes.sections}
        direction="vertical"
      >
        <ResizablePanelHandle />
        <GridChartsPanelDataScrollArea ownerState={rootProps} className={classes.scrollArea}>
          <GridChartsPanelDataSection
            ownerState={rootProps}
            className={classes.section}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            disabled={disabledSections.has('categories')}
            data-section="categories"
            data-drag-over={
              !disabledSections.has('categories') && drag.dropSection === 'categories'
            }
          >
            <CollapsibleTrigger
              aria-label={apiRef.current.getLocaleText('chartsConfigurationCategories')}
            >
              <GridChartsPanelDataSectionTitle
                ownerState={rootProps}
                className={classes.sectionTitle}
              >
                {apiRef.current.getLocaleText('chartsConfigurationCategories')}
                {categories.length > 0 && (
                  <rootProps.slots.baseBadge badgeContent={categories.length} />
                )}
              </GridChartsPanelDataSectionTitle>
            </CollapsibleTrigger>
            <CollapsiblePanel>
              {categories.length === 0 && (
                <GridChartsPanelDataPlaceholder
                  ownerState={rootProps}
                  className={classes.placeholder}
                >
                  Drag to use column as category
                </GridChartsPanelDataPlaceholder>
              )}
              {categories.length > 0 && (
                <GridChartsPanelDataFieldList ownerState={rootProps} className={classes.fieldList}>
                  {categories.map((category) => (
                    <GridChartsPanelDataField
                      key={category.field}
                      field={category.field}
                      selected={category.hidden !== true}
                      onChange={handleChange}
                      section="categories"
                      blockedSections={blockedSectionsLookup.get(category.field)}
                      disabled={disabledSections.has('categories')}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      {apiRef.current.chartsIntegration.getColumnName(category.field)}
                    </GridChartsPanelDataField>
                  ))}
                </GridChartsPanelDataFieldList>
              )}
            </CollapsiblePanel>
          </GridChartsPanelDataSection>

          <GridChartsPanelDataSection
            ownerState={rootProps}
            className={classes.section}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            disabled={disabledSections.has('series')}
            data-section="series"
            data-drag-over={!disabledSections.has('series') && drag.dropSection === 'series'}
          >
            <CollapsibleTrigger
              aria-label={apiRef.current.getLocaleText('chartsConfigurationSeries')}
            >
              <GridChartsPanelDataSectionTitle
                ownerState={rootProps}
                className={classes.sectionTitle}
              >
                {apiRef.current.getLocaleText('chartsConfigurationSeries')}
                {series.length > 0 && <rootProps.slots.baseBadge badgeContent={series.length} />}
              </GridChartsPanelDataSectionTitle>
            </CollapsibleTrigger>
            <CollapsiblePanel>
              {series.length === 0 && (
                <GridChartsPanelDataPlaceholder
                  ownerState={rootProps}
                  className={classes.placeholder}
                >
                  Drag to use column as series
                </GridChartsPanelDataPlaceholder>
              )}
              {series.length > 0 && (
                <GridChartsPanelDataFieldList ownerState={rootProps} className={classes.fieldList}>
                  {series.map((seriesItem) => (
                    <GridChartsPanelDataField
                      key={seriesItem.field}
                      field={seriesItem.field}
                      selected={seriesItem.hidden !== true}
                      onChange={handleChange}
                      section="series"
                      blockedSections={blockedSectionsLookup.get(seriesItem.field)}
                      disabled={disabledSections.has('series')}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      {apiRef.current.chartsIntegration.getColumnName(seriesItem.field)}
                    </GridChartsPanelDataField>
                  ))}
                </GridChartsPanelDataFieldList>
              )}
            </CollapsiblePanel>
          </GridChartsPanelDataSection>
        </GridChartsPanelDataScrollArea>
      </GridChartsPanelDataSections>
    </GridChartsPanelDataBodyRoot>
  );
}

export { GridChartsPanelDataBody };
