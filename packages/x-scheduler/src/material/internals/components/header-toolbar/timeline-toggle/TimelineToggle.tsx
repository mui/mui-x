import * as React from 'react';
import { ChartGantt, CalendarDays } from 'lucide-react';
import { Toggle } from '@base-ui-components/react/toggle';
import { ToggleGroup } from '@base-ui-components/react/toggle-group';
import { useStore } from '@base-ui-components/utils/store';
import { useTranslations } from '../../../utils/TranslationsContext';
import { useEventCalendarContext } from '../../../hooks/useEventCalendarContext';
import { selectors } from '../../../../../primitives/use-event-calendar';
import { Tooltip } from '../../tooltip';

export function TimelineToggle() {
  const translations = useTranslations();
  const { store, instance } = useEventCalendarContext();
  const view = useStore(store, selectors.view);
  const views = useStore(store, selectors.views);
  const viewsWithoutTimeline = views.filter((view) => view !== 'timeline');

  const layoutMode = view === 'timeline' ? 'timeline' : 'calendar';

  const handleToggleChange = (value: ('calendar' | 'timeline')[], event: Event) => {
    if (value[0] !== 'timeline') {
      const newView = viewsWithoutTimeline[0];
      instance.setView(newView, event);
    } else {
      instance.setView('timeline', event);
    }
  };

  return (
    <ToggleGroup value={[layoutMode]} className="TogglePanel" onValueChange={handleToggleChange}>
      <Tooltip message={translations.calendarMode}>
        <Toggle aria-label="Calendar" value="calendar" className="MainItem">
          <CalendarDays strokeWidth={1.5} size={20} />
        </Toggle>
      </Tooltip>
      <Tooltip message={translations.timelineMode}>
        <Toggle aria-label="Timeline" value="timeline" className="MainItem">
          <ChartGantt strokeWidth={1.5} size={20} />
        </Toggle>
      </Tooltip>
    </ToggleGroup>
  );
}
