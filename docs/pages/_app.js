import 'docs/src/modules/components/bootstrap';
// --- Post bootstrap -----
import pages from 'docsx/data/pages'; // DO NOT REMOVE
import { postProcessImport } from 'docsx/src/modules/utils/postProcessImport';
import * as React from 'react';
import { loadCSS } from 'fg-loadcss/src/loadCSS';
import NextHead from 'next/head';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { LicenseInfo } from '@mui/x-license';
import { muiXTelemetrySettings } from '@mui/x-telemetry';
import PageContext from 'docs/src/modules/components/PageContext';
import GoogleAnalytics from 'docs/src/modules/components/GoogleAnalytics';
import { CodeCopyProvider } from '@mui/docs/CodeCopy';
import { ThemeProvider } from 'docs/src/modules/components/ThemeContext';
import { CodeVariantProvider } from 'docs/src/modules/utils/codeVariant';
import { CodeStylingProvider } from 'docs/src/modules/utils/codeStylingSolution';
import DocsStyledEngineProvider from 'docs/src/modules/utils/StyledEngineProvider';
import createEmotionCache from 'docs/src/createEmotionCache';
import findActivePage from 'docs/src/modules/utils/findActivePage';
import { pathnameToLanguage } from 'docs/src/modules/utils/helpers';
import getProductInfoFromUrl from 'docs/src/modules/utils/getProductInfoFromUrl';
import { DocsProvider } from '@mui/docs/DocsProvider';
import { mapTranslations } from '@mui/docs/i18n';
import { Inter, Roboto } from 'next/font/google';
import localFont from 'next/font/local';
import * as config from '../config';

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

const generalSans = localFont({
  declarations: [{ prop: 'font-family', value: 'General Sans' }],
  src: [
    { path: '../public/static/fonts/GeneralSans-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/static/fonts/GeneralSans-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/static/fonts/GeneralSans-Semibold.woff2', weight: '600', style: 'normal' },
    { path: '../public/static/fonts/GeneralSans-Bold.woff2', weight: '700', style: 'normal' },
  ],
});

const ibmPlexSans = localFont({
  declarations: [{ prop: 'font-family', value: 'IBM Plex Sans' }],
  src: [
    { path: '../public/static/fonts/IBMPlexSans-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/static/fonts/IBMPlexSans-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/static/fonts/IBMPlexSans-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../public/static/fonts/IBMPlexSans-Bold.woff2', weight: '700', style: 'normal' },
  ],
});

export const fontClasses = `${inter.className} ${roboto.className} ${generalSans.className} ${ibmPlexSans.className}`;

// Enable telemetry for internal purposes
muiXTelemetrySettings.enableTelemetry();
// Remove the license warning from demonstration purposes
LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI_LICENSE);

function getMuiPackageVersion(packageName, commitRef) {
  if (commitRef === undefined) {
    // #npm-tag-reference
    // Use the "next" tag for the master git branch after we start working on the next major version
    // Once the major release is finished we can go back to "latest"
    return 'latest';
  }
  return `https://pkg.pr.new/mui/mui-x/@mui/${packageName}@${commitRef}`;
}

