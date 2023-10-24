import * as React from 'react';
import dayjs from 'dayjs';
import { useLocaleText, useUtils } from '@mui/x-date-pickers/internals';
import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FakeTextField } from '@mui/x-date-pickers/internals/components/FakeTextField';
import {
  addPositionPropertiesToSections,
  splitFormatIntoSections,
} from '@mui/x-date-pickers/internals/hooks/useField';

const date = dayjs('2022-04-17');
const timezone = 'default';
const format = 'MM-DD-YYYY';
const formatDensity = 'spacious';
const shouldRespectLeadingZeros = false;
const isRTL = false;

function AppContent() {
  const utils = useUtils();
  const localeText = useLocaleText();
  const ref = React.useRef(null);

  const sections = React.useMemo(
    () =>
      addPositionPropertiesToSections(
        splitFormatIntoSections(
          utils,
          timezone,
          localeText,
          format,
          date,
          formatDensity,
          shouldRespectLeadingZeros,
          isRTL,
        ),
        isRTL,
      ),
    [utils, localeText],
  );

  // simulating behavior; TODO: Delete
  const elements = React.useMemo(
    () =>
      sections.map((section, sectionIndex) => ({
        container: {
          'data-sectionindex': sectionIndex,
          onClick: () => {},
        } as React.HTMLAttributes<HTMLSpanElement>,
        content: {
          // Could we include this for the content?
          value: null,
          placeholder: section.placeholder,
          className: 'content',
          role: 'textbox',
          children: section.value || section.placeholder,
          inputMode: section.contentType === 'letter' ? 'text' : 'numeric',
          suppressContentEditableWarning: true,
          style: {
            outline: 'none',
          },
        },
        before: {
          className: 'before',
          children: section.startSeparator,
          style: { whiteSpace: 'pre' },
        },
        after: {
          className: 'after',
          children: section.endSeparator,
          style: { whiteSpace: 'pre' },
        },
      })),
    [sections],
  );

  return (
    <FakeTextField
      elements={elements}
      size="small"
      error
      // disabled
      color="secondary"
      {...{ ref }}
    />
  );
}

export default function FakeTextFieldWrapper() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AppContent />
      <TextField error label="test" value="04-17-2022" size="small" />
    </LocalizationProvider>
  );
}
