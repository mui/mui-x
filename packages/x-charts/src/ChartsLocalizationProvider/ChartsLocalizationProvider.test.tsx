import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { createRenderer } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useChartsLocalization } from '@mui/x-charts/hooks';
import { ChartsLocalizationProvider } from '@mui/x-charts/ChartsLocalizationProvider';
import { ChartsLocaleText } from '@mui/x-charts/locales';

function ContextListener({
  onContextChange,
}: {
  onContextChange: (context: ReturnType<typeof useChartsLocalization>) => void;
}) {
  const context = useChartsLocalization();

  React.useEffect(() => {
    onContextChange(context);
  }, [onContextChange, context]);

  return null;
}

describe('<ChartsLocalizationProvider />', () => {
  const { render } = createRenderer();

  it('should respect localeText from the theme', () => {
    const handleContextChange = spy();

    const theme = createTheme({
      components: {
        MuiChartsLocalizationProvider: {
          defaultProps: {
            localeText: { noData: 'Pas de data' },
          },
        },
      },
    });

    render(
      <ThemeProvider theme={theme}>
        <ChartsLocalizationProvider>
          <ContextListener onContextChange={handleContextChange} />
        </ChartsLocalizationProvider>
      </ThemeProvider>,
    );

    const localeText: ChartsLocaleText = handleContextChange.lastCall.args[0].localeText;
    expect(localeText.noData).to.equal('Pas de data');
    expect(localeText.loading).to.equal('Loading data…');
  });

  it('should prioritize localeText key passed on LocalizationProvider compared to key passed from the theme', () => {
    const handleContextChange = spy();

    const theme = createTheme({
      components: {
        MuiChartsLocalizationProvider: {
          defaultProps: {
            localeText: { noData: 'Not priotized' },
          },
        },
      },
    });

    render(
      <ThemeProvider theme={theme}>
        <ChartsLocalizationProvider localeText={{ noData: 'Prioritized' }}>
          <ContextListener onContextChange={handleContextChange} />
        </ChartsLocalizationProvider>
      </ThemeProvider>,
    );

    const localeText: ChartsLocaleText = handleContextChange.lastCall.args[0].localeText;
    expect(localeText.noData).to.equal('Prioritized');
  });

  it('should prioritize deepest LocalizationProvider when using nested ones', () => {
    const handleContextChange = spy();

    render(
      <ChartsLocalizationProvider localeText={{ noData: 'Not Prioritized' }}>
        <ChartsLocalizationProvider localeText={{ noData: 'Prioritized' }}>
          <ContextListener onContextChange={handleContextChange} />
        </ChartsLocalizationProvider>
      </ChartsLocalizationProvider>,
    );

    const localeText: ChartsLocaleText = handleContextChange.lastCall.args[0].localeText;
    expect(localeText.noData).to.equal('Prioritized');
  });

  it("should not lose locales from higher LocalizationProvider when deepest one don't have the translation key", () => {
    const handleContextChange = spy();

    render(
      <ChartsLocalizationProvider localeText={{ noData: 'Prioritized' }}>
        <ChartsLocalizationProvider localeText={{ loading: 'Other Locale' }}>
          <ContextListener onContextChange={handleContextChange} />
        </ChartsLocalizationProvider>
      </ChartsLocalizationProvider>,
    );

    const localeText: ChartsLocaleText = handleContextChange.lastCall.args[0].localeText;
    expect(localeText.noData).to.equal('Prioritized');
    expect(localeText.loading).to.equal('Other Locale');
  });
});
