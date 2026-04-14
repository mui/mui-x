import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesEventCalendarPremium } from './types.event-calendar-premium';

const allowedProps = ['apiRef', 'areEventsDraggable', 'areEventsResizable', 'canDragEventsFromTheOutside', 'canDropEventsToTheOutside', 'classes', 'dataSource', 'dateLocale', 'defaultPreferences', 'defaultView', 'defaultVisibleDate', 'defaultVisibleResources', 'displayTimezone', 'eventColor', 'eventModelStructure', 'events', 'localeText', 'onEventsChange', 'onPreferencesChange', 'onViewChange', 'onVisibleDateChange', 'onVisibleResourcesChange', 'preferences', 'preferencesMenuConfig', 'readOnly', 'resourceModelStructure', 'resources', 'showCurrentTimeIndicator', 'sx', 'view', 'views', 'visibleDate', 'visibleResources'];

export default function Page() {
  return (
    <TypesPageShell name="EventCalendarPremium" allowedProps={allowedProps}>
      <TypesEventCalendarPremium />
    </TypesPageShell>
  );
}
