import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import BrandingProvider from 'docs/src/BrandingProvider';
import CustomizationPlayground from 'docsx/src/modules/components/CustomizationPlayground';
import CircularProgress from '@mui/material/CircularProgress';
import config from './examplesConfig';

const useCodeSnippets = (examples) => {
  const [codeSnippets, setCodeSnippets] = React.useState(null);

  React.useEffect(() => {
    const fetchCodeSnippets = async () => {
      const resolvedExamples = { ...examples };

      const promises = Object.entries(examples.examples).reduce(
        (acc, [componentName, componentExamples]) => {
          const examplePromises = Object.entries(componentExamples).map(
            async ([exampleName, codeSnippetPath]) => {
              const codeSnippetModule = await import(`${codeSnippetPath}.ts`);
              const codeSnippet = codeSnippetModule.default;
              return [exampleName, codeSnippet];
            },
          );

          return [
            ...acc,
            Promise.all(examplePromises).then((e) => [
              componentName,
              Object.fromEntries(e),
            ]),
          ];
        },
        [],
      );

      const resolvedPromises = await Promise.all(promises);
      resolvedPromises.forEach(([componentName, componentExamples]) => {
        resolvedExamples.examples[componentName] = componentExamples;
      });

      setCodeSnippets(resolvedExamples);
    };

    fetchCodeSnippets();
  }, [examples]);

  return codeSnippets;
};

export default function CustomizationExamples() {
  const customizationExamples = useCodeSnippets(config);

  if (!customizationExamples) {
    return (
      <BrandingProvider>
        <CircularProgress />
      </BrandingProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CustomizationPlayground config={customizationExamples}>
        <StaticDatePicker />
      </CustomizationPlayground>
    </LocalizationProvider>
  );
}
