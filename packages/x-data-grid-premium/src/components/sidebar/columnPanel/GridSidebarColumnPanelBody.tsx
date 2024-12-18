import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import { GridColDef } from '@mui/x-data-grid';
import useLazyRef from '@mui/utils/useLazyRef';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { svgIconClasses } from '@mui/material/SvgIcon';

import { PivotModel } from '../../../hooks/features/pivoting/useGridPivoting';
import { useGridRootProps } from '../../../typeOverloads/reexports';
import { getAvailableAggregationFunctions } from '../../../hooks/features/aggregation/gridAggregationUtils';
import { PivotField } from './GridSidebarColumnPanelPivotField';

function AutoAnimateContainer(props: React.HTMLAttributes<HTMLDivElement>) {
  const [parent] = useAutoAnimate({ duration: 150 });
  return <div ref={parent} {...props} />;
}

const PivotSectionContainer = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const PivotSection = styled(AutoAnimateContainer)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  transition: 'background-color 0.15s ease-in-out',
  '& + &': {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  '&[data-drag-over="true"]': {
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
  },
}));

const PivotSectionTitle = styled('div')(({ theme }) => ({
  fontSize: theme.typography.pxToRem(12),
  color: theme.palette.text.secondary,
  padding: theme.spacing(1, 2),
  [`.${svgIconClasses.root}`]: {
    fontSize: theme.typography.pxToRem(18),
    marginLeft: -1,
  },
}));

const PivotSectionList = styled(AutoAnimateContainer)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  padding: theme.spacing(1, 0),
  '* + &': {
    paddingTop: 0,
  },
}));

const PivotSectionPlaceholder = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: theme.spacing(1),
  alignItems: 'center',
  height: 60,
  padding: theme.spacing(1.5),
  margin: theme.spacing(1.5),
  border: `1px dashed ${theme.palette.grey[400]}`,
  borderRadius: 4,
  color: theme.palette.text.secondary,
  transitionProperty: 'color, border-color',
  transitionDuration: '0.15s',
  transitionTimingFunction: 'ease-in-out',
  '[data-dragging="true"] &': {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
  '[data-drag-over="true"] &': {
    borderWidth: 2,
    borderStyle: 'solid',
  },
  '* + &': {
    marginTop: 0,
  },
}));

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
  pivotModel,
  columns,
  onPivotModelChange,
}: {
  pivotModel: PivotModel;
  columns: GridColDef[];
  onPivotModelChange: React.Dispatch<React.SetStateAction<PivotModel>>;
}) {
  const fields = React.useMemo(() => columns.map((col) => col.field), [columns]);
  const rootProps = useGridRootProps();
  const [drag, setDrag] = React.useState<{
    active: boolean;
    dropZone: FieldTransferObject['modelKey'];
    initialModelKey: FieldTransferObject['modelKey'];
  }>(INITIAL_DRAG_STATE);

  const initialColumnsLookup = useLazyRef(() => {
    return columns.reduce(
      (acc, column) => {
        acc[column.field] = column;
        return acc;
      },
      {} as Record<string, GridColDef>,
    );
  }).current;

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
      return true;
    });
  }, [pivotModel.columns, pivotModel.rows, pivotModel.values, fields]);

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
                })[0];
            newSectionArray.splice(toIndex, 0, {
              field,
              aggFunc,
            });
            newModel.values = newSectionArray as PivotModel['values'];
          } else if (targetSection === 'columns') {
            const sort = isSameSection
              ? prev.columns.find((item) => item.field === field)?.sort
              : undefined;
            newSectionArray.splice(toIndex, 0, { field, sort });
            newModel.columns = newSectionArray as PivotModel['columns'];
          } else if (targetSection === 'rows') {
            newSectionArray.splice(toIndex, 0, { field });
            newModel.rows = newSectionArray as PivotModel['rows'];
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

  return (
    <PivotSectionContainer data-dragging={drag.active} onDragLeave={handleDragLeave}>
      <PivotSection
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        data-section={null}
        data-drag-over={drag.active && drag.dropZone === null}
      >
        {availableFields.length === 0 && (
          <PivotSectionPlaceholder>Drag here to remove from pivot</PivotSectionPlaceholder>
        )}
        {availableFields.length > 0 && (
          <PivotSectionList>
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
          </PivotSectionList>
        )}
      </PivotSection>

      <PivotSection
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        data-section="rows"
        data-drag-over={drag.dropZone === 'rows'}
      >
        <PivotSectionTitle>Rows</PivotSectionTitle>
        {pivotModel.rows.length === 0 && (
          <PivotSectionPlaceholder>
            {/* TODO: Replace with pivotRowsIcon or a more generic rowsIcon */}
            <rootProps.slots.densityStandardIcon />
            Drag here to create rows
          </PivotSectionPlaceholder>
        )}
        {pivotModel.rows.length > 0 && (
          <PivotSectionList>
            {pivotModel.rows.map(({ field }) => (
              <PivotField
                key={field}
                field={field}
                modelKey="rows"
                data-field={field}
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
          </PivotSectionList>
        )}
      </PivotSection>

      <PivotSection
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        data-section="columns"
        data-drag-over={drag.dropZone === 'columns'}
      >
        <PivotSectionTitle>Columns</PivotSectionTitle>
        {pivotModel.columns.length === 0 && (
          <PivotSectionPlaceholder>
            {/* TODO: Replace with pivotColumnsIcon or a more generic columnsIcon */}
            <rootProps.slots.columnSelectorIcon />
            Drag here to create columns
          </PivotSectionPlaceholder>
        )}
        {pivotModel.columns.length > 0 && (
          <PivotSectionList>
            {pivotModel.columns.map(({ field, sort }) => (
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
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                {getColumnName(field)}
              </PivotField>
            ))}
          </PivotSectionList>
        )}
      </PivotSection>

      <PivotSection
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        data-section="values"
        data-drag-over={drag.dropZone === 'values'}
      >
        <PivotSectionTitle>Values</PivotSectionTitle>
        {pivotModel.values.length === 0 && (
          <PivotSectionPlaceholder>
            {/* TODO: Replace with pivotValuesIcon or a more generic valuesIcon */}
            <rootProps.slots.columnMenuAggregationIcon />
            Drag here to create values
          </PivotSectionPlaceholder>
        )}
        {pivotModel.values.length > 0 && (
          <PivotSectionList>
            {pivotModel.values.map(({ field, aggFunc }) => (
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
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                {getColumnName(field)}
              </PivotField>
            ))}
          </PivotSectionList>
        )}
      </PivotSection>
    </PivotSectionContainer>
  );
}
