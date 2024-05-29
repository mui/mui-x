import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { createRenderer } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocalizationContext } from '@mui/x-date-pickers/internals';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersLocaleText } from '@mui/x-date-pickers/locales';
import { AdapterClassToUse } from 'test/utils/pickers';

function ContextListener({
  onContextChange,
}: {
  onContextChange: (context: ReturnType<typeof useLocalizationContext>) => void;
}) {
  const context = useLocalizationContext();

  React.useEffect(() => {
    onContextChange(context);
  }, [onContextChange, context]);

  return null;
}

describe('<LocalizationProvider />', () => {
  const { render } = createRenderer();

  it('should respect localeText from the theme', () => {
    const handleContextChange = spy();

    const theme = createTheme({
      components: {
        MuiLocalizationProvider: {
          defaultProps: {
            localeText: { start: 'Debut' },
          },
        },
      },
    });

    render(
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterClassToUse}>
          <ContextListener onContextChange={handleContextChange} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    const localeText: PickersLocaleText<any> = handleContextChange.lastCall.args[0].localeText;
    expect(localeText.start).to.equal('Debut');
    expect(localeText.end).to.equal('End');
  });

  it('should prioritize localeText key passed on LocalizationProvider compared to key passed from the theme', () => {
    const handleContextChange = spy();

    const theme = createTheme({
      components: {
        MuiLocalizationProvider: {
          defaultProps: {
            localeText: { start: 'Debut' },
          },
        },
      },
    });

    render(
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterClassToUse} localeText={{ start: 'Start' }}>
          <ContextListener onContextChange={handleContextChange} />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    const localeText: PickersLocaleText<any> = handleContextChange.lastCall.args[0].localeText;
    expect(localeText.start).to.equal('Start');
  });

  it('should prioritize deepest LocalizationProvider when using nested ones', () => {
    const handleContextChange = spy();

    render(
      <LocalizationProvider dateAdapter={AdapterClassToUse} localeText={{ start: 'Empezar' }}>
        <LocalizationProvider dateAdapter={AdapterClassToUse} localeText={{ start: 'Début' }}>
          <ContextListener onContextChange={handleContextChange} />
        </LocalizationProvider>
      </LocalizationProvider>,
    );

    const localeText: PickersLocaleText<any> = handleContextChange.lastCall.args[0].localeText;
    expect(localeText.start).to.equal('Début');
  });

  it("should not loose locales from higher LocalizationProvider when deepest one don't have the translation key", () => {
    const handleContextChange = spy();

    render(
      <LocalizationProvider dateAdapter={AdapterClassToUse} localeText={{ start: 'Empezar' }}>
        <LocalizationProvider dateAdapter={AdapterClassToUse} localeText={{ end: 'Fin' }}>
          <ContextListener onContextChange={handleContextChange} />
        </LocalizationProvider>
      </LocalizationProvider>,
    );

    const localeText: PickersLocaleText<any> = handleContextChange.lastCall.args[0].localeText;
    expect(localeText.start).to.equal('Empezar');
  });
});
