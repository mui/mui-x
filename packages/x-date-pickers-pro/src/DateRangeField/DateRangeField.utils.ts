import { DateRangeFieldInputSection } from './DateRangeField.interfaces';

export const splitDateRangeSections = (sections: DateRangeFieldInputSection[]) => {
  const startDateSections: DateRangeFieldInputSection[] = [];
  const endDateSections: DateRangeFieldInputSection[] = [];
  sections.forEach((section) => {
    if (section.dateName === 'start') {
      startDateSections.push(section);
    } else {
      endDateSections.push(section);
    }
  });

  return { startDate: startDateSections, endDate: endDateSections };
};
