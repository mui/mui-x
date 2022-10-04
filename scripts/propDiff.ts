import { promises as fs } from 'fs';
import path from 'path';

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

const PATH_OLD_IMPLEMENTATION = '../docs/pages/x/api/date-pickers/desktop-date-picker.json';
const PATH_NEW_IMPLEMENTATION = '../docs/pages/x/api/date-pickers/desktop-date-picker-2.json';

const main = async () => {
  const oldImplementationRaw = await fs.readFile(
    path.join(__dirname, PATH_OLD_IMPLEMENTATION),
    'utf-8',
  );
  const newImplementationRaw = await fs.readFile(
    path.join(__dirname, PATH_NEW_IMPLEMENTATION),
    'utf-8',
  );

  const oldProps = JSON.parse(oldImplementationRaw).props;
  const newProps = JSON.parse(newImplementationRaw).props;

  // @ts-ignore
  const propKeys = [...new Set([...Object.keys(oldProps), ...Object.keys(newProps)])].sort();

  propKeys.forEach((propKey) => {
    if (EXPECTED_DIFF.includes(propKey)) {
      return;
    }

    if (!newProps[propKey]) {
      console.log(`Missing prop: ${propKey}`);
    }
  });
};

main();
