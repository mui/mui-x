'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { useStore } from '@base-ui/utils/store';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { eventCalendarPreferenceSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import {
  eventColorTokens,
  useDisarmOnEscape,
  useEventCalendarStyledContext,
} from '@mui/x-scheduler/internals';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import type { SchedulerOccurrenceHighlight } from '@mui/x-scheduler-internals/internals';
import type {
  EventCalendarPremiumChartsCard,
  EventCalendarPremiumChartsMetric,
} from '../event-calendar-premium/charts/EventCalendarPremiumChartsContext';
import { EventCalendarPremiumChartsContext } from '../event-calendar-premium/charts/EventCalendarPremiumChartsContext';
import type { EventCalendarPremiumChartsRenderer } from './chartsFeature';
import type { ChartsResourceInfo } from './useChartsDatasets';
import { NO_RESOURCE, useChartsDatasets } from './useChartsDatasets';

const DEFAULT_CARDS: EventCalendarPremiumChartsCard[] = ['byResource'];
const DEFAULT_METRIC: EventCalendarPremiumChartsMetric = 'count';

const paletteEntries = Object.entries(eventColorTokens);
const ChartsPanelRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'ChartsPanel',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: 246,
  // the chart colors of the event palettes, in both modes
  ...Object.fromEntries(
    paletteEntries.map(([name, tokens]) => [`--scheduler-charts-${name}`, tokens.light.main]),
  ),
  ...theme.applyStyles(
    'dark',
    Object.fromEntries(
      paletteEntries.map(([name, tokens]) => [`--scheduler-charts-${name}`, tokens.dark.main]),
    ),
  ),
}));

// Same spacing as the resources tree.
const ChartsCard = styled('section', {
  name: 'MuiEventCalendar',
  slot: 'ChartsCard',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1),
  boxSizing: 'border-box',
}));

const ChartsCardTitle = styled(Typography, {
  name: 'MuiEventCalendar',
  slot: 'ChartsCardTitle',
})(({ theme }) => ({
  ...theme.typography.subtitle2,
  fontWeight: theme.typography.fontWeightMedium,
  paddingInlineStart: theme.spacing(1.25),
  paddingBottom: theme.spacing(1),
}));

// `barClasses.element` and `pieClasses.arc` of `@mui/x-charts`, without importing it.
const CHART_ITEM_SELECTOR = `.${generateUtilityClass('MuiBarChart', 'element')}, .${generateUtilityClass('MuiPieChart', 'arc')}`;

interface ChartsPanelProps {
  renderer: EventCalendarPremiumChartsRenderer;
}

