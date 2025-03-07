import * as React from 'react';
import { styled } from '@mui/system';
import { GridColDef, GridShadowScrollArea, useGridSelector } from '@mui/x-data-grid';
import { vars } from '@mui/x-data-grid/internals';
import {
  gridPivotInitialColumnsSelector,
  gridPivotModelSelector,
} from '../../../hooks/features/pivoting/gridPivotingSelectors';
import { GridPivotModel } from '../../../hooks/features/pivoting/gridPivotingInterfaces';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { getAvailableAggregationFunctions } from '../../../hooks/features/aggregation/gridAggregationUtils';
import { PivotField } from './GridSidebarColumnPanelPivotField';
import { GridSidebarCollapsibleSection } from '../GridSidebarCollapsibleSection';
import { useResize } from '../../../hooks/utils/useResize';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';

const Container = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const TopPane = styled(GridShadowScrollArea)({
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

const BottomPane = styled('div')({
  position: 'relative',
  minHeight: 158,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

const ScrollArea = styled(GridShadowScrollArea)({
  height: '100%',
});

const CollapsibleSection = styled(GridSidebarCollapsibleSection)({
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

const CollapsibleSectionTitle = styled('div')({
  flex: 1,
  marginRight: vars.spacing(1.75),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: vars.spacing(1),
  ...vars.typography.body,
  fontWeight: vars.typography.fontWeight.medium,
});

const FieldList = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: vars.spacing(0.5, 0),
});

const Placeholder = styled('div')({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textWrap: 'balance',
  textAlign: 'center',
  minHeight: 42,
  height: '100%',
  padding: vars.spacing(0, 1),
  color: vars.colors.foreground.muted,
  ...vars.typography.body,
});

const ResizeHandle = styled('div')({
  position: 'absolute',
  zIndex: 2,
  top: 0,
  left: 0,
  width: '100%',
  height: 6,
  cursor: 'ns-resize',
  borderTop: `1px solid ${vars.colors.border.base}`,
  transition: 'border-top 0.1s ease-in-out',
  userSelect: 'none',
  touchAction: 'pan-y',
  '&:hover': {
    borderTop: `2px solid ${vars.colors.interactive.selected}`,
  },
});

export interface FieldTransferObject {
  field: string;
  modelKey: 'columns' | 'rows' | 'values' | null;
}

export type DropPosition = 'top' | 'bottom' | null;

export type UpdatePivotModel = (params: {
  field: string;
  targetSection: FieldTransferObject['modelKey'];
  originSection: FieldTransferObject['modelKey'];
  targetField?: string;
  targetFieldPosition?: DropPosition;
}) => void;

const INITIAL_DRAG_STATE = { active: false, dropZone: null, initialModelKey: null };

export function GridSidebarColumnPanelBody({
  searchState,
}: {
  searchState: {
    value: string;
    enabled: boolean;
  };
}) {
  const apiRef = useGridApiContext();
  const { ref: resizeHandleRef } = useResize({
    direction: 'vertical',
    getInitialSize: (handle) => {
      return handle.parentElement!.offsetHeight;
    },
    onSizeChange: (newSize, handle) => {
      handle.parentElement!.style.height = `${newSize}px`;
    },
  });
  const columns = useGridSelector(apiRef, gridPivotInitialColumnsSelector);
  const fields = React.useMemo(() => columns.map((col) => col.field), [columns]);
  const rootProps = useGridRootProps();
  const [drag, setDrag] = React.useState<{
    active: boolean;
    dropZone: FieldTransferObject['modelKey'];
    initialModelKey: FieldTransferObject['modelKey'];
  }>(INITIAL_DRAG_STATE);
  const pivotModel = useGridSelector(apiRef, gridPivotModelSelector);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onPivotModelChange = React.useCallback(apiRef.current.setPivotModel, [
    apiRef.current.setPivotModel,
  ]);

  const initialColumnsLookup = React.useMemo(() => {
    return columns.reduce(
      (acc, column) => {
        acc[column.field] = column;
        return acc;
      },
      {} as Record<string, GridColDef>,
    );
  }, [columns]);

  const getColumnName = React.useCallback(
    (field: string) => {
      const column = initialColumnsLookup[field];
      return column?.headerName || field;
    },
    [initialColumnsLookup],
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
      if (searchState.enabled) {
        const fieldName = getColumnName(field);
        return fieldName.toLowerCase().includes(searchState.value.toLowerCase());
      }
      return true;
    });
  }, [
    pivotModel.columns,
    pivotModel.rows,
    pivotModel.values,
    searchState.value,
    searchState.enabled,
    fields,
    getColumnName,
  ]);

  const updatePivotModel = React.useCallback<UpdatePivotModel>(
    ({ field, targetSection, originSection, targetField, targetFieldPosition }) => {
      if (field === targetField) {
        return;
      }

      onPivotModelChange((prev) => {
        const newModel = { ...prev };
        const isSameSection = targetSection === originSection;

        if (targetSection) {
          const newSectionArray = [...prev[targetSection]];
          let toIndex = newSectionArray.length;
          if (targetField) {
            const fromIndex = newSectionArray.findIndex((item) => item.field === field);
            if (fromIndex > -1) {
              newSectionArray.splice(fromIndex, 1);
            }
            toIndex = newSectionArray.findIndex((item) => item.field === targetField);
            if (targetFieldPosition === 'bottom') {
              toIndex += 1;
            }
          }

          if (targetSection === 'values') {
            const aggFunc = isSameSection
              ? prev.values.find((item) => item.field === field)?.aggFunc
              : getAvailableAggregationFunctions({
                  aggregationFunctions: rootProps.aggregationFunctions,
                  colDef: initialColumnsLookup[field],
                  isDataSource: false,
                })[0];
            newSectionArray.splice(toIndex, 0, {
              field,
              aggFunc,
            });
            newModel.values = newSectionArray as GridPivotModel['values'];
          } else if (targetSection === 'columns') {
            const sort = isSameSection
              ? prev.columns.find((item) => item.field === field)?.sort
              : undefined;
            newSectionArray.splice(toIndex, 0, { field, sort });
            newModel.columns = newSectionArray as GridPivotModel['columns'];
          } else if (targetSection === 'rows') {
            newSectionArray.splice(toIndex, 0, { field });
            newModel.rows = newSectionArray as GridPivotModel['rows'];
          }
        }
        if (!isSameSection && originSection) {
          // @ts-ignore FIXME
          newModel[originSection] = prev[originSection].filter((f) => {
            if (typeof f === 'string') {
              return f !== field;
            }
            return f.field !== field;
          });
        }
        return newModel;
      });
    },
    [initialColumnsLookup, onPivotModelChange, rootProps.aggregationFunctions],
  );

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
    updatePivotModel({ field, targetSection, originSection });
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
    <Container data-dragging={drag.active} onDragLeave={handleDragLeave}>
      <TopPane
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        data-section={null}
        data-drag-over={drag.active && drag.dropZone === null}
      >
        {availableFields.length === 0 && (
          <Placeholder>{apiRef.current.getLocaleText('pivotNoFields')}</Placeholder>
        )}
        {availableFields.length > 0 && (
          <FieldList>
            {availableFields.map((field) => (
              <PivotField
                key={field}
                field={field}
                modelKey={null}
                updatePivotModel={updatePivotModel}
                pivotModel={pivotModel}
                onPivotModelChange={onPivotModelChange}
                slots={rootProps.slots}
                slotProps={rootProps.slotProps}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                {getColumnName(field)}
              </PivotField>
            ))}
          </FieldList>
        )}
      </TopPane>

      <BottomPane>
        <ResizeHandle ref={resizeHandleRef} />
        <ScrollArea>
          <CollapsibleSection
            title={
              <CollapsibleSectionTitle>
                {rowsLabel}
                {pivotModel.rows.length > 0 && (
                  <rootProps.slots.baseBadge badgeContent={pivotModel.rows.length} />
                )}
              </CollapsibleSectionTitle>
            }
            aria-label={apiRef.current.getLocaleText('sidebarCollapseSection')(rowsLabel)}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            data-section="rows"
            data-drag-over={drag.dropZone === 'rows'}
          >
            {pivotModel.rows.length === 0 && (
              <Placeholder>{apiRef.current.getLocaleText('pivotDragToRows')}</Placeholder>
            )}
            {pivotModel.rows.length > 0 && (
              <FieldList>
                {pivotModel.rows.map(({ field, hidden }) => (
                  <PivotField
                    key={field}
                    field={field}
                    modelKey="rows"
                    data-field={field}
                    hidden={hidden ?? false}
                    pivotModel={pivotModel}
                    updatePivotModel={updatePivotModel}
                    onPivotModelChange={onPivotModelChange}
                    slots={rootProps.slots}
                    slotProps={rootProps.slotProps}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    {getColumnName(field)}
                  </PivotField>
                ))}
              </FieldList>
            )}
          </CollapsibleSection>

          <CollapsibleSection
            title={
              <CollapsibleSectionTitle>
                {columnsLabel}
                {pivotModel.columns.length > 0 && (
                  <rootProps.slots.baseBadge badgeContent={pivotModel.columns.length} />
                )}
              </CollapsibleSectionTitle>
            }
            aria-label={apiRef.current.getLocaleText('sidebarCollapseSection')(columnsLabel)}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            data-section="columns"
            data-drag-over={drag.dropZone === 'columns'}
          >
            {pivotModel.columns.length === 0 && (
              <Placeholder>{apiRef.current.getLocaleText('pivotDragToColumns')}</Placeholder>
            )}
            {pivotModel.columns.length > 0 && (
              <FieldList>
                {pivotModel.columns.map(({ field, sort, hidden }) => (
                  <PivotField
                    key={field}
                    field={field}
                    modelKey="columns"
                    updatePivotModel={updatePivotModel}
                    pivotModel={pivotModel}
                    onPivotModelChange={onPivotModelChange}
                    slots={rootProps.slots}
                    slotProps={rootProps.slotProps}
                    sort={sort}
                    hidden={hidden ?? false}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    {getColumnName(field)}
                  </PivotField>
                ))}
              </FieldList>
            )}
          </CollapsibleSection>

          <CollapsibleSection
            title={
              <CollapsibleSectionTitle>
                {valuesLabel}
                {pivotModel.values.length > 0 && (
                  <rootProps.slots.baseBadge badgeContent={pivotModel.values.length} />
                )}
              </CollapsibleSectionTitle>
            }
            aria-label={apiRef.current.getLocaleText('sidebarCollapseSection')(valuesLabel)}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            data-section="values"
            data-drag-over={drag.dropZone === 'values'}
          >
            {pivotModel.values.length === 0 && (
              <Placeholder>{apiRef.current.getLocaleText('pivotDragToValues')}</Placeholder>
            )}
            {pivotModel.values.length > 0 && (
              <FieldList>
                {pivotModel.values.map(({ field, aggFunc, hidden }) => (
                  <PivotField
                    key={field}
                    field={field}
                    modelKey="values"
                    updatePivotModel={updatePivotModel}
                    pivotModel={pivotModel}
                    onPivotModelChange={onPivotModelChange}
                    slots={rootProps.slots}
                    slotProps={rootProps.slotProps}
                    aggFunc={aggFunc}
                    colDef={initialColumnsLookup[field]}
                    hidden={hidden ?? false}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    {getColumnName(field)}
                  </PivotField>
                ))}
              </FieldList>
            )}
          </CollapsibleSection>
        </ScrollArea>
      </BottomPane>
    </Container>
  );
}
