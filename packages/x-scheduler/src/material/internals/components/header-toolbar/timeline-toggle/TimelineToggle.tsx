import * as React from 'react';
import { ChartGantt, CalendarDays } from 'lucide-react';
import { Toggle } from '@base-ui-components/react/toggle';
import { ToggleGroup } from '@base-ui-components/react/toggle-group';
import { useTranslations } from '../../../utils/TranslationsContext';
import { Tooltip } from '../../tooltip';

export function TimelineToggle() {
  const translations = useTranslations();

  return (
    <ToggleGroup defaultValue={['calendar']} className="TogglePanel">
      <Tooltip message={translations.calendarView}>
        <Toggle aria-label="Calendar" value="calendar" className="MainItem">
          <CalendarDays strokeWidth={1.5} size={20} />
        </Toggle>
      </Tooltip>
      <Tooltip message={translations.timelineView}>
        <Toggle aria-label="Timeline" value="timeline" className="MainItem">
          <ChartGantt strokeWidth={1.5} size={20} />
        </Toggle>
      </Tooltip>
    </ToggleGroup>
  );
}
