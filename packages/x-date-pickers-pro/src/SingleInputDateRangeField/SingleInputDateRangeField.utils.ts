import { DateRangeFieldSection } from './SingleInputDateRangeField.interfaces';

export const splitDateRangeSections = (sections: DateRangeFieldSection[]) => {
  const startDateSections: DateRangeFieldSection[] = [];
  const endDateSections: DateRangeFieldSection[] = [];
  sections.forEach((section) => {
    if (section.dateName === 'start') {
      startDateSections.push(section);
    } else {
      endDateSections.push(section);
    }
  });

  return { startDate: startDateSections, endDate: endDateSections };
};
