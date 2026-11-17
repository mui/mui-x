import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { createChartsFeature } from '@mui/x-scheduler-premium/charts';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import type { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler-internals/models';
import { StubRenderer, capturedDatasets, getChartItems } from './chartsTestUtils';

const features = { charts: createChartsFeature({ renderer: StubRenderer }) };
const work = ResourceBuilder.new().id('work').title('Work').build();
const health = ResourceBuilder.new().id('health').title('Health').build();

describe('useChartsDatasets', () => {
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  async function renderCalendar(
    props: Partial<React.ComponentProps<typeof EventCalendarPremium<SchedulerEvent, any>>> & {
      events: SchedulerEvent[];
      resources?: SchedulerResource[];
    },
  ) {
    return renderSettled(
      <EventCalendarPremium
        features={features}
        charts={{ cards: ['byDay', 'byResource'] }}
        resources={[work, health]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        view="week"
        views={['week', 'month']}
        {...props}
      />,
    );
  }

  // the value of the column of `resourceId` on the day of month `day`
  const columnValue = (container: HTMLElement, resourceId: string, day: string) =>
    Number(
      getChartItems(container, resourceId).find((item) => item.dataset.period === day)!.textContent,
    );
  const shareValues = (container: HTMLElement) =>
    getChartItems(container, 'ring-0').map((item) => [
      item.dataset.label,
      Number(item.textContent),
    ]);

  it('should count the events per day and per resource by default', async () => {
    const { container } = await renderCalendar({
      events: [
        EventBuilder.new().singleDay('2025-07-03T10:00:00Z', 120).resource(work).build(),
        EventBuilder.new().singleDay('2025-07-03T14:00:00Z', 30).resource(work).build(),
        EventBuilder.new().singleDay('2025-07-04T10:00:00Z', 60).resource(health).build(),
      ],
    });

    expect(columnValue(container, 'work', '3')).to.equal(2);
    expect(columnValue(container, 'work', '4')).to.equal(0);
    expect(columnValue(container, 'health', '4')).to.equal(1);
    expect(shareValues(container)).to.deep.equal([
      ['Work', 2],
      ['Health', 1],
    ]);
  });

  it('should sum the hours per day and clip a multi-day event to each day', async () => {
    const { container } = await renderCalendar({
      charts: { cards: ['byDay', 'byResource'], metric: 'hours' },
      events: [
        EventBuilder.new()
          .span('2025-07-03T20:00:00Z', '2025-07-04T02:00:00Z')
          .resource(work)
          .build(),
        EventBuilder.new().singleDay('2025-07-04T10:00:00Z', 90).resource(health).build(),
      ],
    });

    expect(columnValue(container, 'work', '3')).to.equal(4);
    expect(columnValue(container, 'work', '4')).to.equal(2);
    expect(columnValue(container, 'health', '4')).to.equal(1.5);
    expect(shareValues(container)).to.deep.equal([
      ['Work', 6],
      ['Health', 1.5],
    ]);
  });

  it('should count a multi-day event once in the share and on every day of the columns', async () => {
    const { container } = await renderCalendar({
      events: [
        EventBuilder.new()
          .span('2025-07-02T10:00:00Z', '2025-07-04T10:00:00Z')
          .resource(work)
          .build(),
      ],
    });

    expect(columnValue(container, 'work', '2')).to.equal(1);
    expect(columnValue(container, 'work', '3')).to.equal(1);
    expect(columnValue(container, 'work', '4')).to.equal(1);
    expect(shareValues(container)).to.deep.equal([
      ['Work', 1],
      ['Health', 0],
    ]);
  });

  it('should count an all-day event as one event and as zero hours', async () => {
    const events = [EventBuilder.new().fullDay('2025-07-03').resource(work).build()];

    const { container: countContainer, unmount } = await renderCalendar({ events });
    expect(columnValue(countContainer, 'work', '3')).to.equal(1);
    unmount();

    const { container } = await renderCalendar({
      events,
      charts: { cards: ['byDay'], metric: 'hours' },
    });
    expect(columnValue(container, 'work', '3')).to.equal(0);
  });

  it('should leave the hidden resources out', async () => {
    const { container } = await renderCalendar({
      visibleResources: { health: false },
      events: [EventBuilder.new().singleDay('2025-07-03T10:00:00Z').resource(health).build()],
    });

    expect(getChartItems(container, 'health')).to.have.length(0);
    expect(shareValues(container)).to.deep.equal([['Work', 0]]);
  });

  it('should attribute a multi-resource event to its first visible resource', async () => {
    const events = [
      EventBuilder.new().singleDay('2025-07-03T10:00:00Z').resources([work, health]).build(),
    ];

    const { container: bothVisible, unmount } = await renderCalendar({ events });
    expect(shareValues(bothVisible)).to.deep.equal([
      ['Work', 1],
      ['Health', 0],
    ]);
    unmount();

    const { container } = await renderCalendar({ events, visibleResources: { work: false } });
    expect(shareValues(container)).to.deep.equal([['Health', 1]]);
  });

  it('should add the "No resource" series only when an event has no visible resource', async () => {
    const { container: withResources, unmount } = await renderCalendar({
      events: [EventBuilder.new().singleDay('2025-07-03T10:00:00Z').resource(work).build()],
    });
    expect(shareValues(withResources).map(([label]) => label)).to.deep.equal(['Work', 'Health']);
    unmount();

    const { container } = await renderCalendar({
      events: [
        EventBuilder.new().singleDay('2025-07-03T10:00:00Z').build(),
        EventBuilder.new()
          .singleDay('2025-07-04T10:00:00Z')
          .resource({ id: 'ghost', title: 'Ghost' })
          .build(),
      ],
    });
    expect(shareValues(container)).to.deep.equal([
      ['Work', 0],
      ['Health', 0],
      ['No resource', 2],
    ]);
  });

  it('should describe the nested resources with a root dimension in tree order', async () => {
    const design = ResourceBuilder.new().id('design').title('Design').build();
    const engineering = ResourceBuilder.new()
      .id('engineering')
      .title('Engineering')
      .children([design])
      .build();
    await renderCalendar({
      resources: [engineering, work],
      events: [EventBuilder.new().singleDay('2025-07-03T10:00:00Z').resource(design).build()],
    });

    const { dimensions, values } = capturedDatasets.pie!;
    expect(dimensions.map((dimension) => dimension.id)).to.deep.equal(['root', 'resource']);
    expect(dimensions[0].data).to.deep.equal(['engineering', 'engineering', 'work']);
    expect(dimensions[1].data).to.deep.equal(['engineering', 'design', 'work']);
    expect(values[0].data).to.deep.equal([0, 1, 0]);
  });

  it('should use one column per week in the month view', async () => {
    const { container } = await renderCalendar({
      view: 'month',
      events: [
        EventBuilder.new().singleDay('2025-07-01T10:00:00Z').resource(work).build(),
        EventBuilder.new().singleDay('2025-07-04T10:00:00Z').resource(work).build(),
        EventBuilder.new().singleDay('2025-07-10T10:00:00Z').resource(work).build(),
      ],
    });

    const columns = getChartItems(container, 'work');
    expect(columns.length).to.be.within(5, 6);
    expect(columns.map((column) => Number(column.textContent)).slice(0, 3)).to.deep.equal([
      2, 1, 0,
    ]);
  });
});
