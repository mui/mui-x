import { createDateStrFromSections } from '@mui/x-date-pickers/DateField/DateField.utils';
import { DateRangeFieldInputSection } from './DateRangeField.interfaces';

export const getDateRangeStrFromSections = (
  sections: DateRangeFieldInputSection[],
  shouldRemoveSeparatorBetweenDates: boolean,
): [string, string] => {
  const startDateSections: DateRangeFieldInputSection[] = [];
  const endDateSections: DateRangeFieldInputSection[] = [];
  sections.forEach((section) => {
    if (section.dateName === 'start') {
      startDateSections.push(section);
    } else {
      endDateSections.push(section);
    }
  });

  if (shouldRemoveSeparatorBetweenDates) {
    startDateSections[startDateSections.length - 1].separator = null;
  }

  const startDateStr = createDateStrFromSections(startDateSections);
  const endDateStr = createDateStrFromSections(endDateSections);

  return [startDateStr, endDateStr];
};
