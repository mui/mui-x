import * as ts from 'typescript';
import path from 'path';
import kebabCase from 'lodash/kebabCase';
import capitalize from 'lodash/capitalize';
import { createProject, workspaceRoot } from '../docs/scripts/getTypeScriptProjects';

const EXPECTED_DIFF = {
  mask: 'no more mask input',
  disableMaskedInput: 'no more mask input',
  acceptRegex: 'no more mask input',
  rifmFormatter: 'no more mask input',
  ignoreInvalidInputs: 'no more mask input',

  renderInput: 'replaced by `components.Field` and `components.Input`',
  InputAdornmentProps: 'replaced by `componentsProps.InputAdornment`',
  OpenPickerButtonProps: 'replaced by `componentsProps.OpenPickerButton`',
  InputProps: 'replaced by `componentsProps.input.InputProps`',

  getOpenDialogAriaText: 'replaced by each picker translation key',
};

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
    const oldComponentPropsSymbol = project.exports[`${pickerName}Props`];
    const newComponentPropsSymbol = project.exports[`${pickerName}2Props`];

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
          if (EXPECTED_DIFF[propKey]) {
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
          .map((propKey) => `- \`${propKey}\` (${EXPECTED_DIFF[propKey]})`)
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
