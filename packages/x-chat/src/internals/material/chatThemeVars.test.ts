import { createTheme, extendTheme } from '@mui/material/styles';
import { chatCssVarKeys, getChatCssVars, getChatThemeTokens } from './chatThemeVars';

describe('chatThemeVars', () => {
  it('derives semantic defaults from a light theme', () => {
    const theme = createTheme();
    const tokens = getChatThemeTokens(theme);
    const cssVars = getChatCssVars(theme);

    expect(tokens.userMessageBg).to.equal(theme.palette.primary.main);
    expect(tokens.userMessageColor).to.equal(theme.palette.primary.contrastText);
    expect(tokens.assistantMessageBg).to.equal(theme.palette.background.paper);
    expect(tokens.composerBorder).to.equal(theme.palette.divider);
    expect(cssVars[chatCssVarKeys.conversationHoverBg]).to.equal(theme.palette.action.hover);
  });

  it('resolves dark-mode defaults from the active palette mode', () => {
    const theme = createTheme({
      palette: {
        mode: 'dark',
      },
    });
    const tokens = getChatThemeTokens(theme);

    expect(tokens.assistantMessageBg).to.equal(theme.palette.background.paper);
    expect(tokens.conversationSelectedBg).to.equal(theme.palette.action.selected);
    expect(tokens.conversationSelectedColor).to.equal(theme.palette.text.primary);
    expect(tokens.composerFocusRing).to.equal(theme.palette.primary.main);
  });

  it('prefers CSS-variable palette entries when vars are available', () => {
    const theme = extendTheme({
      colorSchemes: {
        light: {
          palette: {
            Chat: {
              userMessageBg: '#102030',
              composerFocusRing: '#304050',
            },
          },
        },
      },
    });
    const tokens = getChatThemeTokens(theme);
    const cssVars = getChatCssVars(theme);

    expect(tokens.userMessageBg).to.equal('var(--mui-palette-Chat-userMessageBg, #102030)');
    expect(tokens.composerFocusRing).to.equal('var(--mui-palette-Chat-composerFocusRing, #304050)');
    expect(cssVars[chatCssVarKeys.userMessageBg]).to.equal(tokens.userMessageBg);
    expect(cssVars[chatCssVarKeys.composerFocusRing]).to.equal(tokens.composerFocusRing);
  });
});
