import * as React from 'react';
import pick from 'lodash/pick';
import { blue, pink } from '@mui/material/colors';
import { BoxProps } from '@mui/material/Box';
import { createTheme, ThemeProvider, styled, useTheme, Theme } from '@mui/material/styles';

export type CustomizationLabelType = {
  [k in 'customTheme' | 'styledComponents' | 'sxProp']: string;
};

type CustomizationItemType = {
  type: 'warning' | 'success' | 'info';
  comments?: string;
  componentProps?: any;
  parentSlot?: string;
  parentComponent?: string;
  current?: boolean;
};
export type CustomizationItemsType = Partial<{
  [k in keyof CustomizationLabelType]: CustomizationItemType;
}>;

export type PickersSubcomponentType = {
  [k: string]: {
    examples: CustomizationItemsType;
    slots: string[];
    moreInformation?: React.ReactElement | string;
  };
};

export interface UseCustomizationPlaygroundProps {
  examples: PickersSubcomponentType;
  children?: React.ReactElement | React.ReactElement[];
  componentName: string;
}
export const customizationLabels: CustomizationLabelType = {
  customTheme: 'Custom theme',
  styledComponents: 'Styled components',
  sxProp: 'sx prop',
};

export const DEFAULT_COLORS = { pink, blue };
export type ColorKey = keyof typeof DEFAULT_COLORS;

export type StyleTokensType = {
  color: ColorKey;
  borderRadius: number;
  borderWidth: number;
};
const styleTokens: StyleTokensType = {
  color: 'blue',
  borderRadius: 2,
  borderWidth: 1,
};
export type HandleTokenChangeType = (
  token: keyof Partial<typeof styleTokens>,
  value: string | keyof typeof DEFAULT_COLORS | number,
) => void;

export type UseCustomizationPlaygroundReturnType = {
  selectedDemo: string | null;
  customizationOptions: Partial<CustomizationLabelType> | null;
  selectedCustomizationOption: keyof CustomizationLabelType | null;
  selectDemo: (interactionTarget: string | null) => void;
  setSelectedCustomizationOption: (
    customizationOption: keyof CustomizationLabelType | null,
  ) => void;
  selectedSlot: string | null;
  setSelectedSlot: (slot: string | null) => void;
  codeExample: string | null;
  availableSlots: string[] | null;
  handleTokenChange: HandleTokenChangeType;
  selectedTokens: StyleTokensType;
  selectedExample?: CustomizationItemType | null;
  moreInformation?: React.ReactElement | string | null;
};

export function withStyles(
  Component: React.ElementType,
  selectedTokens: StyleTokensType,
  selectedCustomizationOption: string | null,
  selectedDemo: string | null,
  selectedSlot: string | null,
) {
  return function StyledChild<T extends BoxProps>(props: T) {
    const defaultTheme = useTheme();

    const tokens = {
      borderRadius: `${selectedTokens.borderRadius}px`,
      borderColor: DEFAULT_COLORS[selectedTokens.color][500],
      border: `${selectedTokens.borderWidth}px solid`,
      backgroundColor:
        defaultTheme.palette.mode === 'light'
          ? DEFAULT_COLORS[selectedTokens.color][200]
          : DEFAULT_COLORS[selectedTokens.color][900],
      color:
        defaultTheme.palette.mode === 'light'
          ? DEFAULT_COLORS[selectedTokens.color][800]
          : DEFAULT_COLORS[selectedTokens.color][100],
    };

    if (selectedCustomizationOption === 'sxProp') {
      const sxProp = {
        [`.Mui${selectedDemo}-${selectedSlot}`]: { ...tokens },
      };

      return <Component {...props} sx={{ ...sxProp, ...props?.sx }} />;
    }

    if (selectedCustomizationOption === 'customTheme') {
      const newTheme = (theme: Theme) =>
        createTheme({
          ...theme,
          components: {
            [`Mui${selectedDemo}`]: { styleOverrides: { [selectedSlot as string]: { ...tokens } } },
          },
        });
      return (
        <ThemeProvider theme={newTheme}>
          <Component {...props} />
        </ThemeProvider>
      );
    }

    if (selectedCustomizationOption === 'styledComponents') {
      const StyledComponent = styled(Component as React.JSXElementConstructor<any>)(() => ({
        [`.Mui${selectedDemo}-${selectedSlot}`]: { ...tokens },
      }));
      return <StyledComponent {...props} />;
    }
    return <Component {...props} />;
  };
}

interface Props
  extends Pick<
      UseCustomizationPlaygroundReturnType,
      'selectedDemo' | 'selectedSlot' | 'selectedCustomizationOption' | 'selectedTokens'
    >,
    Pick<UseCustomizationPlaygroundProps, 'componentName'> {
  theme: Theme;
  examples: CustomizationItemType;
  selectedExample: CustomizationItemType | null;
}

