'use client';
import * as React from 'react';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import { chartCopilotClasses } from './chartCopilotClasses';
import {
  AnalyzeEmpty,
  SummaryStatsPanel,
  CorrelationsPanel,
  AnomaliesPanel,
  ForecastPanel,
  IndicatorsPanel,
  type AnalyzeSeries,
} from './AnalyzePanels';

/** The deterministic analyses the user can run from the Analyze menu. */
export type AnalyzeKind = 'summary' | 'correlations' | 'anomalies' | 'forecast' | 'indicators';

interface AnalyzeMenuOption {
  kind: AnalyzeKind;
  label: string;
  description: string;
}

// Mirrors the Highcharts Orbit "Analyze" toolbar menu.
const ANALYZE_OPTIONS: AnalyzeMenuOption[] = [
  { kind: 'summary', label: 'Summary Stats', description: 'Min, max, mean, median, change' },
  { kind: 'correlations', label: 'Correlations', description: 'Pearson r between series' },
  { kind: 'anomalies', label: 'Anomaly Detection', description: 'Flag drops and spikes' },
  { kind: 'forecast', label: 'Forecast', description: 'Linear trend projection' },
  { kind: 'indicators', label: 'Indicators', description: 'SMA, EMA, RSI, MACD, …' },
];

export interface AnalyzeMenuProps {
  /**
   * The resolved series to analyze. Typically
   * `resolveForRenderer(state, dataset).values`.
   */
  series: AnalyzeSeries[];
  /** Extra content rendered in the toolbar row, after the Analyze button (e.g. the Copilot trigger). */
  toolbarExtra?: React.ReactNode;
  /** Override or extend the styles applied to the component. */
  className?: string;
}

const AnalyzeMenuContainer = styled('div', {
  name: 'MuiChartCopilot',
  slot: 'AnalyzeMenu',
})({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const AnalyzeMenuToolbar = styled('div', {
  name: 'MuiChartCopilot',
  slot: 'AnalyzeMenuToolbar',
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const AnalyzeMenuResult = styled('div', {
  name: 'MuiChartCopilot',
  slot: 'AnalyzeMenuResult',
})(({ theme }) => ({
  marginTop: theme.spacing(1),
  borderRadius: (theme.vars ?? theme).shape.borderRadius,
  border: `1px solid ${theme.alpha((theme.vars ?? theme).palette.text.primary, 0.12)}`,
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
}));

const MenuOptionDescription = styled('span')(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  color: (theme.vars ?? theme).palette.text.secondary,
}));

/** Renders the panel matching the active analyze kind. */
function AnalyzeResultPanel(props: { kind: AnalyzeKind; series: AnalyzeSeries[] }) {
  const { kind, series } = props;
  switch (kind) {
    case 'summary':
      return <SummaryStatsPanel series={series} />;
    case 'correlations':
      return <CorrelationsPanel series={series} />;
    case 'anomalies':
      return <AnomaliesPanel series={series} />;
    case 'forecast':
      return <ForecastPanel series={series} />;
    case 'indicators':
      return <IndicatorsPanel series={series} />;
    default:
      return null;
  }
}

/**
 * A user-driven "Analyze" menu (no LLM). Lists the deterministic analyses
 * (Summary Stats / Correlations / Anomaly Detection / Forecast / Indicators)
 * and, when one is selected, computes it on the supplied `series` and renders
 * the matching analyze panel below the trigger.
 *
 * Always available — independent of any chat adapter.
 */
export function AnalyzeMenu(props: AnalyzeMenuProps) {
  const { series, toolbarExtra, className } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [active, setActive] = React.useState<AnalyzeKind | null>(null);
  const open = anchorEl !== null;

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (kind: AnalyzeKind) => {
    setActive(kind);
    setAnchorEl(null);
  };

  return (
    <AnalyzeMenuContainer className={clsx(chartCopilotClasses.analyzeMenu, className)}>
      <AnalyzeMenuToolbar>
        <Button
          size="small"
          color={active !== null ? 'primary' : 'inherit'}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Analyze"
          className={chartCopilotClasses.analyzeMenuTrigger}
          onClick={handleOpen}
        >
          Analyze
        </Button>
        {toolbarExtra}
      </AnalyzeMenuToolbar>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {ANALYZE_OPTIONS.map((option) => (
          <MenuItem
            key={option.kind}
            selected={option.kind === active}
            onClick={() => handleSelect(option.kind)}
          >
            <ListItemText
              primary={option.label}
              secondary={<MenuOptionDescription>{option.description}</MenuOptionDescription>}
            />
          </MenuItem>
        ))}
      </Menu>
      {active !== null && (
        <AnalyzeMenuResult className={chartCopilotClasses.analyzeMenuResult}>
          {series.length === 0 ? (
            <AnalyzeEmpty>No series to analyze.</AnalyzeEmpty>
          ) : (
            <AnalyzeResultPanel kind={active} series={series} />
          )}
        </AnalyzeMenuResult>
      )}
    </AnalyzeMenuContainer>
  );
}
