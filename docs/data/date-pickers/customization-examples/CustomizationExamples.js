import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import BrandingProvider from 'docs/src/BrandingProvider';
import CustomizationPlayground from 'docsx/src/modules/components/CustomizationPlayground';
import { useCustomizationPlayground } from 'docsx/src/modules/utils/useCustomizationPlayground';
import CircularProgress from '@mui/material/CircularProgress';
import { examples, customizationLabels } from './examplesConfig';

export function useCodeLoader(selectedDemo, selectedCustomizationOption) {
  const [codeExample, setCodeExample] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchCodeSnippet = async () => {
      try {
        const module = await import(
          `./examples/${selectedDemo}/${examples[selectedDemo][selectedCustomizationOption]}`
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
  }, [selectedDemo, selectedCustomizationOption]);

  return { codeExample, error };
}

export default function CustomizationExamples() {
  const demoRef = React.useRef(null);

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
  } = useCustomizationPlayground({ examples, customizationLabels, demoRef });

  const { codeExample } = useCodeLoader(selectedDemo, selectedCustomizationOption);

  if (!examples) {
    return (
      <BrandingProvider>
        <CircularProgress />
      </BrandingProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CustomizationPlayground
        {...{
          examples,
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
        <StaticDatePicker />
      </CustomizationPlayground>
    </LocalizationProvider>
  );
}
