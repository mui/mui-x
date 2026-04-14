import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesEventTimelinePremium } from './types.event-timeline-premium';

const allowedProps = ['apiRef', 'areEventsDraggable', 'areEventsResizable', 'canDragEventsFromTheOutside', 'canDropEventsToTheOutside', 'classes', 'dataSource', 'dateLocale', 'defaultPreferences', 'defaultView', 'defaultVisibleDate', 'defaultVisibleResources', 'displayTimezone', 'eventColor', 'eventModelStructure', 'events', 'localeText', 'onEventsChange', 'onPreferencesChange', 'onViewChange', 'onVisibleDateChange', 'onVisibleResourcesChange', 'preferences', 'readOnly', 'resourceColumnLabel', 'resourceModelStructure', 'resources', 'showCurrentTimeIndicator', 'sx', 'view', 'views', 'visibleDate', 'visibleResources'];

export default function Page() {
  return (
    <TypesPageShell name="EventTimelinePremium" allowedProps={allowedProps}>
      <TypesEventTimelinePremium />
    </TypesPageShell>
  );
}
