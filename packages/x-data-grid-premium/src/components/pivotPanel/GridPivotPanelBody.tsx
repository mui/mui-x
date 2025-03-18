import * as React from 'react';
import { styled } from '@mui/system';
import {
  GridShadowScrollArea,
  getDataGridUtilityClass,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { vars } from '@mui/x-data-grid-pro/internals';
import {
  gridPivotInitialColumnsSelector,
  gridPivotModelSelector,
} from '../../hooks/features/pivoting/gridPivotingSelectors';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridPivotPanelField } from './GridPivotPanelField';
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from '../collapsible';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { ResizablePanel, ResizablePanelHandle } from '../resizablePanel';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['pivotPanelBody'],
    availableFields: ['pivotPanelAvailableFields'],
    sections: ['pivotPanelSections'],
    scrollArea: ['pivotPanelScrollArea'],
    section: ['pivotPanelSection'],
    sectionTitle: ['pivotPanelSectionTitle'],
    fieldList: ['pivotPanelFieldList'],
    placeholder: ['pivotPanelPlaceholder'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridPivotPanelBodyRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PivotPanelBody',
})<{ ownerState: OwnerState }>({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const GridPivotPanelAvailableFields = styled(GridShadowScrollArea, {
  name: 'MuiDataGrid',
  slot: 'PivotPanelAvailableFields',
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

const GridPivotPanelSections = styled(ResizablePanel, {
  name: 'MuiDataGrid',
  slot: 'PivotPanelSections',
})<{ ownerState: OwnerState }>({
  position: 'relative',
  minHeight: 158,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

const GridPivotPanelScrollArea = styled(GridShadowScrollArea, {
  name: 'MuiDataGrid',
  slot: 'PivotPanelScrollArea',
})<{ ownerState: OwnerState }>({
  height: '100%',
});

const GridPivotPanelSection = styled(Collapsible, {
  name: 'MuiDataGrid',
  slot: 'PivotPanelSection',
})<{ ownerState: OwnerState }>({
  margin: vars.spacing(0.5, 1),
  transition: vars.transition(['border-color', 'background-color'], {
    duration: vars.transitions.duration.short,
    easing: vars.transitions.easing.easeInOut,
  }),
  '&[data-drag-over="true"]': {
    backgroundColor: vars.colors.interactive.hover,
    borderColor: vars.colors.interactive.selected,
    borderStyle: 'dashed',
  },
});

const GridPivotPanelSectionTitle = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PivotPanelSectionTitle',
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

const GridPivotPanelFieldList = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PivotPanelFieldList',
})<{ ownerState: OwnerState }>({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: vars.spacing(0.5, 0),
});

const GridPivotPanelPlaceholder = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PivotPanelPlaceholder',
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

export interface FieldTransferObject {
  field: string;
  modelKey: 'columns' | 'rows' | 'values' | null;
}

const INITIAL_DRAG_STATE = { active: false, dropZone: null, initialModelKey: null };

function GridPivotPanelBody({ searchValue }: { searchValue: string }) {
  const apiRef = useGridApiContext();
  const initialColumns = useGridSelector(apiRef, gridPivotInitialColumnsSelector);
  const fields = React.useMemo(() => initialColumns.keys().toArray(), [initialColumns]);
  const rootProps = useGridRootProps();
  const [drag, setDrag] = React.useState<{
    active: boolean;
    dropZone: FieldTransferObject['modelKey'];
    initialModelKey: FieldTransferObject['modelKey'];
  }>(INITIAL_DRAG_STATE);
  const pivotModel = useGridSelector(apiRef, gridPivotModelSelector);
  const classes = useUtilityClasses(rootProps);

  const getColumnName = React.useCallback(
    (field: string) => {
      const column = initialColumns.get(field);
      return column?.headerName || field;
    },
    [initialColumns],
  );

  const availableFields = React.useMemo(() => {
    return fields.filter((field) => {
      if (pivotModel.rows.find((item) => item.field === field)) {
        return false;
      }
      if (pivotModel.columns.find((item) => item.field === field)) {
        return false;
      }
      if (pivotModel.values.find((item) => item.field === field)) {
        return false;
      }
      if (searchValue) {
        const fieldName = getColumnName(field);
        return fieldName.toLowerCase().includes(searchValue.toLowerCase());
      }
      return true;
    });
  }, [pivotModel.columns, pivotModel.rows, pivotModel.values, searchValue, fields, getColumnName]);

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
    apiRef.current.updatePivotModel({ field, targetSection, originSection });
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

  const rowsLabel = apiRef.current.getLocaleText('pivotRows');
  const columnsLabel = apiRef.current.getLocaleText('pivotColumns');
  const valuesLabel = apiRef.current.getLocaleText('pivotValues');

  return (
    <GridPivotPanelBodyRoot
      ownerState={rootProps}
      className={classes.root}
      data-dragging={drag.active}
      onDragLeave={handleDragLeave}
    >
      <GridPivotPanelAvailableFields
        ownerState={rootProps}
        className={classes.availableFields}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        data-section={null}
        data-drag-over={drag.active && drag.dropZone === null}
      >
        {availableFields.length === 0 && (
          <GridPivotPanelPlaceholder ownerState={rootProps} className={classes.placeholder}>
            {apiRef.current.getLocaleText('pivotNoFields')}
          </GridPivotPanelPlaceholder>
        )}
        {availableFields.length > 0 && (
          <GridPivotPanelFieldList ownerState={rootProps} className={classes.fieldList}>
            {availableFields.map((field) => (
              <GridPivotPanelField
                key={field}
                field={field}
                modelKey={null}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                {getColumnName(field)}
              </GridPivotPanelField>
            ))}
          </GridPivotPanelFieldList>
        )}
      </GridPivotPanelAvailableFields>

      <GridPivotPanelSections
        ownerState={rootProps}
        className={classes.sections}
        direction="vertical"
      >
        <ResizablePanelHandle />
        <GridPivotPanelScrollArea ownerState={rootProps} className={classes.scrollArea}>
          <GridPivotPanelSection
            ownerState={rootProps}
            className={classes.section}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            data-section="rows"
            data-drag-over={drag.dropZone === 'rows'}
          >
            <CollapsibleTrigger
              aria-label={apiRef.current.getLocaleText('sidebarCollapseSection')(rowsLabel)}
            >
              <GridPivotPanelSectionTitle ownerState={rootProps} className={classes.sectionTitle}>
                {rowsLabel}
                {pivotModel.rows.length > 0 && (
                  <rootProps.slots.baseBadge badgeContent={pivotModel.rows.length} />
                )}
              </GridPivotPanelSectionTitle>
            </CollapsibleTrigger>
            <CollapsiblePanel>
              {pivotModel.rows.length === 0 && (
                <GridPivotPanelPlaceholder ownerState={rootProps} className={classes.placeholder}>
                  {apiRef.current.getLocaleText('pivotDragToRows')}
                </GridPivotPanelPlaceholder>
              )}
              {pivotModel.rows.length > 0 && (
                <GridPivotPanelFieldList ownerState={rootProps} className={classes.fieldList}>
                  {pivotModel.rows.map((modelValue) => (
                    <GridPivotPanelField
                      key={modelValue.field}
                      field={modelValue.field}
                      modelKey="rows"
                      modelValue={modelValue}
                      data-field={modelValue.field}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      {getColumnName(modelValue.field)}
                    </GridPivotPanelField>
                  ))}
                </GridPivotPanelFieldList>
              )}
            </CollapsiblePanel>
          </GridPivotPanelSection>

          <GridPivotPanelSection
            ownerState={rootProps}
            className={classes.section}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            data-section="columns"
            data-drag-over={drag.dropZone === 'columns'}
          >
            <CollapsibleTrigger
              aria-label={apiRef.current.getLocaleText('sidebarCollapseSection')(columnsLabel)}
            >
              <GridPivotPanelSectionTitle ownerState={rootProps} className={classes.sectionTitle}>
                {columnsLabel}
                {pivotModel.columns.length > 0 && (
                  <rootProps.slots.baseBadge badgeContent={pivotModel.columns.length} />
                )}
              </GridPivotPanelSectionTitle>
            </CollapsibleTrigger>
            <CollapsiblePanel>
              {pivotModel.columns.length === 0 && (
                <GridPivotPanelPlaceholder ownerState={rootProps} className={classes.placeholder}>
                  {apiRef.current.getLocaleText('pivotDragToColumns')}
                </GridPivotPanelPlaceholder>
              )}
              {pivotModel.columns.length > 0 && (
                <GridPivotPanelFieldList ownerState={rootProps} className={classes.fieldList}>
                  {pivotModel.columns.map((modelValue) => (
                    <GridPivotPanelField
                      key={modelValue.field}
                      field={modelValue.field}
                      modelKey="columns"
                      modelValue={modelValue}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      {getColumnName(modelValue.field)}
                    </GridPivotPanelField>
                  ))}
                </GridPivotPanelFieldList>
              )}
            </CollapsiblePanel>
          </GridPivotPanelSection>

          <GridPivotPanelSection
            ownerState={rootProps}
            className={classes.section}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            data-section="values"
            data-drag-over={drag.dropZone === 'values'}
          >
            <CollapsibleTrigger
              aria-label={apiRef.current.getLocaleText('sidebarCollapseSection')(valuesLabel)}
            >
              <GridPivotPanelSectionTitle ownerState={rootProps} className={classes.sectionTitle}>
                {valuesLabel}
                {pivotModel.values.length > 0 && (
                  <rootProps.slots.baseBadge badgeContent={pivotModel.values.length} />
                )}
              </GridPivotPanelSectionTitle>
            </CollapsibleTrigger>
            <CollapsiblePanel>
              {pivotModel.values.length === 0 && (
                <GridPivotPanelPlaceholder ownerState={rootProps} className={classes.placeholder}>
                  {apiRef.current.getLocaleText('pivotDragToValues')}
                </GridPivotPanelPlaceholder>
              )}
              {pivotModel.values.length > 0 && (
                <GridPivotPanelFieldList ownerState={rootProps} className={classes.fieldList}>
                  {pivotModel.values.map((modelValue) => (
                    <GridPivotPanelField
                      key={modelValue.field}
                      field={modelValue.field}
                      modelKey="values"
                      modelValue={modelValue}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      {getColumnName(modelValue.field)}
                    </GridPivotPanelField>
                  ))}
                </GridPivotPanelFieldList>
              )}
            </CollapsiblePanel>
          </GridPivotPanelSection>
        </GridPivotPanelScrollArea>
      </GridPivotPanelSections>
    </GridPivotPanelBodyRoot>
  );
}

export { GridPivotPanelBody };