/* I use this method to parse whatever component props are passed in and format them for the code example, 
so the code example includes the same props as the rendered component. e.g. the views={['month']} */
function formatComponentProps(componentProps?: Object, spacing: number = 1) {
  function formatObject(obj: Object, indentLevel = 0, separator = ': '): string {
    const indent = ' '.repeat(indentLevel * 2);

    return (Object.keys(obj) as Array<keyof typeof obj>)
      .map((key) => {
        const getValue = (val: any) => {
          if (typeof val === 'string' && !val.includes('Styled')) {
            return `'${val}'`;
          }
          if (separator === '=' && typeof val !== 'object') {
            return `{${val}}`;
          }
          return val;
        };

        const value = obj[key];
        if (typeof value === 'object' && !Array.isArray(value)) {
          return `${indent}${key}${separator}${separator === '=' ? '{' : ''}{\n${formatObject(
            getValue(value),
            indentLevel + 1,
            ': ',
          )}\n${indent}${separator === '=' ? '}' : ''}}`;
        }

        if (Array.isArray(value)) {
          return `${indent}${key}${separator}${separator === '=' ? '{' : ''}[${value.map((val) =>
            getValue(val),
          )}]${separator === '=' ? '}' : ''}`;
        }

        return `${indent}${key}${separator}${getValue(value)},`;
      })
      .join('\n');
  }

  if (!componentProps) {
    return '';
  }

  return `\n${formatObject(componentProps, spacing, '=')} `;
}

const getCodeExample = ({
  selectedDemo,
  selectedSlot,
  selectedCustomizationOption,
  selectedTokens,
  componentName,
  examples,
  selectedExample,
  theme,
}: Props) => {
  const tokens = {
    ...selectedTokens,
    borderRadius: `${selectedTokens.borderRadius}px`,
    borderWidth: `${selectedTokens.borderWidth}px`,
    borderColor: DEFAULT_COLORS[selectedTokens.color][500],
    border: `${selectedTokens.borderWidth}px solid`,
    backgroundColor:
      theme.palette.mode === 'light'
        ? DEFAULT_COLORS[selectedTokens.color][200]
        : DEFAULT_COLORS[selectedTokens.color][900],
    color:
      theme.palette.mode === 'light'
        ? DEFAULT_COLORS[selectedTokens.color][800]
        : DEFAULT_COLORS[selectedTokens.color][100],
  };

  const getTokensString = (indent: number = 0): string => {
    const spaces = ' '.repeat(indent * 2);
    return (Object.keys(tokens) as Array<keyof typeof tokens>).reduce((acc, key) => {
      return `${acc}\n${spaces}${key}: ${
        typeof tokens[key] === 'string' ? `'${tokens[key]}'` : tokens[key]
      },`;
    }, '');
  };

  const splitStringWithoutWordBreak = (inputString: string, maxLineLength: number): string[] => {
    let lines: string[] = [];
    let startIndex = 0;

    while (startIndex < inputString.length) {
      let endIndex = startIndex + maxLineLength;

      if (endIndex < inputString.length) {
        while (endIndex > startIndex && inputString[endIndex] !== ' ') {
          endIndex -= 1;
        }

        if (endIndex === startIndex) {
          endIndex = startIndex + maxLineLength;
        }
      }

      lines = [...lines, inputString.substring(startIndex, endIndex).trim()];

      startIndex = endIndex;
    }

    return lines;
  };

  let code;
  if (examples?.comments) {
    const lines = splitStringWithoutWordBreak(examples.comments, 90);
    code = `\n/* ${lines.join('\n')} */`;
  } else {
    code = '';
  }

  if (selectedCustomizationOption === 'sxProp') {
    if (selectedExample?.parentSlot) {
      const componentProps = {
        ...examples.componentProps,
        slotProps: {
          ...examples.componentProps?.slotProps,
          [selectedExample?.parentSlot]: {
            sx: selectedExample?.parentSlot
              ? tokens
              : { [`'.Mui${selectedDemo}-${selectedSlot}'`]: tokens },
          },
        },
      };
      code = `${code}\n<${componentName}${formatComponentProps(componentProps, 1)}
/>`;
    } else {
      code = `${code}\n<${componentName}${formatComponentProps(examples.componentProps, 1)}
  sx={{
    '.Mui${selectedDemo}-${selectedSlot}': {${getTokensString(3)}
    },
  }}
/>`;
    }
  } else if (selectedCustomizationOption === 'customTheme') {
    code = `import { createTheme } from '@mui/material/styles'\n${code}
const newTheme = (theme) => createTheme({
  ...theme,
  components: {
    Mui${selectedDemo}: {
      styleOverrides: {
        ${selectedSlot}: {${getTokensString(5)}
        }
      }
    }
  }
})
<ThemeProvider theme={newTheme}>
  <${componentName}${formatComponentProps(examples.componentProps, 2)} />
</ThemeProvider>`;
  } else if (selectedCustomizationOption === 'styledComponents') {
    if (selectedExample?.parentSlot && selectedExample?.parentComponent) {
      const componentProps = {
        ...examples.componentProps,
        slots: {
          ...examples.componentProps?.slots,
          [selectedExample?.parentSlot]: `Styled${selectedExample?.parentComponent}`,
        },
      };
      const example = selectedExample?.current
        ? getTokensString(1)
        : `
  '.Mui${selectedDemo}-${selectedSlot}': {${getTokensString(2)}
  }`;

      return `import { styled } from '@mui/material/styles'\n${code}
const Styled${selectedExample?.parentComponent} = styled(${
        selectedExample?.parentComponent
      })({${example}
})

export default function StyledPickerContainer() {
  return (
    <${componentName} ${formatComponentProps(componentProps, 3)}
    />
  );
}`;
    }
    return `import { styled } from '@mui/material/styles'\n${code}
const Styled${componentName} = styled(${componentName})({
  '.Mui${selectedDemo}-${selectedSlot}': {${getTokensString(2)}
  }
})

export default function StyledPickerContainer() {
  return (
    <Styled${componentName} ${formatComponentProps(examples.componentProps, 3)}/>
  );
}`;
  }

  return code;
};

