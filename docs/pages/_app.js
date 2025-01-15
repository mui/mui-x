import 'docs/src/modules/components/bootstrap';
// --- Post bootstrap -----
import pages from 'docsx/data/pages'; // DO NOT REMOVE
import * as React from 'react';
import { loadCSS } from 'fg-loadcss/src/loadCSS';
import NextHead from 'next/head';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { ponyfillGlobal } from '@mui/utils';
import PageContext from 'docs/src/modules/components/PageContext';
import GoogleAnalytics from 'docs/src/modules/components/GoogleAnalytics';
import { ThemeProvider } from 'docs/src/modules/components/ThemeContext';
import { CodeVariantProvider } from 'docs/src/modules/utils/codeVariant';
import { CodeCopyProvider } from 'docs/src/modules/utils/CodeCopy';
import { UserLanguageProvider } from 'docs/src/modules/utils/i18n';
import DocsStyledEngineProvider from 'docs/src/modules/utils/StyledEngineProvider';
import createEmotionCache from 'docs/src/createEmotionCache';
import findActivePage from 'docs/src/modules/utils/findActivePage';
import { LicenseInfo } from '@mui/x-data-grid-pro';

// Remove the license warning from demonstration purposes
LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI_LICENSE);

function getMuiPackageVersion(packageName, commitRef) {
  if (commitRef === undefined) {
    return '^5.0.0';
  }
  const shortSha = commitRef.slice(0, 8);
  return `https://pkg.csb.dev/mui/mui-x/commit/${shortSha}/@mui/${packageName}`;
}

ponyfillGlobal.muiDocConfig = {
  csbIncludePeerDependencies: (deps, { versions }) => {
    const newDeps = { ...deps };

    if (newDeps['@mui/x-data-grid-premium']) {
      newDeps['@mui/x-data-grid-pro'] = versions['@mui/x-data-grid-pro'];
      // TODO: remove when https://github.com/mui/material-ui/pull/32492 is released
      // use `import 'exceljs'` in demonstrations instead
      newDeps.exceljs = versions.exceljs;
    }

    if (newDeps['@mui/x-data-grid-pro']) {
      newDeps['@mui/x-data-grid'] = versions['@mui/x-data-grid'];
    }

    if (newDeps['@mui/x-data-grid']) {
      newDeps['@mui/material'] = '^5.4.1';
    }

    if (newDeps['@mui/x-data-grid-generator']) {
      newDeps['@mui/material'] = '^5.4.1';
      newDeps['@mui/icons-material'] = '^5.0.0';
      newDeps['@mui/x-data-grid'] = versions['@mui/x-data-grid']; // TS types are imported from @mui/x-data-grid
      newDeps['@mui/x-data-grid-pro'] = versions['@mui/x-data-grid-pro']; // Some TS types are imported from @mui/x-data-grid-pro
    }

    if (newDeps['@mui/x-date-pickers-pro']) {
      newDeps['@mui/x-date-pickers'] = versions['@mui/x-date-pickers'];
    }

    if (newDeps['@mui/x-date-pickers']) {
      newDeps['@mui/material'] = '^5.4.1';
      newDeps['date-fns'] = versions['date-fns'];
    }

    return newDeps;
  },
  csbGetVersions: (versions, { muiCommitRef }) => {
    const output = {
      ...versions,
      react: '^18.0.0',
      'react-dom': '^18.0.0',
      '@mui/x-data-grid': getMuiPackageVersion('x-data-grid', muiCommitRef),
      '@mui/x-data-grid-pro': getMuiPackageVersion('x-data-grid-pro', muiCommitRef),
      '@mui/x-data-grid-premium': getMuiPackageVersion('x-data-grid-premium', muiCommitRef),
      '@mui/x-data-grid-generator': getMuiPackageVersion('x-data-grid-generator', muiCommitRef),
      '@mui/x-date-pickers': getMuiPackageVersion('x-date-pickers', muiCommitRef),
      '@mui/x-date-pickers-pro': getMuiPackageVersion('x-date-pickers-pro', muiCommitRef),
      'date-fns': 'latest',
      exceljs: '^4.3.0',
    };
    return output;
  },
};

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

let reloadInterval;

// Avoid infinite loop when "Upload on reload" is set in the Chrome sw dev tools.
function lazyReload() {
  clearInterval(reloadInterval);
  reloadInterval = setInterval(() => {
    if (document.hasFocus()) {
      window.location.reload();
    }
  }, 100);
}

