'use client';
import * as React from 'react';
import type { SortingOptions, GridSortDirection } from '@mui/x-data-grid-headless/plugins/sorting';
import {
  SettingsIcon,
  SortIcon,
  PaginationIcon,
  ChevronIcon,
  CollapseIcon,
  ArrowIcon,
  RowsIcon,
} from './icons';

export interface PluginConfig {
  sorting?: NonNullable<SortingOptions['sorting']> & {
    enabled?: boolean;
    /** If true, shift key is required for multi-sort. @default true */
    multiSortWithShiftKey?: boolean;
  };
  pagination?: {
    enabled?: boolean;
    pageSize?: number;
  };
}

interface SectionState {
  rows: boolean;
  sorting: boolean;
  pagination: boolean;
}

interface ConfigPanelProps {
  config: PluginConfig;
  onConfigChange: (config: PluginConfig) => void;
  onApplySorting?: () => void;
  onRerender?: () => void;
  onRefreshRows?: () => void;
  onShuffleColumns?: () => void;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

function Toggle(props: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}) {
  const { checked, onChange, disabled, label } = props;
  const className = ['toggle', checked && 'toggle--checked', disabled && 'toggle--disabled']
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label ?? 'Toggle'}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={className}
    >
      <span className="toggle__thumb" />
    </button>
  );
}

