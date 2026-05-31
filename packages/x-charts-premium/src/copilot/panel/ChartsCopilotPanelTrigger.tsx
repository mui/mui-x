'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { createSvgIcon } from '@mui/material/utils';
import { chartCopilotClasses } from './chartCopilotClasses';
import { useChartsCopilotControls } from './ChartsCopilotProvider';

const CopilotIcon = createSvgIcon(
  // Sparkles-style "AI" icon — generic enough to suit any backend.
  <path d="M12 2 9.5 7.5 4 10l5.5 2.5L12 18l2.5-5.5L20 10l-5.5-2.5L12 2zm6 11-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2zM5 14l-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2z" />,
  'ChartCopilot',
);

(CopilotIcon as any).propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  /**
   * The color of the component.
   * It supports both default and custom theme colors, which can be added as shown in the
   * [palette customization guide](https://mui.com/material-ui/customization/palette/#custom-colors).
   * You can use the `htmlColor` prop to apply a color attribute to the SVG element.
   * @default 'inherit'
   */
  color: PropTypes.oneOf([
    'action',
    'disabled',
    'error',
    'info',
    'inherit',
    'primary',
    'secondary',
    'success',
    'warning',
  ]),
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * The fontSize applied to the icon. Defaults to 24px, but can be configure to inherit font size.
   * @default 'medium'
   */
  fontSize: PropTypes.oneOf(['inherit', 'large', 'medium', 'small']),
  /**
   * Applies a color attribute to the SVG element.
   */
  htmlColor: PropTypes.string,
  /**
   * If `true`, the root node will inherit the custom `component`'s viewBox and the `viewBox`
   * prop will be ignored.
   * Useful when you want to reference a custom `component` and have `SvgIcon` pass that
   * `component`'s viewBox to the root node.
   * @default false
   */
  inheritViewBox: PropTypes.bool,
  /**
   * The shape-rendering attribute. The behavior of the different options is described on the
   * [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/shape-rendering).
   * If you are having issues with blurry icons you should investigate this prop.
   */
  shapeRendering: PropTypes.string,
  style: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Provides a human-readable title for the element that contains it.
   * https://www.w3.org/TR/SVG-access/#Equivalent
   */
  titleAccess: PropTypes.string,
  /**
   * Allows you to redefine what the coordinates without units mean inside an SVG element.
   * For example, if the SVG element is 500 (width) by 200 (height),
   * and you pass viewBox="0 0 50 20",
   * this means that the coordinates inside the SVG will go from the top left corner (0,0)
   * to bottom right (50,20) and each unit will be worth 10px.
   * @default '0 0 24 24'
   */
  viewBox: PropTypes.string,
} as any;

export interface ChartsCopilotPanelTriggerProps {
  /** Override or extend the styles applied to the component. */
  className?: string;
}

/**
 * Default toolbar trigger. Reads the Charts Copilot controls from context and
 * renders an icon button that toggles the panel. Returns `null` when the
 * Copilot integration is not available.
 */
export function ChartsCopilotPanelTrigger(props: ChartsCopilotPanelTriggerProps) {
  const { className } = props;
  const { open, setOpen, available } = useChartsCopilotControls();
  if (!available) {
    return null;
  }
  return (
    <Tooltip title="Open Copilot">
      <IconButton
        size="small"
        color={open ? 'primary' : 'default'}
        aria-label="Open Copilot"
        aria-expanded={open}
        className={clsx(chartCopilotClasses.trigger, className)}
        onClick={() => setOpen(!open)}
      >
        <CopilotIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
