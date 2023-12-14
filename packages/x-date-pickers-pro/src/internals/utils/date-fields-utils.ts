import { RangeFieldSection } from '../../models';

export const splitDateRangeSections = (sections: RangeFieldSection[]) => {
  const startDateSections: RangeFieldSection[] = [];
  const endDateSections: RangeFieldSection[] = [];
  sections.forEach((section) => {
    if (section.dateName === 'start') {
      startDateSections.push(section);
    } else {
      endDateSections.push(section);
    }
  });

  return { startDate: startDateSections, endDate: endDateSections };
};

export const removeLastSeparator = (dateSections: RangeFieldSection[]) =>
  dateSections.map((section, sectionIndex) => {
    if (sectionIndex === dateSections.length - 1) {
      return { ...section, separator: null };
    }

    return section;
  });