function Select(props: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  const { value, onChange, options, disabled } = props;
  const className = ['select', disabled && 'select--disabled'].filter(Boolean).join(' ');

  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className={className}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function OptionRow(props: {
  label: string;
  description?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const { label, description, children, disabled } = props;
  const className = ['option-row', disabled && 'option-row--disabled'].filter(Boolean).join(' ');

  return (
    <div className={className}>
      <div className="option-row__label">
        <div className="option-row__label-text">{label}</div>
        {description && <div className="option-row__label-description">{description}</div>}
      </div>
      <div className="option-row__controls">{children}</div>
    </div>
  );
}

export function ConfigPanel(props: ConfigPanelProps) {
  const {
    config,
    onConfigChange,
    onApplySorting,
    onRerender,
    onRefreshRows,
    onShuffleColumns,
    defaultWidth = 320,
    minWidth = 240,
    maxWidth = 500,
  } = props;

  const [width, setWidth] = React.useState(defaultWidth);
  const [isResizing, setIsResizing] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [sections, setSections] = React.useState<SectionState>({
    rows: true,
    sorting: true,
    pagination: true,
  });

  const toggleSection = (section: keyof SectionState) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateSortingConfig = (updates: Partial<PluginConfig['sorting']>) => {
    onConfigChange({
      ...config,
      sorting: {
        ...config.sorting,
        ...updates,
      },
    });
  };

  const updatePaginationConfig = (updates: Partial<NonNullable<PluginConfig['pagination']>>) => {
    onConfigChange({
      ...config,
      pagination: {
        ...config.pagination,
        ...updates,
      },
    });
  };

  // Handle resize
  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setIsResizing(true);

      const startX = event.clientX;
      const startWidth = width;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = startX - moveEvent.clientX;
        const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth + delta));
        setWidth(newWidth);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    [width, minWidth, maxWidth],
  );

  const sortingOrderOptions = [
    { value: 'asc-desc-null', label: 'Asc → Desc → None' },
    { value: 'desc-asc-null', label: 'Desc → Asc → None' },
    { value: 'asc-desc', label: 'Asc → Desc' },
  ];

  const sortingOrderMap: Record<string, readonly GridSortDirection[]> = {
    'asc-desc-null': ['asc', 'desc', null],
    'desc-asc-null': ['desc', 'asc', null],
    'asc-desc': ['asc', 'desc'],
  };

  const getCurrentSortingOrderValue = () => {
    const current = config.sorting?.order;
    const entry = Object.entries(sortingOrderMap).find(
      ([, val]) => JSON.stringify(val) === JSON.stringify(current),
    );
    return entry?.[0] || 'asc-desc-null';
  };

  const isManualMode = config.sorting?.mode === 'manual';
  const isSortingEnabled = config.sorting?.enabled ?? true;
  const isMultiSortEnabled = config.sorting?.multiSort ?? true;
  const isPaginationEnabled = config.pagination?.enabled ?? true;

  const resizeHandleClassName = [
    'config-panel__resize-handle',
    isResizing && 'config-panel__resize-handle--active',
  ]
    .filter(Boolean)
    .join(' ');

  const contentClassName = [
    'config-panel__content',
    isCollapsed && 'config-panel__content--collapsed',
  ]
    .filter(Boolean)
    .join(' ');

  const headerClassName = ['config-panel__header', isCollapsed && 'config-panel__header--collapsed']
    .filter(Boolean)
    .join(' ');

  return (
    <div className="config-panel">
      {/* Resize Handle */}
      <button
        type="button"
        aria-label="Resize panel"
        onMouseDown={handleMouseDown}
        className={resizeHandleClassName}
      />

      {/* Panel Content */}
      <div
        className={contentClassName}
        style={{
          width: isCollapsed ? undefined : `${width}px`,
          transition: isResizing ? 'none' : 'width 0.2s ease',
        }}
      >
        {/* Panel Header */}
        <div className={headerClassName}>
          {!isCollapsed && (
            <div className="config-panel__header-title">
              <span className="config-panel__header-icon">
                <SettingsIcon />
              </span>
              <span className="config-panel__header-text">Configuration</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
            className="config-panel__collapse-btn"
          >
            <CollapseIcon collapsed={isCollapsed} />
          </button>
        </div>

        {/* Scrollable Content */}
        {!isCollapsed && (
          <div className="config-panel__body">
            {/* Rows Section */}
            <div className="config-section">
              {/* Section Header */}
              <button
                type="button"
                onClick={() => toggleSection('rows')}
                className={`config-section__header ${sections.rows ? 'config-section__header--expanded' : ''}`}
              >
                <div className="config-section__header-title">
                  <span className="config-section__header-icon">
                    <RowsIcon />
                  </span>
                  <span className="config-section__header-text">Rows</span>
                </div>
                <ChevronIcon expanded={sections.rows} className="config-section__chevron" />
              </button>

              {/* Section Content */}
              {sections.rows && (
                <div className="config-section__content">
                  <div className="config-section__buttons">
                    <button
                      type="button"
                      onClick={onRerender}
                      className="btn btn--secondary btn--block"
                    >
                      Rerender
                    </button>
                    <button
                      type="button"
                      onClick={onRefreshRows}
                      className="btn btn--secondary btn--block"
                    >
                      Refresh Rows
                    </button>
                    <button
                      type="button"
                      onClick={onShuffleColumns}
                      className="btn btn--secondary btn--block"
                    >
                      Shuffle Columns
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sorting Section */}
            <div className="config-section">
              {/* Section Header */}
              <button
                type="button"
                onClick={() => toggleSection('sorting')}
                className={`config-section__header ${sections.sorting ? 'config-section__header--expanded' : ''}`}
              >
                <div className="config-section__header-title">
                  <span className="config-section__header-icon">
                    <SortIcon />
                  </span>
                  <span className="config-section__header-text">Sorting</span>
                </div>
                <ChevronIcon expanded={sections.sorting} className="config-section__chevron" />
              </button>

              {/* Section Content */}
              {sections.sorting && (
                <div className="config-section__content">
                  <OptionRow label="Enable Sorting" description="Click headers to sort">
                    <Toggle
                      checked={isSortingEnabled}
                      onChange={(checked) => updateSortingConfig({ enabled: checked })}
                    />
                  </OptionRow>

                  <OptionRow
                    label="Multi-column"
                    description="Sort by multiple columns"
                    disabled={!isSortingEnabled}
                  >
                    <Toggle
                      checked={config.sorting?.multiSort ?? true}
                      onChange={(checked) => updateSortingConfig({ multiSort: checked })}
                      disabled={!isSortingEnabled}
                    />
                  </OptionRow>

                  <OptionRow
                    label="Shift-click Multi-sort"
                    description="Require shift key"
                    disabled={!isSortingEnabled || !isMultiSortEnabled}
                  >
                    <Toggle
                      checked={config.sorting?.multiSortWithShiftKey ?? true}
                      onChange={(checked) =>
                        updateSortingConfig({ multiSortWithShiftKey: checked })
                      }
                      disabled={!isSortingEnabled || !isMultiSortEnabled}
                    />
                  </OptionRow>

                  <OptionRow
                    label="Stable Sort"
                    description="Preserve sorting order from the previous sort"
                    disabled={!isSortingEnabled}
                  >
                    <Toggle
                      checked={config.sorting?.stableSort ?? false}
                      onChange={(checked) => updateSortingConfig({ stableSort: checked })}
                      disabled={!isSortingEnabled}
                    />
                  </OptionRow>

                  <OptionRow label="Mode" disabled={!isSortingEnabled}>
                    <Select
                      value={config.sorting?.mode ?? 'auto'}
                      onChange={(val) => updateSortingConfig({ mode: val as 'auto' | 'manual' })}
                      options={[
                        { value: 'auto', label: 'Auto' },
                        { value: 'manual', label: 'Manual' },
                      ]}
                      disabled={!isSortingEnabled}
                    />
                    {/* Apply Sorting Button (for manual mode) */}
                    {isManualMode && isSortingEnabled && (
                      <div className="divider">
                        <button
                          type="button"
                          onClick={onApplySorting}
                          className="btn btn--primary btn--block"
                        >
                          <ArrowIcon />
                          Apply Sorting
                        </button>
                      </div>
                    )}
                  </OptionRow>

                  <OptionRow label="Direction Cycle" disabled={!isSortingEnabled}>
                    <Select
                      value={getCurrentSortingOrderValue()}
                      onChange={(val) => {
                        const order = sortingOrderMap[val];
                        if (order) {
                          updateSortingConfig({ order });
                        }
                      }}
                      options={sortingOrderOptions}
                      disabled={!isSortingEnabled}
                    />
                  </OptionRow>
                </div>
              )}
            </div>

            {/* Pagination Section */}
            <div className="config-section" style={{ marginTop: 'var(--space-3)' }}>
              {/* Section Header */}
              <button
                type="button"
                onClick={() => toggleSection('pagination')}
                className={`config-section__header ${sections.pagination ? 'config-section__header--expanded' : ''}`}
              >
                <div className="config-section__header-title">
                  <span className="config-section__header-icon">
                    <PaginationIcon />
                  </span>
                  <span className="config-section__header-text">Pagination</span>
                </div>
                <ChevronIcon expanded={sections.pagination} className="config-section__chevron" />
              </button>

              {/* Section Content */}
              {sections.pagination && (
                <div className="config-section__content">
                  <OptionRow label="Enable Pagination" description="Show rows in pages">
                    <Toggle
                      checked={isPaginationEnabled}
                      onChange={(checked) => updatePaginationConfig({ enabled: checked })}
                    />
                  </OptionRow>

                  <OptionRow
                    label="Page Size"
                    description="Rows per page"
                    disabled={!isPaginationEnabled}
                  >
                    <Select
                      value={String(config.pagination?.pageSize ?? 10)}
                      onChange={(val) => updatePaginationConfig({ pageSize: Number(val) })}
                      options={[
                        { value: '5', label: '5' },
                        { value: '10', label: '10' },
                        { value: '25', label: '25' },
                        { value: '50', label: '50' },
                        { value: '100', label: '100' },
                      ]}
                      disabled={!isPaginationEnabled}
                    />
                  </OptionRow>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
