import * as ts from 'typescript';
import path from 'path';
import kebabCase from 'lodash/kebabCase';
import capitalize from 'lodash/capitalize';
import { createProject, workspaceRoot } from '../docs/scripts/getTypeScriptProjects';

const EXPECTED_DIFF: { [propKey: string]: string | ((pickerName: string) => string | undefined) } =
  {
    mask: 'no more mask input',
    disableMaskedInput: 'no more mask input',
    acceptRegex: 'no more mask input',
    rifmFormatter: 'no more mask input',
    ignoreInvalidInputs: 'no more mask input',

    renderInput: (pickerName) =>
      pickerName.includes('Static')
        ? 'no more keyboard editing on the static pickers'
        : 'replaced by `components.Field` and `components.Input`',
    InputAdornmentProps: (pickerName) =>
      pickerName.includes('Mobile') || pickerName.includes('Static')
        ? 'never used even in v5'
        : 'replaced by `componentsProps.InputAdornment`',
    OpenPickerButtonProps: (pickerName) =>
      pickerName.includes('Mobile') || pickerName.includes('Static')
        ? 'never used even in v5'
        : 'replaced by `componentsProps.OpenPickerButton`',
    InputProps: (pickerName) =>
      pickerName.includes('Static')
        ? 'no more keyboard editing on the static pickers'
        : 'replaced by `componentsProps.input.InputProps`',

    getOpenDialogAriaText: (pickerName) =>
      pickerName.includes('Static')
        ? 'never used even in v5'
        : 'replaced by each picker translation key',

    dateRangeIcon: 'replaced by `componentsProps.tabs.dateRangeIcon`',
    timeIcon: 'replaced by `componentsProps.tabs.timeIcon`',

    children: 'never used even in v5',
    inputRef: (pickerName) => (pickerName.includes('Range') ? 'never used even in v5' : undefined),
    label: (pickerName) => (pickerName.includes('Range') ? 'never used even in v5' : undefined),
    closeOnSelect: (pickerName) =>
      pickerName.includes('Static') ? 'never used even in v5' : undefined,
    onViewChange: (pickerName) =>
      pickerName.includes('Range') ? 'never used even in v5' : undefined,
    'components.OpenPickerIcon': (pickerName) =>
      pickerName.includes('Range') || pickerName.includes('Mobile') || pickerName.includes('Static')
        ? 'never used even in v5'
        : undefined,

    shouldDisableMonth: (pickerName) =>
      pickerName.includes('Range') ? 'never used even in v5' : undefined,
    shouldDisableYear: (pickerName) =>
      pickerName.includes('Range') ? 'never used even in v5' : undefined,
  };

const getExpectedDiffMessage = (pickerName: string, propKey: string) => {
  const message = EXPECTED_DIFF[propKey];

  if (typeof message === 'function') {
    return message(pickerName);
  }

  return message;
};

const PICKERS = [
  'DatePicker',
  'DesktopDatePicker',
  'MobileDatePicker',
  'StaticDatePicker',
  'DateTimePicker',
  'DesktopDateTimePicker',
  'MobileDateTimePicker',
  'StaticDateTimePicker',
  'TimePicker',
  'DesktopTimePicker',
  'MobileTimePicker',
  'StaticTimePicker',
  'DateRangePicker',
  'DesktopDateRangePicker',
  'MobileDateRangePicker',
  'StaticDateRangePicker',
];

const main = async () => {
  let message = '';

  const project = createProject({
    name: 'x-date-pickers-pro',
    rootPath: path.join(workspaceRoot, 'packages/x-date-pickers-pro'),
    documentationFolderName: 'date-pickers',
    getComponentsWithPropTypes: () => [],
    getComponentsWithApiDoc: () => [],
  });

  const getPropsLookup = (symbol: ts.Symbol) => {
    const properties = project.checker.getDeclaredTypeOfSymbol(symbol).getProperties();
    const props = {};

    const getSubProperties = (property: ts.Symbol) => {
      const declaration = property.declarations?.[0];
      if (declaration && ts.isPropertySignature(declaration) && declaration.type) {
        const slots = project.checker.getTypeFromTypeNode(declaration.type).getProperties();
        slots.forEach((slot) => {
          props[`${property.escapedName!}.${slot.escapedName!}`] = true;
        });
      }
    };

    properties.forEach((property) => {
      props[property.escapedName!] = true;

      if (property.escapedName === 'components') {
        getSubProperties(property);
      }

      if (property.escapedName === 'componentsProps') {
        getSubProperties(property);
      }
    });

    return props;
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const pickerName of PICKERS) {
    const slug = kebabCase(pickerName);

    // eslint-disable-next-line no-nested-ternary
    const newPickerName = pickerName.includes('Mobile')
      ? `MobileNext${pickerName.replace('Mobile', '')}`
      : // eslint-disable-next-line no-nested-ternary
      pickerName.includes('Desktop')
      ? `DesktopNext${pickerName.replace('Desktop', '')}`
      : pickerName.includes('Static')
      ? `StaticNext${pickerName.replace('Static', '')}`
      : `Next${pickerName}`;

    const oldComponentPropsSymbol = project.exports[`${pickerName}Props`];
    const newComponentPropsSymbol = project.exports[`${newPickerName}Props`];

    message += '<details>\n';

    if (!newComponentPropsSymbol) {
      message += `<summary>${slug.split('-').map(capitalize).join(' ')} (to do)</summary>\n`;
      message += 'Component not developped yet\n';
    } else {
      const oldComponentProps = getPropsLookup(oldComponentPropsSymbol);
      const newComponentProps = getPropsLookup(newComponentPropsSymbol);

      const propKeys = [
        // @ts-ignore
        ...new Set([...Object.keys(oldComponentProps), ...Object.keys(newComponentProps)]),
      ].sort();

      const missingProps: string[] = [];
      const removedProps: string[] = [];
      const addedProps: string[] = [];
      propKeys.forEach((propKey) => {
        if (!newComponentProps[propKey]) {
          if (getExpectedDiffMessage(pickerName, propKey)) {
            removedProps.push(propKey);
          } else {
            missingProps.push(propKey);
          }
        }

        if (!oldComponentProps[propKey]) {
          addedProps.push(propKey);
        }
      });

      message += `<summary>${slug.split('-').map(capitalize).join(' ')} (${
        missingProps.length
      } missing, ${removedProps.length} removed, ${addedProps.length} added)</summary>\n`;

      if (missingProps.length > 0) {
        message += `\n#### Missing props:\n${missingProps
          .map((propKey) => `- \`${propKey}\``)
          .join('\n')}\n`;
      }
      if (removedProps.length > 0) {
        message += `\n#### Removed props:\n${removedProps
          .map((propKey) => `- \`${propKey}\` (${getExpectedDiffMessage(pickerName, propKey)})`)
          .join('\n')}\n`;
      }
      if (addedProps.length > 0) {
        message += `\n#### Added props:\n${addedProps
          .map((propKey) => `- \`${propKey}\``)
          .join('\n')}\n`;
      }
    }

    message += '</details>\n\n';
  }

  // eslint-disable-next-line no-console
  console.log(message);
};

main();
