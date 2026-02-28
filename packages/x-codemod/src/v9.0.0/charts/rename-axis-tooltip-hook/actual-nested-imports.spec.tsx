// @ts-nocheck
import {
  useAxisTooltip,
  UseAxisTooltipReturnValue,
  UseAxisTooltipParams,
} from '@mui/x-charts/ChartsTooltip';
import { useAxisTooltip as useAxisTooltipPro } from '@mui/x-charts-pro/ChartsTooltip';
import { useAxisTooltip as useAxisTooltipPremium } from '@mui/x-charts-premium/ChartsTooltip';

type RenameAxisTooltipParams = UseAxisTooltipParams;
type RenameAxisTooltipReturnValue = UseAxisTooltipReturnValue;

function App() {
  useAxisTooltip(params);
  useAxisTooltipPro();
  useAxisTooltipPremium();
}
