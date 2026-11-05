'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ChartsRenderer } from '@mui/x-charts-premium/ChartsRenderer';
import { PieChart } from '@mui/x-charts/PieChart';
import { useStore } from '@base-ui/utils/store';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { eventCalendarPreferenceSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { useDisarmOnEscape, useDisarmOnOutsidePointer } from '@mui/x-scheduler/internals';
import type { SchedulerOccurrenceHighlight } from '@mui/x-scheduler-internals/internals';
import type { ChartsCardId, ChartsMetric } from './chartsFeature';
import { NO_RESOURCE, useChartsDatasets } from './useChartsDatasets';

const PanelRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: 246,
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

interface ChartsPanelProps {
  cards: ChartsCardId[];
  metric: ChartsMetric;
}

export function ChartsPanel({ cards, metric }: ChartsPanelProps) {
  const unit = metric === 'hours' ? ' h' : '';
  const store = useEventCalendarStoreContext();
  const {
    days,
    dayEnds,
    dayLabelLookup,
    resources,
    hoursPerDay,
    shareByResource,
    roots,
    hasNestedResources,
  } = useChartsDatasets(metric);

  const colorOf = React.useMemo(
    () => new Map(resources.map((resource) => [resource.id, resource.color])),
    [resources],
  );

  // Click toggles the highlight.
  const rootRef = React.useRef<HTMLDivElement>(null);
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

  // Same pattern as armed events: an outside click clears the highlight and is swallowed,
  // so it does not create an event; Escape clears it too.
  const highlight = useStore(store, (state) => state.occurrenceHighlight);
  const clearHighlight = React.useCallback(() => store.setOccurrenceHighlight(null), [store]);
  useDisarmOnOutsidePointer({
    ref: rootRef,
    active: highlight != null,
    onDisarm: clearHighlight,
    global: true,
  });
  useDisarmOnEscape({ active: highlight != null, onDisarm: clearHighlight });
  React.useEffect(() => () => store.setOccurrenceHighlight(null), [store]);

  const renderHoursPerDay = (
    <ChartsRenderer
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

  const leafSeries = {
    id: 'leaves',
    data: shareByResource.values[0].data.map((value, index) => ({
      id: resources[index].id,
      value,
      label: resources[index].label,
      color: resources[index].color,
    })),
    innerRadius: hasNestedResources ? 46 : 34,
    outerRadius: 64,
    paddingAngle: 0,
    valueFormatter: (item: { value: number }) => `${item.value}${unit}`,
  };
  const rootSeries = {
    id: 'roots',
    data: roots.map((root) => ({
      id: root.id,
      value: root.value,
      label: root.label,
      color: root.color,
    })),
    innerRadius: 22,
    outerRadius: 42,
    paddingAngle: 0,
    valueFormatter: (item: { value: number }) => `${item.value}${unit}`,
  };

  const renderShareByResource = (
    <PieChart
      height={150}
      width={228}
      margin={{ left: 0, right: 0, top: 4, bottom: 4 }}
      series={hasNestedResources ? [rootSeries, leafSeries] : [leafSeries]}
      hideLegend
      slotProps={{ tooltip: { trigger: 'none' } }}
      onItemClick={(_event, { seriesId, dataIndex }) => {
        const resource = seriesId === 'roots' ? roots[dataIndex] : resources[dataIndex];
        if (resource) {
          toggleHighlight(highlightResource(resource.id));
        }
      }}
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
    <PanelRoot ref={rootRef}>
      {cards.map((cardId) => (
        <Card key={cardId}>
          <CardTitle>{cardLookup[cardId].title}</CardTitle>
          {cardLookup[cardId].content}
        </Card>
      ))}
    </PanelRoot>
  );
}
