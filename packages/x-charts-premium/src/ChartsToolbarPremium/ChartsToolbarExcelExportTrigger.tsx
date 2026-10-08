'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import { errorOnce } from '@mui/x-internals/warning';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import type { RenderProp } from '@mui/x-internals/useComponentRenderer';
import { useChartsSlots } from '@mui/x-charts/internals';
import type { ChartsSlotPropsPro, ChartsSlotsPro } from '@mui/x-charts-pro/internals';
import { useChartPremiumApiContext } from '../context/useChartPremiumApiContext';
import type { ChartPremiumApi } from '../context/ChartPremiumApi';
import type {
  ChartExcelExportOptions,
  UseChartPremiumExportPublicApi,
} from '../internals/plugins/useChartPremiumExport';

/** `useChartPremiumExport` is opt-in, so its methods are optional on the context api. */
export type ChartPremiumApiWithExcelExport = ChartPremiumApi &
  Partial<UseChartPremiumExportPublicApi>;

export type ChartsToolbarExcelExportTriggerProps = ChartsSlotPropsPro['baseButton'] & {
  /**
   * A function to customize the rendering of the component.
   */
  render?: RenderProp<ChartsSlotPropsPro['baseButton']>;
  /**
   * The options to apply on the Excel export.
   */
  options?: ChartExcelExportOptions;
  /**
   * Overrides how the export is performed.
   * Defaults to `apiRef.current.exportAsExcel`.
   * @param {ChartExcelExportOptions} options The options to apply on the Excel export.
   * @returns {Promise<void>} A promise that resolves once the export is done.
   */
  onExport?: (options?: ChartExcelExportOptions) => Promise<void>;
};

/**
 * A button that triggers an Excel export of the chart data.
 * It renders the `baseButton` slot.
 */
const ChartsToolbarExcelExportTrigger = forwardRef<
  HTMLButtonElement,
  ChartsToolbarExcelExportTriggerProps
>(function ChartsToolbarExcelExportTrigger(props, ref) {
  const { render, options, onExport, onClick, ...other } = props;
  const { slots, slotProps } = useChartsSlots<ChartsSlotsPro>();
  const apiRef = useChartPremiumApiContext<ChartPremiumApiWithExcelExport>();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const exportAsExcel = onExport ?? apiRef.current?.exportAsExcel;

    if (exportAsExcel) {
      exportAsExcel(options).catch((error) => {
        console.error('MUI X Charts: Error exporting chart as Excel:', error);
      });
    } else if (process.env.NODE_ENV !== 'production') {
      errorOnce(
        [
          'MUI X Charts: The Excel export trigger has nothing to export.',
          'Clicking it does nothing, because the chart does not register the `useChartPremiumExport` plugin and no `onExport` prop was passed.',
          'Add the plugin to the chart `plugins` array, or pass `onExport`.',
          'See https://mui.com/x/react-charts/plugins/ for the plugin list.',
        ].join('\n'),
      );
    }

    onClick?.(event);
  };

  const element = useComponentRenderer(slots.baseButton, render, {
    ...slotProps?.baseButton,
    onClick: handleClick,
    ...other,
    ref,
  });

  return <React.Fragment>{element}</React.Fragment>;
});

ChartsToolbarExcelExportTrigger.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  /**
   * Overrides how the export is performed.
   * Defaults to `apiRef.current.exportAsExcel`.
   * @param {ChartExcelExportOptions} options The options to apply on the Excel export.
   * @returns {Promise<void>} A promise that resolves once the export is done.
   */
  onExport: PropTypes.func,
  /**
   * The options to apply on the Excel export.
   */
  options: PropTypes.shape({
    escapeFormulas: PropTypes.bool,
    fileName: PropTypes.string,
    includeFormattedValues: PropTypes.bool,
    includeHeaders: PropTypes.bool,
    includeHiddenSeries: PropTypes.bool,
  }),
  /**
   * A function to customize the rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  style: PropTypes.object,
  tabIndex: PropTypes.number,
} as any;

export { ChartsToolbarExcelExportTrigger };
