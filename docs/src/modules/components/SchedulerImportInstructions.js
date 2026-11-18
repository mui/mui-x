import SchedulerPlanCode from './SchedulerPlanCode';

const getCode = (licenceType, componentPackage) => {
  const component = licenceType === 'Premium' ? 'EventCalendarPremium' : 'EventCalendar';
  const subpath = licenceType === 'Premium' ? 'event-calendar-premium' : 'event-calendar';

  return [
    `import { ${component} } from '${componentPackage}/${subpath}';`,
    `import type { SchedulerEvent } from '${componentPackage}/models';`,
  ].join('\n');
};

export default function SchedulerImportInstructions() {
  return <SchedulerPlanCode getCode={getCode} />;
}
