import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@mui/internal-test-utils';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { createChartsFeature } from '@mui/x-scheduler-premium/charts';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  getEventByTitle,
  ResourceBuilder,
} from 'test/utils/scheduler';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import { StubRenderer, getChartItems } from './chartsTestUtils';

const features = { charts: createChartsFeature({ renderer: StubRenderer }) };
const work = ResourceBuilder.new().id('work').title('Work').build();
const health = ResourceBuilder.new().id('health').title('Health').build();
const events = [
  EventBuilder.new()
    .title('Work on Thursday')
    .singleDay('2025-07-03T10:00:00Z')
    .resource(work)
    .build(),
  EventBuilder.new()
    .title('Work on Friday')
    .singleDay('2025-07-04T10:00:00Z')
    .resource(work)
    .build(),
  EventBuilder.new()
    .title('Health on Thursday')
    .singleDay('2025-07-03T12:00:00Z')
    .resource(health)
    .build(),
];

describe('ChartsPanel', () => {
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  function Calendar(
    props: Partial<React.ComponentProps<typeof EventCalendarPremium<SchedulerEvent, any>>>,
  ) {
    return (
      <EventCalendarPremium
        features={features}
        charts={{ cards: ['byDay', 'byResource'] }}
        events={events}
        resources={[work, health]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        view="week"
        views={['week', 'month', 'agenda']}
        onEventsChange={() => {}}
        {...props}
      />
    );
  }

  const highlightOf = (title: string) => getEventByTitle(title).getAttribute('data-highlight');
  const workThursdayBar = (container: HTMLElement) =>
    getChartItems(container, 'work').find((item) => item.dataset.period === '3')!;
  const slice = (container: HTMLElement, index: number) =>
    getChartItems(container, 'ring-0')[index];

  it('should render the cards with the feature only', async () => {
    const { unmount } = await renderSettled(<Calendar />);
    expect(screen.getByText('Share by resource')).not.to.equal(null);
    unmount();

    await renderSettled(<Calendar features={{}} />);
    expect(screen.queryByText('Share by resource')).to.equal(null);
  });

  it('should throw when the feature is created without a renderer', () => {
    expect(() => createChartsFeature({} as any)).toThrow('renderer');
  });

  it('should highlight the events of the clicked bar and dim the others', async () => {
    const { container } = await renderSettled(<Calendar />);

    fireEvent.click(workThursdayBar(container));

    expect(highlightOf('Work on Thursday')).to.equal('highlighted');
    expect(highlightOf('Work on Friday')).to.equal('dimmed');
    expect(highlightOf('Health on Thursday')).to.equal('dimmed');
  });

  it('should clear the highlight when the same bar is clicked again', async () => {
    const { container } = await renderSettled(<Calendar />);

    fireEvent.click(workThursdayBar(container));
    fireEvent.click(workThursdayBar(container));

    expect(highlightOf('Work on Thursday')).to.equal(null);
    expect(highlightOf('Work on Friday')).to.equal(null);
  });

  it('should replace the highlight when another slice is clicked', async () => {
    const { container } = await renderSettled(<Calendar />);

    fireEvent.click(slice(container, 0));
    fireEvent.click(slice(container, 1));

    expect(highlightOf('Health on Thursday')).to.equal('highlighted');
    expect(highlightOf('Work on Thursday')).to.equal('dimmed');
    expect(highlightOf('Work on Friday')).to.equal('dimmed');
  });

  it('should clear the highlight on Escape', async () => {
    const { container } = await renderSettled(<Calendar />);

    fireEvent.click(slice(container, 0));
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });

    expect(highlightOf('Work on Thursday')).to.equal(null);
  });

  it('should clear the highlight and let a click outside the charts do its job', async () => {
    const { container } = await renderSettled(<Calendar />);
    fireEvent.click(slice(container, 0));

    fireEvent.click(
      screen.getByRole('treeitem', { name: /Health/ }).querySelector('input[type="checkbox"]')!,
    );

    expect(highlightOf('Work on Thursday')).to.equal(null);
    expect(screen.queryByLabelText(/^Health on Thursday/)).to.equal(null);
  });

  it('should open the clicked event while its highlight clears', async () => {
    const view = await renderSettled(<Calendar />);
    fireEvent.click(slice(view.container, 0));

    await view.user.click(getEventByTitle('Work on Thursday'));

    expect(screen.getByRole('dialog')).not.to.equal(null);
    expect(highlightOf('Work on Thursday')).to.equal(null);
  });

  it('should clear the highlight when the side panel is closed', async () => {
    const { container } = await renderSettled(<Calendar />);
    fireEvent.click(slice(container, 0));

    fireEvent.click(screen.getByRole('button', { name: 'Close side panel' }));

    expect(highlightOf('Work on Thursday')).to.equal(null);
  });

  it('should highlight the descendants of a clicked root slice', async () => {
    const design = ResourceBuilder.new().id('design').title('Design').build();
    const engineering = ResourceBuilder.new()
      .id('engineering')
      .title('Engineering')
      .children([design])
      .build();
    const { container } = await renderSettled(
      <Calendar
        resources={[engineering, work]}
        events={[
          EventBuilder.new()
            .title('Design review')
            .singleDay('2025-07-03T10:00:00Z')
            .resource(design)
            .build(),
          EventBuilder.new()
            .title('Work on Thursday')
            .singleDay('2025-07-03T12:00:00Z')
            .resource(work)
            .build(),
        ]}
      />,
    );

    // the inner ring holds the roots: engineering, work
    fireEvent.click(getChartItems(container, 'ring-0')[0]);

    expect(highlightOf('Design review')).to.equal('highlighted');
    expect(highlightOf('Work on Thursday')).to.equal('dimmed');
  });

  it('should follow the charts prop without remounting', async () => {
    const view = await renderSettled(<Calendar />);
    expect(screen.getByText('Events per day')).not.to.equal(null);

    view.setProps({ charts: { cards: ['byDay'], metric: 'hours' } });

    expect(screen.getByText('Hours per day')).not.to.equal(null);
    expect(screen.queryByText('Share by resource')).to.equal(null);
  });

  it('should show one column per week in the month view', async () => {
    await renderSettled(<Calendar view="month" />);

    expect(screen.getByText('Events per week')).not.to.equal(null);
  });

  it('should highlight the events of the agenda view', async () => {
    const { container } = await renderSettled(<Calendar view="agenda" />);

    fireEvent.click(slice(container, 0));

    expect(highlightOf('Work on Thursday')).to.equal('highlighted');
    expect(highlightOf('Health on Thursday')).to.equal('dimmed');
  });

  it('should use the locale text for the titles', async () => {
    await renderSettled(
      <Calendar
        localeText={{ chartsShareByResource: 'Reparto por recurso', chartsEventsPerDay: 'Eventos' }}
      />,
    );

    expect(screen.getByText('Reparto por recurso')).not.to.equal(null);
    expect(screen.getByText('Eventos')).not.to.equal(null);
  });
});