export function useCustomizationPlayground({
  examples,
  componentName,
}: UseCustomizationPlaygroundProps): UseCustomizationPlaygroundReturnType {
  const theme = useTheme();

  const [selectedDemo, setSelectedDemo] = React.useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);
  const [customizationOptions, setCustomizationOptions] =
    React.useState<Partial<CustomizationLabelType> | null>(null);
  const [selectedCustomizationOption, setSelectedCustomizationOption] = React.useState<
    keyof CustomizationLabelType | null
  >(null);

  const [codeExample, setCodeExample] = React.useState<string | null>(null);

  const [selectedTokens, setSelectedTokens] = React.useState<StyleTokensType>(styleTokens);

  React.useEffect(() => {
    setSelectedDemo(Object.keys(examples)[0]);
  }, [examples]);

  const setOptions = React.useCallback(
    (demo: string) => {
      const slot = examples[demo].slots.length ? examples[demo].slots[0] : 'root';
      const customizationExamples = Object.keys(examples[demo].examples) as Array<
        keyof CustomizationLabelType
      >;
      // set the array of customization options to the available options for the selected subcomponent
      setCustomizationOptions(pick(customizationLabels, customizationExamples));
      // set the selected customization option to the first available option for the selected subcomponent
      if (
        !selectedCustomizationOption ||
        !customizationExamples.includes(selectedCustomizationOption)
      ) {
        setSelectedCustomizationOption(customizationExamples[0]);
      }
      setSelectedSlot(slot);
    },
    [examples, setSelectedCustomizationOption, setSelectedSlot, selectedCustomizationOption],
  );

  React.useEffect(() => {
    if (selectedDemo && examples && examples[selectedDemo]) {
      setOptions(selectedDemo);
    }
  }, [selectedDemo, setOptions, examples]);

  React.useEffect(() => {
    if (selectedDemo && selectedCustomizationOption && examples[selectedDemo]) {
      const code = getCodeExample({
        selectedDemo,
        selectedSlot,
        selectedCustomizationOption,
        selectedTokens,
        componentName,
        examples: examples[selectedDemo].examples[
          selectedCustomizationOption
        ] as CustomizationItemType,
        selectedExample:
          selectedDemo && selectedCustomizationOption
            ? (examples[selectedDemo]?.examples[
                selectedCustomizationOption
              ] as CustomizationItemType)
            : null,
        theme,
      });
      if (code) {
        setCodeExample(code);
      }
    }
  }, [
    selectedDemo,
    examples,
    selectedTokens,
    theme,
    selectedSlot,
    selectedCustomizationOption,
    componentName,
  ]);

  const selectDemo = (interactionTarget: string | null) => {
    setSelectedDemo(interactionTarget);
  };

  const handleTokenChange = (
    token: keyof typeof styleTokens,
    value: string | keyof typeof DEFAULT_COLORS | number,
  ) => {
    setSelectedTokens((prev: StyleTokensType) => ({ ...prev, [token]: value }));
  };

  return {
    selectedDemo,
    customizationOptions,
    selectedCustomizationOption,
    selectDemo,
    setSelectedCustomizationOption,
    selectedSlot,
    setSelectedSlot,
    codeExample,
    availableSlots:
      selectedDemo && examples[selectedDemo] ? examples[selectedDemo].slots : ['root'],
    handleTokenChange,
    selectedTokens,
    selectedExample:
      selectedDemo && selectedCustomizationOption
        ? examples[selectedDemo]?.examples[selectedCustomizationOption]
        : null,
    moreInformation: selectedDemo && examples[selectedDemo]?.moreInformation,
  };
}
