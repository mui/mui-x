import { ChartsTooltipContainer } from '@mui/x-charts/ChartsTooltip';
import { type CandlestickTooltipProps } from './CandlestickTooltip.types';
import { CandlestickTooltipContent } from './CandlestickTooltipContent';
import { useUtilityClasses } from './Candlestick.classes';

export function CandlestickTooltip(props: CandlestickTooltipProps) {
  const classes = useUtilityClasses({ classes: props.classes });

  return (
    <ChartsTooltipContainer trigger="axis" {...props} classes={classes}>
      <CandlestickTooltipContent classes={classes} />
    </ChartsTooltipContainer>
  );
}
