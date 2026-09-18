'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import { useChartsSlots } from '@mui/x-charts/internals';
import { useChartsLocalization } from '@mui/x-charts/hooks';
import { ChartsToolbarPro } from '@mui/x-charts-pro/ChartsToolbarPro';
import type { ChartsToolbarProProps } from '@mui/x-charts-pro/ChartsToolbarPro';
import type { ChartsSlotsPro } from '@mui/x-charts-pro/internals';
import { ChartsToolbarExcelExportTrigger } from './ChartsToolbarExcelExportTrigger';
import type { ChartExcelExportOptions } from '../internals/plugins/useChartPremiumExport';

export interface ChartsToolbarPremiumExcelExportOptions extends ChartExcelExportOptions {
  /**
   * If `true`, the Excel export button is not shown in the toolbar's export menu.
   * @default false
   */
  disableToolbarButton?: boolean;
}

export interface ChartsToolbarPremiumProps extends Omit<ChartsToolbarProProps, 'exportMenuItems'> {
  /**
   * The options to apply on the Excel export.
   */
  excelExportOptions?: ChartsToolbarPremiumExcelExportOptions;
}

/**
 * The chart toolbar component for the premium package.
 * It adds the Excel export entry to the Pro toolbar's export menu.
 */
function ChartsToolbarPremium({ excelExportOptions, ...other }: ChartsToolbarPremiumProps) {
  const { slots, slotProps } = useChartsSlots<ChartsSlotsPro>();
  const { localeText } = useChartsLocalization();

  const renderExportMenuItems = React.useCallback(
    ({ onClose }: { onClose: () => void }) => {
      const MenuItem = slots.baseMenuItem;

      return (
        <ChartsToolbarExcelExportTrigger
          render={<MenuItem dense {...slotProps?.baseMenuItem} />}
          options={excelExportOptions}
          onClick={onClose}
        >
          {localeText.toolbarExportExcel}
        </ChartsToolbarExcelExportTrigger>
      );
    },
    [slots.baseMenuItem, slotProps?.baseMenuItem, excelExportOptions, localeText],
  );

  return (
    <ChartsToolbarPro
      {...other}
      exportMenuItems={excelExportOptions?.disableToolbarButton ? undefined : renderExportMenuItems}
    />
  );
}

ChartsToolbarPremium.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The options to apply on the Excel export.
   */
  excelExportOptions: PropTypes.shape({
    disableToolbarButton: PropTypes.bool,
    escapeFormulas: PropTypes.bool,
    fileName: PropTypes.string,
    includeFormattedValues: PropTypes.bool,
    includeHeaders: PropTypes.bool,
    includeHiddenSeries: PropTypes.bool,
  }),
  imageExportOptions: PropTypes.arrayOf(
    PropTypes.shape({
      copyStyles: PropTypes.bool,
      fileName: PropTypes.string,
      nonce: PropTypes.string,
      onBeforeExport: PropTypes.func,
      pixelRatio: PropTypes.number,
      quality: PropTypes.number,
      type: PropTypes.string.isRequired,
    }),
  ),
  printOptions: PropTypes.object,
  /**
   * Configuration for range buttons shown in the toolbar.
   * Each button zooms the chart to a predefined time range from the end of the data.
   */
  rangeButtons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.instanceOf(Date).isRequired),
        PropTypes.arrayOf(PropTypes.string.isRequired),
        PropTypes.func,
        PropTypes.shape({
          step: PropTypes.number,
          unit: PropTypes.oneOf([
            'day',
            'hour',
            'microsecond',
            'millisecond',
            'minute',
            'month',
            'second',
            'week',
            'year',
          ]).isRequired,
        }),
      ]),
    }),
  ),
  /**
   * The axis ID to apply range buttons to.
   * Defaults to the first x-axis with zoom enabled and a time scale.
   */
  rangeButtonsAxisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
} as any;

export { ChartsToolbarPremium };
