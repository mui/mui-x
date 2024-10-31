import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { ChartsTooltipClasses } from './chartsTooltipClasses';
import {
  ChartsTooltipCell,
  ChartsTooltipMark,
  ChartsTooltipPaper,
  ChartsTooltipRow,
  ChartsTooltipTable,
} from './ChartsTooltipTable';
import { useAxisTooltip } from './useAxisTooltip';
import { useXAxis, useYAxis } from '../hooks';

export type ChartsAxisContentProps = {
  /**
   * Override or extend the styles applied to the component.
   */
  classes: ChartsTooltipClasses;
  sx?: SxProps<Theme>;
};

/**
 * @ignore - internal component.
 */
function ChartsAxisTooltipContent(props: {
  sx?: SxProps<Theme>;
  classes: ChartsAxisContentProps['classes'];
}) {
  const { classes, sx } = props;
  const tootlipData = useAxisTooltip();
  const xAxis = useXAxis();
  const yAxis = useYAxis();

  if (tootlipData === null) {
    return null;
  }

  const { axisDirection, axisValue, axisFormattedValue, seriesItems } = tootlipData;

  const axis = axisDirection === 'x' ? xAxis : yAxis;
  
  return (
    <ChartsTooltipPaper sx={sx} className={classes.paper}>
      <ChartsTooltipTable className={classes.table}>
        {axisValue != null && !axis.hideTooltip && (
          <thead>
            <ChartsTooltipRow>
              <ChartsTooltipCell colSpan={3}>
                <Typography>{axisFormattedValue}</Typography>
              </ChartsTooltipCell>
            </ChartsTooltipRow>
          </thead>
        )}

        <tbody>
          {seriesItems.map(({ seriesId, color, formattedValue, formattedLabel }) => {
            if (formattedValue == null) {
              return null;
            }
            return (
              <ChartsTooltipRow key={seriesId} className={classes.row}>
                <ChartsTooltipCell className={clsx(classes.markCell, classes.cell)}>
                  {color && <ChartsTooltipMark color={color} className={classes.mark} />}
                </ChartsTooltipCell>
                <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)}>
                  {formattedLabel ? <Typography>{formattedLabel}</Typography> : null}
                </ChartsTooltipCell>
                <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)}>
                  <Typography>{formattedValue}</Typography>
                </ChartsTooltipCell>
              </ChartsTooltipRow>
            );
          })}
        </tbody>
      </ChartsTooltipTable>
    </ChartsTooltipPaper>
  );
}

export { ChartsAxisTooltipContent };
