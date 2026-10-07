'use client';

import * as React from 'react';
import { useChartsSlots } from '@mui/x-charts/internals';
import type { ChartsSlotsPro } from '@mui/x-charts-pro/internals';
import { ChartsToolbarExcelExportTrigger } from './ChartsToolbarExcelExportTrigger';
import type { ChartExcelExportOptions } from '../internals/plugins/useChartPremiumExport';

export interface ChartsToolbarExcelExportMenuItemProps {
  /** Text of the entry. */
  label: string;
  /** The options to apply on the Excel export. */
  options?: ChartExcelExportOptions;
  /**
   * Overrides how the export is performed.
   * @param {ChartExcelExportOptions} options The options to apply on the Excel export.
   * @returns {Promise<void>} A promise that resolves once the export is done.
   */
  onExport?: (options?: ChartExcelExportOptions) => Promise<void>;
  /** Closes the export menu. */
  onClose: () => void;
}

/**
 * One Excel entry of the toolbar's export menu, rendered as the `baseMenuItem` slot.
 * Internal: it keeps the slot plumbing out of `ChartsToolbarPremium`.
 */
export function ChartsToolbarExcelExportMenuItem({
  label,
  options,
  onExport,
  onClose,
}: ChartsToolbarExcelExportMenuItemProps) {
  const { slots, slotProps } = useChartsSlots<ChartsSlotsPro>();
  const MenuItem = slots.baseMenuItem;

  return (
    <ChartsToolbarExcelExportTrigger
      render={<MenuItem dense {...slotProps?.baseMenuItem} />}
      options={options}
      onExport={onExport}
      onClick={onClose}
    >
      {label}
    </ChartsToolbarExcelExportTrigger>
  );
}
