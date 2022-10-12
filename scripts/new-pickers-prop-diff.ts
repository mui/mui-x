import { promises as fs } from 'fs';
import path from 'path';
import kebabCase from 'lodash/kebabCase';
import capitalize from 'lodash/capitalize';

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
  let message = '';

  // eslint-disable-next-line no-restricted-syntax
  for (const pickerName of PICKERS) {
    const slug = kebabCase(pickerName);

    // eslint-disable-next-line no-await-in-loop
    const oldImplementationRaw = await fs.readFile(
      path.join(__dirname, ROOT, `${slug}.json`),
      'utf-8',
    );

    message += '<details>\n';

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
      const addedProps: string[] = [];
      propKeys.forEach((propKey) => {
        if (!newProps[propKey]) {
          if (EXPECTED_DIFF.includes(propKey)) {
            removedProps.push(propKey);
          } else {
            missingProps.push(propKey);
          }
        }

        // `label` is not added to the old picker json file, don't know why
        if (!oldProps[propKey] && propKey !== 'label') {
          addedProps.push(propKey);
        }
      });

      message += `<summary>${slug.split('-').map(capitalize).join(' ')} (${
        missingProps.length
      } missing, ${removedProps.length} removed, ${addedProps.length} added)</summary>\n`;

      if (missingProps.length > 0) {
        message += `\n#### Missing props:\n${missingProps.map((prop) => `- ${prop}`).join('\n')}\n`;
      }
      if (removedProps.length > 0) {
        message += `\n#### Removed props:\n${removedProps.map((prop) => `- ${prop}`).join('\n')}\n`;
      }
      if (addedProps.length > 0) {
        // eslint-disable-next-line no-console
        message += `\n#### Added props:\n${addedProps.map((prop) => `- ${prop}`).join('\n')}\n`;
      }
    } catch {
      message += `<summary>${slug.split('-').map(capitalize).join(' ')} (to do)</summary>\n`;
      message += 'Component not developped yet\n';
    }

    message += '</details>\n\n';
  }

  // eslint-disable-next-line no-console
  console.log(message);
};

main();
