import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { type RenderProp, useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import { useChartsSlots } from '@mui/x-charts/internals';
import { useChartProApiContext } from '../context';
import { type ChartSvgExportOptions } from '../internals/plugins/useChartProExport';
import { type ChartsSlotPropsPro, type ChartsSlotsPro } from '../internals/material';

export interface ChartsToolbarSvgExportOptions extends ChartSvgExportOptions {
  /**
   * If `true`, this export option will be removed from the ChartsToolbarExport menu.
   * @default false
   */
  disableToolbarButton?: boolean;
}

export type ChartsToolbarSvgExportTriggerProps = ChartsSlotPropsPro['baseButton'] & {
  render?: RenderProp<ChartsSlotPropsPro['baseButton']>;
  options?: ChartsToolbarSvgExportOptions;
};

/**
 * A button that triggers an SVG export.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [Export](https://mui.com/x/react-charts/export/)
 */
const ChartsToolbarSvgExportTrigger = forwardRef<
  HTMLButtonElement,
  ChartsToolbarSvgExportTriggerProps
>(function ChartsToolbarSvgExportTrigger(props, ref) {
  const { render, options, onClick, ...other } = props;
  const { slots, slotProps } = useChartsSlots<ChartsSlotsPro>();
  const apiRef = useChartProApiContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    apiRef.current.exportAsSvg(options);
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

ChartsToolbarSvgExportTrigger.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  options: PropTypes.shape({
    copyStyles: PropTypes.bool,
    disableToolbarButton: PropTypes.bool,
    fileName: PropTypes.string,
    nonce: PropTypes.string,
    onBeforeExport: PropTypes.func,
  }),
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  style: PropTypes.object,
  tabIndex: PropTypes.number,
} as any;

export { ChartsToolbarSvgExportTrigger };
