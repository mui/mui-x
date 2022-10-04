import { promises as fs } from 'fs';
import path from 'path';
import kebabCase from 'lodash/kebabCase';

const EXPECTED_DIFF = [
  // Mask props
  'mask',
  'disableMaskedInput',
  'acceptRegex',
  'rifmFormatter',

  // Props replaced by slot
  'renderInput',
  'InputAdornmentProps',
  'OpenPickerButtonProps',

  // Force usage of localeText
  'getOpenDialogAriaText',
];

const ROOT = '../docs/pages/x/api/date-pickers/';

const PICKERS = [
  'DatePicker',
  'DesktopDatePicker',
  'MobileDatePicker',
  'DateTimePicker',
  'DesktopDateTimePicker',
  'MobileDateTimePicker',
  'TimePicker',
  'DesktopTimePicker',
  'MobileTimePicker',
  'DateRangePicker',
  'DesktopDateRangePicker',
  'MobileDateRangePicker',
];

const main = async () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const pickerName of PICKERS) {
    const slug = kebabCase(pickerName);

    // eslint-disable-next-line no-await-in-loop
    const oldImplementationRaw = await fs.readFile(
      path.join(__dirname, ROOT, `${slug}.json`),
      'utf-8',
    );

    // eslint-disable-next-line no-console
    console.log(`${slug.replace(/-/g, ' ').toUpperCase()}: `);

    try {
      // eslint-disable-next-line no-await-in-loop
      const newImplementationRaw = await fs.readFile(
        path.join(__dirname, ROOT, `${slug}-2.json`),
        'utf-8',
      );

      const oldProps = JSON.parse(oldImplementationRaw).props;
      const newProps = JSON.parse(newImplementationRaw).props;

      // @ts-ignore
      const propKeys = [...new Set([...Object.keys(oldProps), ...Object.keys(newProps)])].sort();

      const missingProps: string[] = [];
      const removedProps: string[] = [];
      propKeys.forEach((propKey) => {
        if (!newProps[propKey]) {
          if (EXPECTED_DIFF.includes(propKey)) {
            removedProps.push(propKey);
          } else {
            missingProps.push(propKey);
          }
        }
      });

      if (missingProps.length > 0) {
        // eslint-disable-next-line no-console
        console.log(`\nMissing props:\n${missingProps.map((prop) => `- ${prop}`).join('\n')}`);
      }
      if (missingProps.length > 0) {
        // eslint-disable-next-line no-console
        console.log(`\nRemoved props:\n${removedProps.map((prop) => `- ${prop}`).join('\n')}`);
      }
    } catch {
      // eslint-disable-next-line no-console
      console.log('To do');
    }

    // eslint-disable-next-line no-console
    console.log('____');
  }
};

main();
