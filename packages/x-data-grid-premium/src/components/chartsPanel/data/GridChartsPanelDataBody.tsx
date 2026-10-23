'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { gridPivotActiveSelector, vars } from '@mui/x-data-grid-pro/internals';
import {
  getDataGridUtilityClass,
  GridShadowScrollArea,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from '../../collapsible';
import { ResizablePanel, ResizablePanelHandle } from '../../resizablePanel';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import {
  CHARTS_PANEL_DATA_FIELD_DRAGGING_CLASS,
  GridChartsPanelDataField,
} from './GridChartsPanelDataField';
import {
  gridChartableColumnsSelector,
  gridChartsDimensionsSelector,
  gridChartsIntegrationActiveChartIdSelector,
  gridChartsValuesSelector,
} from '../../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors';
import { useGridPrivateApiContext } from '../../../hooks/utils/useGridPrivateApiContext';
import { usePanelFieldPointerDrag } from '../../../hooks/utils/usePanelFieldPointerDrag';
import { useGridChartsIntegrationContext } from '../../../hooks/utils/useGridChartIntegration';
import { getBlockedSections } from '../../../hooks/features/chartsIntegration/utils';
import type { GridChartsIntegrationSection } from '../../../hooks/features/chartsIntegration/gridChartsIntegrationInterfaces';
import { gridRowGroupingSanitizedModelSelector } from '../../../hooks/features/rowGrouping/gridRowGroupingSelector';
import { gridPivotModelSelector } from '../../../hooks/features/pivoting/gridPivotingSelectors';

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

const INITIAL_DRAG_STATE = {
  active: false,
  field: null,
  dropSection: null,
  initialSection: null,
  targetField: null,
  targetPosition: null,
};

// The zones a field can be dropped on: the available fields, and the sections of the chart
const ZONE_SELECTOR = `.${getDataGridUtilityClass('chartsPanelDataAvailableFields')}, .${getDataGridUtilityClass('chartsPanelDataSection')}`;
const FIELD_SELECTOR = `.${getDataGridUtilityClass('chartsPanelDataField')}`;
const SCROLL_AREA_SELECTOR = `.${getDataGridUtilityClass('chartsPanelDataAvailableFields')}, .${getDataGridUtilityClass('chartsPanelDataScrollArea')}`;

export interface FieldTransferObject {
  field: string;
  section: GridChartsIntegrationSection;
}

export type DropPosition = 'top' | 'bottom' | null;

interface GridChartsPanelDataBodyProps {
  searchValue: string;
}

// dimensions and values
const SECTION_COUNT = 2;

function GridChartsPanelDataBody(props: GridChartsPanelDataBodyProps) {
  const { searchValue } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const rowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);
  const pivotActive = useGridSelector(apiRef, gridPivotActiveSelector);
  const pivotModel = useGridSelector(apiRef, gridPivotModelSelector);
  const activeChartId = useGridSelector(apiRef, gridChartsIntegrationActiveChartIdSelector);
  const { chartStateLookup } = useGridChartsIntegrationContext();
  const dimensions = useGridSelector(apiRef, gridChartsDimensionsSelector, activeChartId);
  const values = useGridSelector(apiRef, gridChartsValuesSelector, activeChartId);
  const classes = useUtilityClasses(rootProps);
  const chartableColumns = useGridSelector(apiRef, gridChartableColumnsSelector);

  const dimensionsLabel = React.useMemo(
    () =>
      chartStateLookup[activeChartId]?.dimensionsLabel ||
      apiRef.current.getLocaleText('chartsCategories'),
    [chartStateLookup, activeChartId, apiRef],
  );
  const valuesLabel = React.useMemo(
    () =>
      chartStateLookup[activeChartId]?.valuesLabel || apiRef.current.getLocaleText('chartsSeries'),
    [chartStateLookup, activeChartId, apiRef],
  );

  const fullSections = React.useMemo(() => {
    const sections: string[] = [];

    if (
      chartStateLookup[activeChartId]?.maxDimensions &&
      dimensions.length >= chartStateLookup[activeChartId]?.maxDimensions
    ) {
      sections.push('dimensions');
    }

    if (
      chartStateLookup[activeChartId]?.maxValues &&
      values.length >= chartStateLookup[activeChartId]?.maxValues
    ) {
      sections.push('values');
    }

    return sections;
  }, [dimensions, values, chartStateLookup, activeChartId]);

  const blockedSectionsLookup = React.useMemo(
    () =>
      new Map<string, string[]>(
        Object.values(chartableColumns).map((column) => [
          column.field,
          Array.from(
            new Set([
              ...getBlockedSections(column, rowGroupingModel, pivotActive ? pivotModel : undefined),
              ...fullSections,
            ]),
          ),
        ]),
      ),
    [rowGroupingModel, chartableColumns, pivotActive, pivotModel, fullSections],
  );

  const availableFields = React.useMemo(() => {
    const notUsedFields = Object.keys(chartableColumns).filter(
      (field) =>
        !dimensions.some((dimension) => dimension.field === field) &&
        !values.some((value) => value.field === field),
    );
    if (searchValue) {
      return notUsedFields.filter((field) => {
        const fieldName = apiRef.current.chartsIntegration.getColumnName(field);
        return fieldName.toLowerCase().includes(searchValue.toLowerCase());
      });
    }

    // Fields with all sections blocked should be at the end
    return notUsedFields.sort((a, b) => {
      const aBlockedSections = blockedSectionsLookup.get(a)!.length;
      const bBlockedSections = blockedSectionsLookup.get(b)!.length;
      return (
        (aBlockedSections >= SECTION_COUNT ? 1 : 0) - (bBlockedSections >= SECTION_COUNT ? 1 : 0)
      );
    });
  }, [apiRef, searchValue, chartableColumns, dimensions, values, blockedSectionsLookup]);

  const [drag, setDrag] = React.useState<{
    active: boolean;
    field: string | null;
    dropSection: FieldTransferObject['section'];
    initialSection: FieldTransferObject['section'];
    // The drop indicator of a touch or pen drag. Mouse drags keep it in the field, from HTML drag and drop events.
    targetField: string | null;
    targetPosition: DropPosition;
  }>(INITIAL_DRAG_STATE);

  const disabledSections = React.useMemo(() => {
    if (!drag.field) {
      return new Set<string>();
    }
    return new Set<string>(blockedSectionsLookup.get(drag.field));
  }, [blockedSectionsLookup, drag.field]);

  const handleDragStart = (field: string, section: FieldTransferObject['section']) => {
    setDrag({ ...INITIAL_DRAG_STATE, active: true, field, initialSection: section });
  };

  const handleDragEnd = () => {
    setDrag(INITIAL_DRAG_STATE);
  };

  // Touch and pen drags. They apply the same rules as the HTML drag and drop handlers below:
  // a drop on a field inserts above or below it, a drop on a zone appends to its section.
  const pointerDrag = usePanelFieldPointerDrag<FieldTransferObject['section']>({
    apiRef,
    zoneSelector: ZONE_SELECTOR,
    fieldSelector: FIELD_SELECTOR,
    scrollAreaSelector: SCROLL_AREA_SELECTOR,
    previewClassName: CHARTS_PANEL_DATA_FIELD_DRAGGING_CLASS,
    onDragStart: (data) => handleDragStart(data.field, data.section),
    onDropTargetChange: (target) => {
      setDrag((v) => ({
        ...v,
        // Outside of the zones, the section the field comes from is highlighted, like on `dragleave`
        dropSection: target ? target.section : v.initialSection,
        targetField: target?.field ?? null,
        targetPosition: target?.position ?? null,
      }));
    },
    onDrop: (data, target) => {
      if (target.field !== null) {
        apiRef.current.chartsIntegration.updateDataReference(
          data.field,
          data.section,
          target.section,
          target.field,
          target.position || undefined,
        );
      } else if (target.section !== data.section) {
        apiRef.current.chartsIntegration.updateDataReference(
          data.field,
          data.section,
          target.section,
        );
      }
    },
    onDragEnd: handleDragEnd,
  });

  const getPointerDropPosition = (field: string) =>
    drag.targetField === field ? drag.targetPosition : null;

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
        section === 'dimensions'
          ? apiRef.current.updateChartDimensionsData
          : apiRef.current.updateChartValuesData;
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
      ref={pointerDrag.panelRef}
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
            {apiRef.current.getLocaleText('chartsNoFields')}
          </GridChartsPanelDataPlaceholder>
        )}
        {availableFields.length > 0 && (
          <GridChartsPanelDataFieldList ownerState={rootProps} className={classes.fieldList}>
            {availableFields.map((field) => (
              <GridChartsPanelDataField
                key={field}
                field={field}
                section={null}
                disabled={blockedSectionsLookup.get(field)!.length >= SECTION_COUNT}
                blockedSections={blockedSectionsLookup.get(field)}
                dimensionsLabel={dimensionsLabel}
                valuesLabel={valuesLabel}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onPointerDown={pointerDrag.onPointerDown}
                pointerDropPosition={getPointerDropPosition(field)}
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
            disabled={disabledSections.has('dimensions')}
            data-section="dimensions"
            data-drag-over={
              !disabledSections.has('dimensions') && drag.dropSection === 'dimensions'
            }
          >
            <CollapsibleTrigger aria-label={dimensionsLabel}>
              <GridChartsPanelDataSectionTitle
                ownerState={rootProps}
                className={classes.sectionTitle}
              >
                {dimensionsLabel}
                {(chartStateLookup[activeChartId]?.maxDimensions || dimensions.length > 0) && (
                  <rootProps.slots.baseBadge
                    badgeContent={
                      chartStateLookup[activeChartId]?.maxDimensions
                        ? `${dimensions.length}/${chartStateLookup[activeChartId]?.maxDimensions}`
                        : dimensions.length
                    }
                  />
                )}
              </GridChartsPanelDataSectionTitle>
            </CollapsibleTrigger>
            <CollapsiblePanel>
              {dimensions.length === 0 && (
                <GridChartsPanelDataPlaceholder
                  ownerState={rootProps}
                  className={classes.placeholder}
                >
                  {apiRef.current.getLocaleText('chartsDragToDimensions')(dimensionsLabel)}
                </GridChartsPanelDataPlaceholder>
              )}
              {dimensions.length > 0 && (
                <GridChartsPanelDataFieldList ownerState={rootProps} className={classes.fieldList}>
                  {dimensions.map((dimension) => (
                    <GridChartsPanelDataField
                      key={dimension.field}
                      field={dimension.field}
                      selected={dimension.hidden !== true}
                      onChange={handleChange}
                      section="dimensions"
                      blockedSections={blockedSectionsLookup.get(dimension.field)}
                      dimensionsLabel={dimensionsLabel}
                      valuesLabel={valuesLabel}
                      disabled={disabledSections.has('dimensions')}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onPointerDown={pointerDrag.onPointerDown}
                      pointerDropPosition={getPointerDropPosition(dimension.field)}
                    >
                      {apiRef.current.chartsIntegration.getColumnName(dimension.field)}
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
            disabled={disabledSections.has('values')}
            data-section="values"
            data-drag-over={!disabledSections.has('values') && drag.dropSection === 'values'}
          >
            <CollapsibleTrigger aria-label={valuesLabel}>
              <GridChartsPanelDataSectionTitle
                ownerState={rootProps}
                className={classes.sectionTitle}
              >
                {valuesLabel}
                {(chartStateLookup[activeChartId]?.maxValues || values.length > 0) && (
                  <rootProps.slots.baseBadge
                    badgeContent={
                      chartStateLookup[activeChartId]?.maxValues
                        ? `${values.length}/${chartStateLookup[activeChartId]?.maxValues}`
                        : values.length
                    }
                  />
                )}
              </GridChartsPanelDataSectionTitle>
            </CollapsibleTrigger>
            <CollapsiblePanel>
              {values.length === 0 && (
                <GridChartsPanelDataPlaceholder
                  ownerState={rootProps}
                  className={classes.placeholder}
                >
                  {apiRef.current.getLocaleText('chartsDragToValues')(valuesLabel)}
                </GridChartsPanelDataPlaceholder>
              )}
              {values.length > 0 && (
                <GridChartsPanelDataFieldList ownerState={rootProps} className={classes.fieldList}>
                  {values.map((value) => (
                    <GridChartsPanelDataField
                      key={value.field}
                      field={value.field}
                      selected={value.hidden !== true}
                      onChange={handleChange}
                      section="values"
                      blockedSections={blockedSectionsLookup.get(value.field)}
                      dimensionsLabel={dimensionsLabel}
                      valuesLabel={valuesLabel}
                      disabled={disabledSections.has('values')}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onPointerDown={pointerDrag.onPointerDown}
                      pointerDropPosition={getPointerDropPosition(value.field)}
                    >
                      {apiRef.current.chartsIntegration.getColumnName(value.field)}
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