globalThis.muiDocConfig = {
  csbIncludePeerDependencies: (deps, { versions }) => {
    const newDeps = { ...deps };

    // #npm-tag-reference
    // TODO: Do we really need this? The condition does not make that much sense tbh!
    // Check which version of `@mui/material` should be resolved when opening docs examples in StackBlitz or CodeSandbox
    newDeps['@mui/material'] =
      versions['@mui/material'] !== 'next' ? versions['@mui/material'] : 'latest';

    if (newDeps['@mui/x-data-grid-generator']) {
      newDeps['@mui/icons-material'] = versions['@mui/icons-material'];
    }
    return newDeps;
  },
  csbGetVersions: (versions, { muiCommitRef }) => {
    return {
      ...versions,
      '@mui/x-data-grid': getMuiPackageVersion('x-data-grid', muiCommitRef),
      '@mui/x-data-grid-pro': getMuiPackageVersion('x-data-grid-pro', muiCommitRef),
      '@mui/x-data-grid-premium': getMuiPackageVersion('x-data-grid-premium', muiCommitRef),
      '@mui/x-data-grid-generator': getMuiPackageVersion('x-data-grid-generator', muiCommitRef),
      '@mui/x-date-pickers': getMuiPackageVersion('x-date-pickers', muiCommitRef),
      '@mui/x-date-pickers-pro': getMuiPackageVersion('x-date-pickers-pro', muiCommitRef),
      '@mui/x-charts': getMuiPackageVersion('x-charts', muiCommitRef),
      '@mui/x-charts-pro': getMuiPackageVersion('x-charts-pro', muiCommitRef),
      '@mui/x-charts-premium': getMuiPackageVersion('x-charts-premium', muiCommitRef),
      '@mui/x-tree-view': getMuiPackageVersion('x-tree-view', muiCommitRef),
      '@mui/x-tree-view-pro': getMuiPackageVersion('x-tree-view-pro', muiCommitRef),
      '@mui/x-internals': getMuiPackageVersion('x-internals', muiCommitRef),
      '@mui/x-internal-gestures': getMuiPackageVersion('x-internal-gestures', muiCommitRef),
      exceljs: 'latest',
      '@base-ui-components/utils': 'latest',
    };
  },
  postProcessImport,
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
    const registration = await navigator.serviceWorker.register('/x/sw.js');
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
  const { productId: productIdRaw, productCategoryId } = getProductInfoFromUrl(router.asPath);
  const { canonicalAs } = pathnameToLanguage(router.asPath);
  let productId = productIdRaw;

  // Not respecting URL convention, ad-hoc workaround
  if (canonicalAs.startsWith('/x/api/data-grid/')) {
    productId = 'x-data-grid';
  } else if (canonicalAs.startsWith('/x/api/date-pickers/')) {
    productId = 'x-date-pickers';
  } else if (canonicalAs.startsWith('/x/api/charts/')) {
    productId = 'x-charts';
  }

  React.useEffect(() => {
    loadDependencies();
    registerServiceWorker();

    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const pageContextValue = React.useMemo(() => {
    const { activePage, activePageParents } = findActivePage(pages, router.pathname);
    const languagePrefix = pageProps.userLanguage === 'en' ? '' : `/${pageProps.userLanguage}`;
    const productIdMap = {
      introduction: { subpath: '/x/introduction', version: process.env.LIB_VERSION },
      'x-data-grid': { subpath: '/x/react-data-grid', version: process.env.DATA_GRID_VERSION },
      'x-date-pickers': {
        subpath: '/x/react-date-pickers',
        version: process.env.DATE_PICKERS_VERSION,
      },
      'x-charts': { subpath: '/x/react-charts', version: process.env.CHARTS_VERSION },
      'x-tree-view': { subpath: '/x/react-tree-view', version: process.env.TREE_VIEW_VERSION },
    };

    const getVersionOptions = (id, versions) =>
      versions.map((version) => {
        if (version === productIdMap[id].version) {
          return {
            current: true,
            text: `v${version}`,
            href: `${languagePrefix}${productIdMap[id].subpath}/`,
          };
        }
        return {
          text: version,
          href: `https://${version}.mui.com${languagePrefix}${productIdMap[id].subpath}/`,
        };
      });

    let productIdentifier = {
      metadata: '',
      name: 'MUI X',
      versions: [
        {
          text: `next`,
          href: `https://next.mui.com${languagePrefix}/x/introduction/`,
        },
        ...getVersionOptions('introduction', [process.env.LIB_VERSION, 'v7', 'v6', 'v5']),
        { text: 'v4', href: `https://v4.mui.com${languagePrefix}/components/data-grid/` },
      ],
    };

    if (productId === 'x-data-grid') {
      productIdentifier = {
        metadata: 'MUI X',
        name: 'Data Grid',
        versions: [
          {
            text: `next`,
            href: `https://next.mui.com${languagePrefix}/x/introduction/`,
          },
          ...getVersionOptions('x-data-grid', [process.env.DATA_GRID_VERSION, 'v7', 'v6', 'v5']),
          { text: 'v4', href: `https://v4.mui.com${languagePrefix}/components/data-grid/` },
        ],
      };
    } else if (productId === 'x-date-pickers') {
      productIdentifier = {
        metadata: 'MUI X',
        name: 'Date Pickers',
        versions: [
          {
            text: `next`,
            href: `https://next.mui.com${languagePrefix}/x/introduction/`,
          },
          ...getVersionOptions('x-date-pickers', [process.env.DATE_PICKERS_VERSION, 'v7', 'v6']),
          {
            text: 'v5',
            href: `https://v5.mui.com${languagePrefix}/x/react-date-pickers/getting-started/`,
          },
        ],
      };
    } else if (productId === 'x-charts') {
      productIdentifier = {
        metadata: 'MUI X',
        name: 'Charts',
        versions: [
          {
            text: `next`,
            href: `https://next.mui.com${languagePrefix}/x/introduction/`,
          },
          ...getVersionOptions('x-charts', [process.env.CHARTS_VERSION, 'v7', 'v6']),
        ],
      };
    } else if (productId === 'x-tree-view') {
      productIdentifier = {
        metadata: 'MUI X',
        name: 'Tree View',
        versions: [
          {
            text: `next`,
            href: `https://next.mui.com${languagePrefix}/x/introduction/`,
          },
          ...getVersionOptions('x-tree-view', [process.env.TREE_VIEW_VERSION, 'v7']),
          {
            text: 'v6',
            href: `https://v6.mui.com${languagePrefix}/x/react-tree-view/getting-started`,
          },
        ],
      };
    }

    return {
      activePage,
      activePageParents,
      pages,
      productIdentifier,
      productId,
      productCategoryId,
    };
  }, [productId, productCategoryId, pageProps.userLanguage, router.pathname]);

  // Replicate change reverted in https://github.com/mui/material-ui/pull/35969/files#r1089572951
  // Fixes playground styles in dark mode.
  const ThemeWrapper = router.pathname.startsWith('/playground') ? React.Fragment : ThemeProvider;

  return (
    <React.Fragment>
      <NextHead>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="mui:productId" content={productId} />
        <meta name="mui:productCategoryId" content={productCategoryId} />
      </NextHead>
      <DocsProvider
        config={config}
        defaultUserLanguage={pageProps.userLanguage}
        translations={pageProps.translations}
      >
        <CodeCopyProvider>
          <CodeStylingProvider>
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
          </CodeStylingProvider>
        </CodeCopyProvider>
      </DocsProvider>
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

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <AppWrapper emotionCache={emotionCache} pageProps={pageProps}>
      {getLayout(<Component {...pageProps} />)}
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

  const req = require.context('../translations', false, /\.\/translations.*\.json$/);
  const translations = mapTranslations(req);

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return {
    pageProps: {
      userLanguage: ctx.query.userLanguage || 'en',
      translations,
      ...pageProps,
    },
  };
};

// Track fraction of actual events to prevent exceeding event quota.
// Filter sessions instead of individual events so that we can track multiple metrics per device.
// See https://github.com/GoogleChromeLabs/web-vitals-report to use this data
const disableWebVitalsReporting = Math.random() > 0.0001;
export function reportWebVitals({ id, name, label, delta, value }) {
  if (disableWebVitalsReporting) {
    return;
  }

  window.gtag('event', name, {
    value: delta,
    metric_label: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    metric_value: value,
    metric_delta: delta,
    metric_id: id, // id unique to current page load
  });
}
