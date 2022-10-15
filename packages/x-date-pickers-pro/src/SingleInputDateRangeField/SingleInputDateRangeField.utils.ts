import { DateRangeFieldSection } from '../internal/models';

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

export const removeLastSeparator = (dateSections: DateRangeFieldSection[]) =>
  dateSections.map((section, sectionIndex) => {
    if (sectionIndex === dateSections.length - 1) {
      return { ...section, separator: null };
    }

    return section;
  });
