import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import BrandingProvider from 'docs/src/BrandingProvider';
import CustomizationPlayground from 'docsx/src/modules/components/CustomizationPlayground';
import { useCustomizationPlayground } from 'docsx/src/modules/utils/useCustomizationPlayground';
import CircularProgress from '@mui/material/CircularProgress';
import { pickerExamples, customizationLabels } from './examplesConfig';

export function useCodeLoader(selectedDemo, selectedCustomizationOption, examples) {
  const [codeExample, setCodeExample] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchCodeSnippet = async () => {
      try {
        const module = await import(
          `./examples/${selectedDemo}/${examples[selectedDemo][selectedCustomizationOption].code}`
        );

        const code = module.default;
        setCodeExample(code);
      } catch (e) {
        setError(e);
        console.error(e);
      }
    };

    if (
      selectedDemo &&
      selectedCustomizationOption &&
      examples[selectedDemo] &&
      examples[selectedDemo][selectedCustomizationOption]
    ) {
      fetchCodeSnippet();
    } else {
      setCodeExample(null);
    }
  }, [selectedDemo, selectedCustomizationOption, examples]);

  return { codeExample, error };
}

export default function CustomizationExamples() {
  const demoRef = React.useRef(null);
  const [selectedPicker, setSelectedPicker] = React.useState(0);

  const {
    selectedDemo,
    hoveredDemo,
    customizationOptions,
    selectedCustomizationOption,
    handleDemoClick,
    handleDemoHover,
    selectDemo,
    setHoveredDemo,
    setSelectedCustomizationOption,
  } = useCustomizationPlayground({
    examples: pickerExamples[selectedPicker].examples,
    customizationLabels,
    demoRef,
  });

  const { codeExample } = useCodeLoader(
    selectedDemo,
    selectedCustomizationOption,
    pickerExamples[selectedPicker].examples,
  );

  const handleSelectedPickerChange = (_e, newValue) => {
    setSelectedPicker(newValue);
    selectDemo(null);
  };

  if (!pickerExamples[selectedPicker].examples) {
    return (
      <BrandingProvider>
        <CircularProgress />
      </BrandingProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ mb: 2, width: '100%' }}>
        <BrandingProvider>
          <ToggleButtonGroup
            value={selectedPicker}
            exclusive
            onChange={handleSelectedPickerChange}
            aria-label="date picker components"
          >
            {pickerExamples.map(({ name }, index) => (
              <ToggleButton value={index} aria-label={name} key={name}>
                {name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </BrandingProvider>
        <CustomizationPlayground
          {...{
            examples: pickerExamples[selectedPicker].examples,
            customizationLabels,
            selectedDemo,
            hoveredDemo,
            customizationOptions,
            selectedCustomizationOption,
            handleDemoClick,
            handleDemoHover,
            selectDemo,
            setHoveredDemo,
            setSelectedCustomizationOption,
            codeExample,
          }}
          ref={demoRef}
        >
          {pickerExamples.map(
            (example, index) =>
              String(index) === String(selectedPicker) && (
                <example.component key={index} {...example?.componentProps} />
              ),
          )}
        </CustomizationPlayground>
      </Stack>
    </LocalizationProvider>
  );
}