export function ChartsPanel({ renderer: Renderer }: ChartsPanelProps) {
  const { cards = DEFAULT_CARDS, metric = DEFAULT_METRIC } = React.useContext(
    EventCalendarPremiumChartsContext,
  );
  const store = useEventCalendarStoreContext();
  const { classes, localeText } = useEventCalendarStyledContext();
  const { periods, isByWeek, resources, byDay, byResource, roots, hasNestedResources } =
    useChartsDatasets(metric);

  const toggleHighlight = (next: SchedulerOccurrenceHighlight) => {
    store.setOccurrenceHighlight(isDeepEqual(store.state.occurrenceHighlight, next) ? null : next);
  };
  const resourceHighlight = (resourceId: string): SchedulerOccurrenceHighlight => ({
    resourceId: resourceId === NO_RESOURCE ? null : resourceId,
  });

  // Clear the highlight when the panel closes or unmounts.
  const isSidePanelOpen = useStore(store, eventCalendarPreferenceSelectors.isSidePanelOpen);
  const clearHighlight = React.useCallback(() => store.setOccurrenceHighlight(null), [store]);
  React.useEffect(() => {
    if (!isSidePanelOpen) {
      clearHighlight();
    }
    return clearHighlight;
  }, [isSidePanelOpen, clearHighlight]);

  // A click outside the bars and slices clears the highlight. On an empty cell of the grid it is
  // also swallowed, so it does not create an event.
  const isHighlighting = useStore(store, (state) => state.occurrenceHighlight != null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const node = rootRef.current;
    if (!isHighlighting || !node) {
      return undefined;
    }
    const onClickCapture = (event: MouseEvent) => {
      const target = event.composedPath()[0];
      if (!(target instanceof Element) || target.closest(CHART_ITEM_SELECTOR)) {
        return;
      }
      if (
        target.closest(`.${eventCalendarClasses.content}`) &&
        !target.closest('[data-highlight]')
      ) {
        event.stopPropagation();
        event.preventDefault();
      }
      clearHighlight();
    };
    const doc = node.ownerDocument;
    doc.addEventListener('click', onClickCapture, true);
    return () => doc.removeEventListener('click', onClickCapture, true);
  }, [isHighlighting, clearHighlight]);
  useDisarmOnEscape({ onDisarm: clearHighlight });

  const periodLabelLookup = new Map(periods.map((period) => [period.key, period.label]));
  const renderByDay = (
    <Renderer
      chartType="column"
      dimensions={byDay.dimensions}
      values={byDay.values}
      configuration={{
        stacked: true,
        height: 150,
        grid: 'horizontal',
        legendPositionHorizontal: 'none',
        borderRadius: 3,
      }}
      onRender={(_type, props, Component) => (
        <Component
          {...props}
          margin={{ left: 0, right: 4, top: 8, bottom: 0 }}
          xAxis={[
            {
              ...props.xAxis?.[0],
              valueFormatter: (key: string) => periodLabelLookup.get(key) ?? key,
            },
          ]}
          yAxis={[{ width: 28 }]}
          slotProps={{ ...props.slotProps, tooltip: { trigger: 'none' } }}
          onItemClick={(
            _event: React.MouseEvent,
            { seriesId, dataIndex }: { seriesId: string; dataIndex: number },
          ) => {
            const period = periods[dataIndex];
            if (period) {
              toggleHighlight({
                ...resourceHighlight(seriesId),
                range: { start: period.start, end: period.end },
                // all-day events have no hours, so they are not in the bar
                timedOnly: metric === 'hours',
              });
            }
          }}
        />
      )}
    />
  );

  // The renderer draws one ring per dimension, in row order: the roots inside, the resources outside.
  const ringItems: ChartsResourceInfo[][] = hasNestedResources ? [roots, resources] : [resources];
  const renderByResource = (
    <Renderer
      chartType="pie"
      dimensions={byResource.dimensions}
      values={byResource.values}
      configuration={{
        height: 150,
        width: 228,
        innerRadius: 22,
        outerRadius: 64,
        seriesGap: 4,
        paddingAngle: 0,
        pieLegendDirection: 'vertical',
        pieLegendPositionVertical: 'none',
        pieTooltipTrigger: 'none',
      }}
      onRender={(_type, props, Component) => (
        <Component
          {...props}
          margin={{ left: 0, right: 0, top: 4, bottom: 4 }}
          series={props.series.map((series: Record<string, any>, ringIndex: number) => ({
            ...series,
            id: `ring-${ringIndex}`,
            data: series.data.map((item: Record<string, any>, itemIndex: number) => {
              const resource = ringItems[ringIndex][itemIndex];
              return { ...item, id: resource.id, label: resource.label, color: resource.color };
            }),
          }))}
          onItemClick={(
            _event: React.MouseEvent,
            { seriesId, dataIndex }: { seriesId: string; dataIndex: number },
          ) => {
            const ringIndex = Number(seriesId.slice('ring-'.length));
            const resource = ringItems[ringIndex]?.[dataIndex];
            if (resource) {
              toggleHighlight({
                ...resourceHighlight(resource.id),
                // the inner ring sums the descendants of each root
                includeDescendants: hasNestedResources && ringIndex === 0,
              });
            }
          }}
        />
      )}
    />
  );

  const byDayTitles = {
    hours: isByWeek ? localeText.chartsHoursPerWeek : localeText.chartsHoursPerDay,
    count: isByWeek ? localeText.chartsEventsPerWeek : localeText.chartsEventsPerDay,
  };
  const cardLookup: Record<
    EventCalendarPremiumChartsCard,
    { title: string; content: React.ReactNode }
  > = {
    byDay: { title: byDayTitles[metric], content: renderByDay },
    byResource: { title: localeText.chartsShareByResource, content: renderByResource },
  };

  return (
    <ChartsPanelRoot ref={rootRef} className={classes.chartsPanel}>
      {cards.map((cardId) => (
        <ChartsCard key={cardId} className={classes.chartsCard}>
          <ChartsCardTitle className={classes.chartsCardTitle}>
            {cardLookup[cardId].title}
          </ChartsCardTitle>
          {cardLookup[cardId].content}
        </ChartsCard>
      ))}
    </ChartsPanelRoot>
  );
}
