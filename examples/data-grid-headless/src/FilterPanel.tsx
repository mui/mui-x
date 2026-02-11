'use client';
import type {
  FilterModel,
  FilterGroup,
  FilterCondition,
  FilterExpression,
  FilterOperator,
} from '@mui/x-data-grid-headless/plugins/filtering';
import {
  isFilterGroup,
  isFilterCondition,
} from '@mui/x-data-grid-headless/plugins/filtering';
import { PlusIcon, TrashIcon, GroupIcon } from './icons';

export interface FilterColumnInfo {
  id: string;
  field: string;
  header?: string;
  filterOperators?: FilterOperator[];
}

interface FilterPanelProps {
  filterModel: FilterModel;
  onFilterModelChange: (model: FilterModel) => void;
  columns: FilterColumnInfo[];
  disabled?: boolean;
}

// Helper to get the default operator for a column
function getDefaultOperator(column: FilterColumnInfo): string {
  if (column.filterOperators && column.filterOperators.length > 0) {
    return column.filterOperators[0].value;
  }
  return 'contains';
}

// Helper to check if an operator requires a value
function operatorRequiresValue(
  column: FilterColumnInfo,
  operatorValue: string,
): boolean {
  const operator = column.filterOperators?.find((op) => op.value === operatorValue);
  return operator?.requiresFilterValue !== false;
}

// ================================
// Condition Row
// ================================

interface ConditionRowProps {
  condition: FilterCondition;
  columns: FilterColumnInfo[];
  onChange: (condition: FilterCondition) => void;
  onRemove: () => void;
  disabled?: boolean;
}

function ConditionRow(props: ConditionRowProps) {
  const { condition, columns, onChange, onRemove, disabled } = props;

  const currentColumn = columns.find((c) => c.field === condition.field) || columns[0];
  const operators = currentColumn?.filterOperators || [];
  const needsValue = operatorRequiresValue(currentColumn, condition.operator);

  const handleFieldChange = (field: string) => {
    const newColumn = columns.find((c) => c.field === field) || columns[0];
    onChange({
      ...condition,
      field,
      operator: getDefaultOperator(newColumn),
      value: undefined,
    });
  };

  const handleOperatorChange = (operator: string) => {
    const newNeedsValue = operatorRequiresValue(currentColumn, operator);
    onChange({
      ...condition,
      operator,
      value: newNeedsValue ? condition.value : undefined,
    });
  };

  const handleValueChange = (value: string) => {
    // Try to parse as number if the operator is numeric
    const numericOps = ['=', '!=', '>', '>=', '<', '<='];
    const isNumeric = numericOps.includes(condition.operator);
    onChange({
      ...condition,
      value: isNumeric && value !== '' ? Number(value) : value,
    });
  };

  return (
    <div className="filter-condition">
      <select
        className="filter-select filter-select--field"
        value={condition.field}
        onChange={(e) => handleFieldChange(e.target.value)}
        disabled={disabled}
      >
        {columns.map((col) => (
          <option key={col.id} value={col.field}>
            {col.header || col.id}
          </option>
        ))}
      </select>

      <select
        className="filter-select filter-select--operator"
        value={condition.operator}
        onChange={(e) => handleOperatorChange(e.target.value)}
        disabled={disabled}
      >
        {operators.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label || op.value}
          </option>
        ))}
      </select>

      {needsValue && (
        <input
          className="filter-input"
          type="text"
          value={condition.value ?? ''}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder="Value..."
          disabled={disabled}
        />
      )}

      <button
        type="button"
        className="filter-btn filter-btn--remove"
        onClick={onRemove}
        disabled={disabled}
        aria-label="Remove condition"
      >
        <TrashIcon />
      </button>
    </div>
  );
}

// ================================
// Filter Group
// ================================

interface FilterGroupComponentProps {
  group: FilterGroup;
  columns: FilterColumnInfo[];
  onChange: (group: FilterGroup) => void;
  onRemove?: () => void;
  disabled?: boolean;
  depth: number;
}

