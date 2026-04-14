import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesStandaloneDayView } from './types.standalone-day-view';

const allowedProps = ['areEventsDraggable', 'areEventsResizable', 'canDragEventsFromTheOutside', 'canDropEventsToTheOutside', 'dataSource', 'dateLocale', 'defaultPreferences', 'defaultView', 'defaultVisibleDate', 'defaultVisibleResources', 'displayTimezone', 'eventColor', 'eventModelStructure', 'events', 'onEventsChange', 'onPreferencesChange', 'onViewChange', 'onVisibleDateChange', 'onVisibleResourcesChange', 'preferences', 'preferencesMenuConfig', 'readOnly', 'resourceModelStructure', 'resources', 'showCurrentTimeIndicator', 'sx', 'view', 'views', 'visibleDate', 'visibleResources'];

export default function Page() {
  return (
    <TypesPageShell name="StandaloneDayView" allowedProps={allowedProps}>
      <TypesStandaloneDayView />
    </TypesPageShell>
  );
}