// Inspired by
// https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
function forcePageReload(registration) {
  // console.log('already controlled?', Boolean(navigator.serviceWorker.controller));

  if (!navigator.serviceWorker.controller) {
    // The window client isn't currently controlled so it's a new service
    // worker that will activate immediately.
    return;
  }

  // console.log('registration waiting?', Boolean(registration.waiting));
  if (registration.waiting) {
    // SW is waiting to activate. Can occur if multiple clients open and
    // one of the clients is refreshed.
    registration.waiting.postMessage('skipWaiting');
    return;
  }

  function listenInstalledStateChange() {
    registration.installing.addEventListener('statechange', (event) => {
      // console.log('statechange', event.target.state);
      if (event.target.state === 'installed' && registration.waiting) {
        // A new service worker is available, inform the user
        registration.waiting.postMessage('skipWaiting');
      } else if (event.target.state === 'activated') {
        // Force the control of the page by the activated service worker.
        lazyReload();
      }
    });
  }

  if (registration.installing) {
    listenInstalledStateChange();
    return;
  }

  // We are currently controlled so a new SW may be found...
  // Add a listener in case a new SW is found,
  registration.addEventListener('updatefound', listenInstalledStateChange);
}

async function registerServiceWorker() {
  if (
    'serviceWorker' in navigator &&
    process.env.NODE_ENV === 'production' &&
    window.location.host.indexOf('mui.com') !== -1
  ) {
    // register() automatically attempts to refresh the sw.js.
    const registration = await navigator.serviceWorker.register('/sw.js');
    // Force the page reload for users.
    forcePageReload(registration);
  }
}

let dependenciesLoaded = false;

function loadDependencies() {
  if (dependenciesLoaded) {
    return;
  }

  dependenciesLoaded = true;

  loadCSS(
    'https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Two+Tone',
    document.querySelector('#material-icon-font'),
  );
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line no-console
  console.log(
    `%c

███╗   ███╗ ██╗   ██╗ ██████╗
████╗ ████║ ██║   ██║   ██╔═╝
██╔████╔██║ ██║   ██║   ██║
██║╚██╔╝██║ ██║   ██║   ██║
██║ ╚═╝ ██║ ╚██████╔╝ ██████╗
╚═╝     ╚═╝  ╚═════╝  ╚═════╝

Tip: you can access the documentation \`theme\` object directly in the console.
`,
    'font-family:monospace;color:#1976d2;font-size:12px;',
  );
}

function AppWrapper(props) {
  const { children, emotionCache, pageProps } = props;

  const router = useRouter();

  React.useEffect(() => {
    loadDependencies();
    registerServiceWorker();

    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  let fonts = [];
  if (router.pathname.match(/onepirate/)) {
    fonts = [
      'https://fonts.googleapis.com/css?family=Roboto+Condensed:700|Work+Sans:300,400&display=swap',
    ];
  }

  const pageContextValue = React.useMemo(() => {
    const { activePage, activePageParents } = findActivePage(pages, router.pathname);

    return { activePage, activePageParents, pages };
  }, [router.pathname]);

  // Replicate change reverted in https://github.com/mui/material-ui/pull/35969/files#r1089572951
  // Fixes playground styles in dark mode.
  const ThemeWrapper = router.pathname.startsWith('/playground') ? React.Fragment : ThemeProvider;

  return (
    <React.Fragment>
      <NextHead>
        {fonts.map((font) => (
          <link rel="stylesheet" href={font} key={font} />
        ))}
      </NextHead>
      <UserLanguageProvider defaultUserLanguage={pageProps.userLanguage}>
        <CodeCopyProvider>
          <CodeVariantProvider>
            <PageContext.Provider value={pageContextValue}>
              <ThemeWrapper>
                <DocsStyledEngineProvider cacheLtr={emotionCache}>
                  {children}
                  <GoogleAnalytics />
                </DocsStyledEngineProvider>
              </ThemeWrapper>
            </PageContext.Provider>
          </CodeVariantProvider>
        </CodeCopyProvider>
      </UserLanguageProvider>
    </React.Fragment>
  );
}

AppWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  emotionCache: PropTypes.object.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <AppWrapper emotionCache={emotionCache} pageProps={pageProps}>
      <Component {...pageProps} />
    </AppWrapper>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

MyApp.getInitialProps = async ({ ctx, Component }) => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return {
    pageProps: {
      userLanguage: ctx.query.userLanguage || 'en',
      ...pageProps,
    },
  };
};

// Track fraction of actual events to prevent exceeding event quota.
// Filter sessions instead of individual events so that we can track multiple metrics per device.
const disableWebVitalsReporting = Math.random() > 0.0001;
export function reportWebVitals({ id, name, label, value }) {
  if (disableWebVitalsReporting) {
    return;
  }

  window.ga('send', 'event', {
    eventCategory: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    eventAction: name,
    eventValue: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    eventLabel: id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate.
  });
}
