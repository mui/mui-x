'use client';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { useThemeProps } from '@mui/material/styles';
import {
  type ChartsPolarGridClasses,
  getChartsPolarGridUtilityClass,
} from './chartsPolarGridClasses';
import { PolarGridRoot } from './styledComponents';
import { ChartsPolarRadialGrid } from './ChartsPolarRadialGrid';
import { ChartsPolarCircularGrid } from './ChartsPolarCircularGrid';
import { useChartsContext } from '../context/ChartsProvider';
import {
  type UseChartPolarAxisSignature,
  selectorChartPolarCenter,
} from '../internals/plugins/featurePlugins/useChartPolarAxis';

const useUtilityClasses = ({ classes }: ChartsPolarGridProps) => {
  const slots = {
    root: ['root'],
    radialLine: ['line', 'radialLine'],
    circularLine: ['line', 'circularLine'],
  };

  return composeClasses(slots, getChartsPolarGridUtilityClass, classes);
};

export interface ChartsPolarGridProps {
  /**
   * A CSS class name applied to the root element.
   */
  className?: string;
  /**
   * Displays radial lines from center to edge.
   * @default true
   */
  radial?: boolean;
  /**
   * Displays concentric circular grid rings.
   * @default true
   */
  circular?: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsPolarGridClasses>;
}

/**
 * Renders a polar grid with radial lines and concentric circular rings.
 *
 * Demos:
 *
 * - [Polar Charts](https://mui.com/x/react-charts/polar/)
 *
 * API:
 *
 * - [ChartsPolarGrid API](https://mui.com/x/api/charts/charts-polar-grid/)
 */
function ChartsPolarGrid(inProps: ChartsPolarGridProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiChartsPolarGrid' });

  const { store } = useChartsContext<[UseChartPolarAxisSignature]>();
  const { className, radial = true, circular = true, ...other } = props;

  const center = store.use(selectorChartPolarCenter);

  const classes = useUtilityClasses(props);

  if (!center) {
    return null;
  }

  return (
    <PolarGridRoot {...other} className={clsx(classes.root, className)}>
      {radial && <ChartsPolarRadialGrid center={center} classes={classes} />}

      {circular && <ChartsPolarCircularGrid center={center} classes={classes} />}
    </PolarGridRoot>
  );
}

ChartsPolarGrid.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Displays concentric circular grid rings.
   * @default true
   */
  circular: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The number of concentric circular divisions in the grid.
   * @default 5
   */
  divisions: PropTypes.number,
  /**
   * Displays radial lines from center to edge.
   * @default true
   */
  radial: PropTypes.bool,
} as any;

export { ChartsPolarGrid };