function FilterGroupComponent(props: FilterGroupComponentProps) {
  const { group, columns, onChange, onRemove, disabled, depth } = props;

  const handleLogicOperatorToggle = () => {
    onChange({
      ...group,
      logicOperator: group.logicOperator === 'and' ? 'or' : 'and',
    });
  };

  const handleConditionChange = (index: number, updated: FilterExpression) => {
    const newConditions = [...group.conditions];
    newConditions[index] = updated;
    onChange({ ...group, conditions: newConditions });
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = group.conditions.filter((_, i) => i !== index);
    onChange({ ...group, conditions: newConditions });
  };

  const handleAddCondition = () => {
    const firstColumn = columns[0];
    const newCondition: FilterCondition = {
      field: firstColumn.field,
      operator: getDefaultOperator(firstColumn),
      value: '',
    };
    onChange({ ...group, conditions: [...group.conditions, newCondition] });
  };

  const handleAddGroup = () => {
    const firstColumn = columns[0];
    const newGroup: FilterGroup = {
      logicOperator: group.logicOperator === 'and' ? 'or' : 'and',
      conditions: [
        {
          field: firstColumn.field,
          operator: getDefaultOperator(firstColumn),
          value: '',
        },
      ],
    };
    onChange({ ...group, conditions: [...group.conditions, newGroup] });
  };

  const groupClassName = [
    'filter-group',
    depth > 0 && 'filter-group--nested',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={groupClassName}>
      <div className="filter-group__header">
        <button
          type="button"
          className={`filter-logic-toggle filter-logic-toggle--${group.logicOperator}`}
          onClick={handleLogicOperatorToggle}
          disabled={disabled}
        >
          {group.logicOperator.toUpperCase()}
        </button>

        {onRemove && (
          <button
            type="button"
            className="filter-btn filter-btn--remove-group"
            onClick={onRemove}
            disabled={disabled}
            aria-label="Remove group"
          >
            <TrashIcon />
          </button>
        )}
      </div>

      <div className="filter-group__conditions">
        {group.conditions.map((expr, index) => {
          if (isFilterCondition(expr)) {
            return (
              <div key={index} className="filter-group__row">
                {index > 0 && (
                  <span className="filter-logic-label">
                    {group.logicOperator.toUpperCase()}
                  </span>
                )}
                <ConditionRow
                  condition={expr}
                  columns={columns}
                  onChange={(updated) => handleConditionChange(index, updated)}
                  onRemove={() => handleRemoveCondition(index)}
                  disabled={disabled}
                />
              </div>
            );
          }

          if (isFilterGroup(expr)) {
            return (
              <div key={index} className="filter-group__row">
                {index > 0 && (
                  <span className="filter-logic-label">
                    {group.logicOperator.toUpperCase()}
                  </span>
                )}
                <FilterGroupComponent
                  group={expr}
                  columns={columns}
                  onChange={(updated) => handleConditionChange(index, updated)}
                  onRemove={() => handleRemoveCondition(index)}
                  disabled={disabled}
                  depth={depth + 1}
                />
              </div>
            );
          }

          return null;
        })}
      </div>

      <div className="filter-group__actions">
        <button
          type="button"
          className="filter-btn filter-btn--add"
          onClick={handleAddCondition}
          disabled={disabled}
        >
          <PlusIcon />
          Condition
        </button>
        {depth < 2 && (
          <button
            type="button"
            className="filter-btn filter-btn--add"
            onClick={handleAddGroup}
            disabled={disabled}
          >
            <GroupIcon />
            Group
          </button>
        )}
      </div>
    </div>
  );
}

// ================================
// Filter Panel (Top-Level)
// ================================

export function FilterPanel(props: FilterPanelProps) {
  const { filterModel, onFilterModelChange, columns, disabled } = props;

  const hasConditions = filterModel.conditions.length > 0;

  const handleClearAll = () => {
    onFilterModelChange({ logicOperator: 'and', conditions: [] });
  };

  const handleAddFirstCondition = () => {
    const firstColumn = columns[0];
    onFilterModelChange({
      ...filterModel,
      conditions: [
        {
          field: firstColumn.field,
          operator: getDefaultOperator(firstColumn),
          value: '',
        },
      ],
    });
  };

  return (
    <div className="filter-panel">
      {hasConditions ? (
        <div className="filter-panel__body">
          <FilterGroupComponent
            group={filterModel}
            columns={columns}
            onChange={onFilterModelChange}
            disabled={disabled}
            depth={0}
          />
          <div className="filter-panel__footer">
            <button
              type="button"
              className="filter-btn filter-btn--clear"
              onClick={handleClearAll}
              disabled={disabled}
            >
              Clear all
            </button>
          </div>
        </div>
      ) : (
        <div className="filter-panel__empty">
          <button
            type="button"
            className="filter-btn filter-btn--add"
            onClick={handleAddFirstCondition}
            disabled={disabled}
          >
            <PlusIcon />
            Add filter
          </button>
        </div>
      )}
    </div>
  );
}
