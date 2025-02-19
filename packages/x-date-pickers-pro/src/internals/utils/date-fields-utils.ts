import { FieldRangeSection } from '@mui/x-date-pickers/internals';

export const splitDateRangeSections = (sections: FieldRangeSection[]) => {
  const startDateSections: FieldRangeSection[] = [];
  const endDateSections: FieldRangeSection[] = [];
  sections.forEach((section) => {
    if (section.dateName === 'start') {
      startDateSections.push(section);
    } else {
      endDateSections.push(section);
    }
  });

  return { startDate: startDateSections, endDate: endDateSections };
};

export const removeLastSeparator = (dateSections: FieldRangeSection[]) =>
  dateSections.map((section, sectionIndex) => {
    if (sectionIndex === dateSections.length - 1) {
      return { ...section, separator: null };
    }

    return section;
  });

export function getRangeFieldType(
  field: React.ElementType & { fieldType?: 'single-input' | 'multi-input' },
) {
  const fieldType = field.fieldType;
  if (!fieldType) {
    throw new Error(
      [
        'MUI X: The field component passed to a range picker must have a fieldType static property.',
        'If your field contains a single input for both the start and the end date, set it to "single-input": MyField.fieldType = "single-input"',
        'If your field contains one input for the start and another input for the end date, set it to "multi-input": MyField.fieldType = "multi-input"',
      ].join('\n'),
    );
  }

  return fieldType;
}
