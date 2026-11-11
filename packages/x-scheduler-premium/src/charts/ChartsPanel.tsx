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
  useDisarmOnOutsidePointer,
} from '@mui/x-scheduler/internals';
import type { SchedulerOccurrenceHighlight } from '@mui/x-scheduler-internals/internals';
import type { ChartsCardId, ChartsMetric, ChartsRendererComponent } from './chartsFeature';
import type { ChartsResourceInfo } from './useChartsDatasets';
import { NO_RESOURCE, useChartsDatasets } from './useChartsDatasets';

const paletteEntries = Object.entries(eventColorTokens);
const PanelRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: 246,
  // the chart colors follow the event palettes in both modes (see `chartColorVar`)
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

// Mirrors ResourcesTreeRoot / ResourcesTreeLabel so the cards read as side panel sections.
const Card = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1),
  boxSizing: 'border-box',
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  fontWeight: theme.typography.fontWeightMedium,
  paddingInlineStart: theme.spacing(1.25),
  paddingBottom: theme.spacing(1),
}));

// The elements a click toggles instead of clearing the highlight.
// Same class names as `barClasses.element` and `pieClasses.arc` of `@mui/x-charts`.
const CHART_ITEM_SELECTOR = `.${generateUtilityClass('MuiBarChart', 'element')}, .${generateUtilityClass('MuiPieChart', 'arc')}`;

interface ChartsPanelProps {
  renderer: ChartsRendererComponent;
  cards: ChartsCardId[];
  metric: ChartsMetric;
}

export function ChartsPanel({ renderer: Renderer, cards, metric }: ChartsPanelProps) {
  const unit = metric === 'hours' ? ' h' : '';
  const store = useEventCalendarStoreContext();
  const {
    days,
    dayEnds,
    dayLabelLookup,
    resources,
    hoursPerDay,
    shareByResource,
    shareItems,
    roots,
    hasNestedResources,
  } = useChartsDatasets(metric);

  const colorOf = React.useMemo(
    () => new Map(resources.map((resource) => [resource.id, resource.color])),
    [resources],
  );

  // Click toggles the highlight.
  const toggleHighlight = (next: SchedulerOccurrenceHighlight) => {
    store.setOccurrenceHighlight(isDeepEqual(store.state.occurrenceHighlight, next) ? null : next);
  };
  const highlightResource = (resourceId: string): SchedulerOccurrenceHighlight => ({
    resourceId: resourceId === NO_RESOURCE ? null : resourceId,
  });

  // A pinned highlight must not outlive the panel being visible.
  const isSidePanelOpen = useStore(store, eventCalendarPreferenceSelectors.isSidePanelOpen);
  React.useEffect(() => {
    if (!isSidePanelOpen) {
      store.setOccurrenceHighlight(null);
    }
  }, [isSidePanelOpen, store]);

  // Same pattern as armed events: a click anywhere but on a bar or a slice clears the
  // highlight and is swallowed, so it does not create an event; Escape clears it too.
  // The anchor is an empty element so that the rest of the panel counts as outside.
  const highlight = useStore(store, (state) => state.occurrenceHighlight);
  const clearHighlight = React.useCallback(() => store.setOccurrenceHighlight(null), [store]);
  const outsideAnchorRef = React.useRef<HTMLSpanElement>(null);
  useDisarmOnOutsidePointer({
    ref: outsideAnchorRef,
    active: highlight != null,
    onDisarm: clearHighlight,
    ignoreSelector: CHART_ITEM_SELECTOR,
    global: true,
  });
  useDisarmOnEscape({ active: highlight != null, onDisarm: clearHighlight });
  React.useEffect(() => () => store.setOccurrenceHighlight(null), [store]);

  const renderHoursPerDay = (
    <Renderer
      chartType="column"
      dimensions={hoursPerDay.dimensions}
      values={hoursPerDay.values}
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
              valueFormatter: (key: string) => dayLabelLookup.get(key) ?? key,
            },
          ]}
          yAxis={[{ width: 28 }]}
          series={props.series.map((series: { id: string }) => ({
            ...series,
            color: colorOf.get(series.id),
          }))}
          slotProps={{ ...props.slotProps, tooltip: { trigger: 'none' } }}
          onItemClick={(
            _event: React.MouseEvent,
            { seriesId, dataIndex }: { seriesId: string; dataIndex: number },
          ) => {
            const day = days[dataIndex];
            if (day) {
              toggleHighlight({
                ...highlightResource(seriesId),
                range: { start: day.timestamp, end: dayEnds[dataIndex] },
              });
            }
          }}
        />
      )}
    />
  );

  // One ring per dimension: the roots inside when the resources are nested, the resources outside.
  // The rows are sorted by root, so the items of each ring follow the order of `roots` / `shareItems`.
  const ringItems: ChartsResourceInfo[][] = hasNestedResources ? [roots, shareItems] : [shareItems];
  const renderShareByResource = (
    <Renderer
      chartType="pie"
      dimensions={shareByResource.dimensions}
      values={shareByResource.values}
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
            valueFormatter: (item: { value: number }) => `${item.value}${unit}`,
          }))}
          onItemClick={(
            _event: React.MouseEvent,
            { seriesId, dataIndex }: { seriesId: string; dataIndex: number },
          ) => {
            const resource = ringItems[Number(seriesId.slice('ring-'.length))]?.[dataIndex];
            if (resource) {
              toggleHighlight(highlightResource(resource.id));
            }
          }}
        />
      )}
    />
  );

  const cardLookup: Record<ChartsCardId, { title: string; content: React.ReactNode }> = {
    hoursPerDay: {
      title: metric === 'hours' ? 'Hours per day' : 'Events per day',
      content: renderHoursPerDay,
    },
    shareByResource: {
      title: 'Share by resource',
      content: renderShareByResource,
    },
  };

  return (
    <PanelRoot>
      <span ref={outsideAnchorRef} hidden />
      {cards.map((cardId) => (
        <Card key={cardId}>
          <CardTitle>{cardLookup[cardId].title}</CardTitle>
          {cardLookup[cardId].content}
        </Card>
      ))}
    </PanelRoot>
  );
}
