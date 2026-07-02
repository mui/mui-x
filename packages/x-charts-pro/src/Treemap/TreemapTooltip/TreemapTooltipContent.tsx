'use client';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  ChartsTooltipPaper,
  ChartsTooltipTable,
  ChartsTooltipRow,
  ChartsTooltipCell,
  useItemTooltip,
} from '@mui/x-charts/ChartsTooltip';
import { ChartsLabelMark } from '@mui/x-charts/internals';
import type { TreemapTooltipProps } from './TreemapTooltip.types';
import { useUtilityClasses } from './TreemapTooltip.classes';

export interface TreemapTooltipContentProps extends Pick<TreemapTooltipProps, 'classes'> {}

export function TreemapTooltipContent(props: TreemapTooltipContentProps) {
  const classes = useUtilityClasses(props);

  const tooltipData = useItemTooltip<'treemap'>();

  if (!tooltipData) {
    return null;
  }

  const { color, formattedValue, markType, label } = tooltipData;

  return (
    <ChartsTooltipPaper className={classes.paper}>
      <ChartsTooltipTable className={classes.table}>
        <tbody>
          <ChartsTooltipRow className={classes.row}>
            <ChartsTooltipCell className={clsx(classes.cell)} component="th">
              <div className={classes.markContainer}>
                <ChartsLabelMark type={markType} color={color} className={classes.mark} />
              </div>
              {label}
            </ChartsTooltipCell>
            <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)} component="td">
              {formattedValue}
            </ChartsTooltipCell>
          </ChartsTooltipRow>
        </tbody>
      </ChartsTooltipTable>
    </ChartsTooltipPaper>
  );
}

TreemapTooltipContent.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
} as any;
