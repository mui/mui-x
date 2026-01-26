'use client';
import * as React from 'react';
import type { SortingOptions, GridSortDirection } from '../plugins';

export interface PluginConfig {
  sorting?: SortingOptions & {
    enabled?: boolean;
  };
}

interface SectionState {
  sorting: boolean;
}

interface ConfigPanelProps {
  config: PluginConfig;
  onConfigChange: (config: PluginConfig) => void;
  onApplySorting?: () => void;
}

export function ConfigPanel(props: ConfigPanelProps) {
  const { config, onConfigChange, onApplySorting } = props;
  const [isOpen, setIsOpen] = React.useState(true);
  const [sections, setSections] = React.useState<SectionState>({
    sorting: true,
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

  const sortingOrderOptions: { label: string; value: readonly GridSortDirection[] }[] = [
    { label: 'asc → desc → null', value: ['asc', 'desc', null] },
    { label: 'desc → asc → null', value: ['desc', 'asc', null] },
    { label: 'asc → desc (no null)', value: ['asc', 'desc'] },
  ];

  const getCurrentSortingOrderLabel = () => {
    const current = config.sorting?.sortingOrder;
    const match = sortingOrderOptions.find(
      (opt) => JSON.stringify(opt.value) === JSON.stringify(current),
    );
    return match?.label || 'Custom';
  };

  const isManualMode = config.sorting?.sortingMode === 'manual';

  return (
    <div
      style={{
        marginBottom: '16px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
      }}
    >
      {/* Panel Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 600,
          textAlign: 'left',
        }}
      >
        <span>Plugin Configuration</span>
        <span style={{ fontSize: '12px' }}>{isOpen ? '▼' : '▶'}</span>
      </button>

      {/* Panel Content */}
      {isOpen && (
        <div style={{ padding: '0 16px 16px' }}>
          {/* Sorting Section */}
          <fieldset
            style={{
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: 0,
              margin: 0,
            }}
          >
            <legend style={{ padding: 0, margin: 0 }}>
              <button
                type="button"
                onClick={() => toggleSection('sorting')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                <span style={{ fontSize: '10px' }}>{sections.sorting ? '▼' : '▶'}</span>
                Sorting Plugin
              </button>
            </legend>

            {sections.sorting && (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px' }}
              >
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
                >
                  <input
                    type="checkbox"
                    checked={config.sorting?.enabled ?? true}
                    onChange={(event) => updateSortingConfig({ enabled: event.target.checked })}
                  />
                  Enable Sorting
                </label>

                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
                >
                  <input
                    type="checkbox"
                    checked={config.sorting?.enableMultiSort ?? true}
                    onChange={(event) =>
                      updateSortingConfig({ enableMultiSort: event.target.checked })
                    }
                    disabled={!config.sorting?.enabled}
                  />
                  Enable Multi-Sort (hold Shift + click)
                </label>

                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
                >
                  <input
                    type="checkbox"
                    checked={config.sorting?.stableSort ?? false}
                    onChange={(event) => updateSortingConfig({ stableSort: event.target.checked })}
                    disabled={!config.sorting?.enabled}
                  />
                  Stable Sort (preserve previous sort order)
                </label>

                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
                >
                  Sorting Mode:
                  <select
                    value={config.sorting?.sortingMode ?? 'auto'}
                    onChange={(event) =>
                      updateSortingConfig({ sortingMode: event.target.value as 'auto' | 'manual' })
                    }
                    disabled={!config.sorting?.enabled}
                    style={{ padding: '4px 8px', fontSize: '13px' }}
                  >
                    <option value="auto">Auto (sorts on change)</option>
                    <option value="manual">Manual (call applySorting)</option>
                  </select>
                </label>

                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
                >
                  Sorting Order:
                  <select
                    value={getCurrentSortingOrderLabel()}
                    onChange={(event) => {
                      const selected = sortingOrderOptions.find(
                        (opt) => opt.label === event.target.value,
                      );
                      if (selected) {
                        updateSortingConfig({ sortingOrder: selected.value });
                      }
                    }}
                    disabled={!config.sorting?.enabled}
                    style={{ padding: '4px 8px', fontSize: '13px' }}
                  >
                    {sortingOrderOptions.map((opt) => (
                      <option key={opt.label} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Apply Sorting Button (for manual mode) */}
                {isManualMode && config.sorting?.enabled && (
                  <button
                    type="button"
                    onClick={onApplySorting}
                    style={{
                      marginTop: '8px',
                      padding: '8px 16px',
                      fontSize: '13px',
                      fontWeight: 500,
                      backgroundColor: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      alignSelf: 'flex-start',
                    }}
                  >
                    Apply Sorting
                  </button>
                )}
              </div>
            )}
          </fieldset>
        </div>
      )}
    </div>
  );
}
