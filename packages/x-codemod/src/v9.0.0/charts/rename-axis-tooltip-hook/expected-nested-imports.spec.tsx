// @ts-nocheck
import {
  useAxesTooltip,
  UseAxesTooltipReturnValue,
  UseAxesTooltipParams,
} from '@mui/x-charts/ChartsTooltip';
import { useAxesTooltip as useAxisTooltipPro } from '@mui/x-charts-pro/ChartsTooltip';
import { useAxesTooltip as useAxisTooltipPremium } from '@mui/x-charts-premium/ChartsTooltip';

type RenameAxisTooltipParams = UseAxesTooltipParams;
type RenameAxisTooltipReturnValue = UseAxesTooltipReturnValue;

function App() {
  useAxesTooltip(params);
  useAxisTooltipPro();
  useAxisTooltipPremium();
}
