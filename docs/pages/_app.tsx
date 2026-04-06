import 'docsx/src/bootstrap';
// --- Post bootstrap -----
import * as React from 'react';
import type { DocsAppProps } from '@mui/internal-core-docs/DocsApp';
import {
  DocsApp,
  createGetInitialProps,
  printConsoleBanner,
  reportWebVitals,
} from '@mui/internal-core-docs/DocsApp';
import { ThemeProvider } from '@mui/internal-core-docs/ThemeContext';
import findActivePage from '@mui/internal-core-docs/findActivePage';
import getProductInfoFromUrl from '@mui/internal-core-docs/getProductInfoFromUrl';
import { pathnameToLanguage } from '@mui/internal-core-docs/helpers';
import { Translations } from '@mui/internal-core-docs/i18n';
import { LicenseInfo } from '@mui/x-license';
import { muiXTelemetrySettings } from '@mui/x-telemetry';
import xPages from 'docsx/data/pages'; // DO NOT REMOVE
import { postProcessImport } from 'docsx/src/modules/utils/postProcessImport';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import * as config from '../config';

export { fontClasses } from '@mui/internal-core-docs/nextFonts';

// Enable telemetry for internal purposes
muiXTelemetrySettings.enableTelemetry();
// Remove the license warning from demonstration purposes
LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI_LICENSE!);

printConsoleBanner();

function getMuiPackageVersion(packageName: string, commitRef?: string) {
  if (commitRef === undefined) {
    // #npm-tag-reference
    // Use the "next" tag for the master git branch after we start working on the next major version
    // Once the major release is finished we can go back to "latest"
    return 'next';
  }
  return `https://pkg.pr.new/mui/mui-x/@mui/${packageName}@${commitRef}`;
}

function usePageData(pageProps: DocsAppProps['pageProps']) {
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

  return React.useMemo(() => {
    const { activePage, activePageParents } = findActivePage(xPages, router.pathname);
    const languagePrefix = pageProps.userLanguage === 'en' ? '' : `/${pageProps.userLanguage}`;
    const productIdMap: Record<string, { subpath: string; version: string | undefined }> = {
      introduction: { subpath: '/x/introduction', version: process.env.LIB_VERSION },
      'x-data-grid': { subpath: '/x/react-data-grid', version: process.env.DATA_GRID_VERSION },
      'x-date-pickers': {
        subpath: '/x/react-date-pickers',
        version: process.env.DATE_PICKERS_VERSION,
      },
      'x-charts': { subpath: '/x/react-charts', version: process.env.CHARTS_VERSION },
      'x-tree-view': { subpath: '/x/react-tree-view', version: process.env.TREE_VIEW_VERSION },
    };

    const getVersionOptions = (id: string, versions: string[]) =>
      versions.map((version) => {
        if (version === productIdMap[id].version) {
          return {
            current: true,
            text: `v${version}`,
            href: `${languagePrefix}${productIdMap[id].subpath}/`,
          };
        }
        // TODO: remove this once we have a v8.mui.com subdomain
        if (version === 'v8') {
          return {
            text: version,
            href: `https://mui.com${languagePrefix}${productIdMap[id].subpath}/`,
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
        ...getVersionOptions('introduction', [process.env.LIB_VERSION!, 'v8', 'v7', 'v6', 'v5']),
        { text: 'v4', href: `https://v4.mui.com${languagePrefix}/components/data-grid/` },
      ],
    };

    if (productId === 'x-data-grid') {
      productIdentifier = {
        metadata: 'MUI X',
        name: 'Data Grid',
        versions: [
          ...getVersionOptions('x-data-grid', [
            process.env.DATA_GRID_VERSION!,
            'v8',
            'v7',
            'v6',
            'v5',
          ]),
          { text: 'v4', href: `https://v4.mui.com${languagePrefix}/components/data-grid/` },
        ],
      };
    } else if (productId === 'x-date-pickers') {
      productIdentifier = {
        metadata: 'MUI X',
        name: 'Date Pickers',
        versions: [
          ...getVersionOptions('x-date-pickers', [
            process.env.DATE_PICKERS_VERSION!,
            'v8',
            'v7',
            'v6',
          ]),
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
        versions: getVersionOptions('x-charts', [process.env.CHARTS_VERSION!, 'v8', 'v7', 'v6']),
      };
    } else if (productId === 'x-tree-view') {
      productIdentifier = {
        metadata: 'MUI X',
        name: 'Tree View',
        versions: [
          ...getVersionOptions('x-tree-view', [process.env.TREE_VIEW_VERSION!, 'v8', 'v7']),
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
      productIdentifier,
      productId,
      productCategoryId,
    };
  }, [productId, productCategoryId, pageProps.userLanguage, router.pathname]);
}

const CSB_CONFIG = {
  primaryPackage: '@mui/material',
  fallbackDependency: { name: '@mui/material', version: 'latest' },
  // Moved from globalThis.muiDocConfig.csbIncludePeerDependencies
  includePeerDependencies: (
    deps: Record<string, string>,
    { versions }: { versions: Record<string, string> },
  ) => {
    const newDeps = { ...deps };
    newDeps['@mui/material'] =
      versions['@mui/material'] !== 'next' ? versions['@mui/material'] : 'latest';
    if (newDeps['@mui/x-data-grid-generator']) {
      newDeps['@mui/icons-material'] = versions['@mui/icons-material'];
    }
    return newDeps;
  },
  // Moved from globalThis.muiDocConfig.csbGetVersions
  getVersions: (versions: Record<string, string>, { muiCommitRef }: { muiCommitRef?: string }) => {
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
      '@base-ui/utils': 'latest',
    };
  },
  // Moved from globalThis.muiDocConfig.postProcessImport
  postProcessImport,
};

function useThemeWrapper() {
  const router = useRouter();
  // Replicate change reverted in https://github.com/mui/material-ui/pull/35969/files#r1089572951
  // Fixes playground styles in dark mode.
  return router.pathname.startsWith('/playground') ? React.Fragment : ThemeProvider;
}

export default function MyApp(
  props: AppProps<{ userLanguage: string; translations: Translations }>,
) {
  const { Component, pageProps } = props;
  const { activePage, activePageParents, productIdentifier, productId, productCategoryId } =
    usePageData(pageProps);
  const ThemeWrapper = useThemeWrapper();

  return (
    <DocsApp
      {...props}
      Component={Component}
      pageProps={pageProps}
      docsConfig={config}
      serviceWorkerPath="/x/sw.js"
      activePage={activePage}
      activePageParents={activePageParents}
      pageList={xPages}
      productIdentifier={productIdentifier}
      productCategoryId={productCategoryId}
      productId={productId}
      demoDisplayName="MUI X"
      csbConfig={CSB_CONFIG}
      ThemeWrapper={ThemeWrapper}
    />
  );
}

MyApp.getInitialProps = createGetInitialProps({
  translationsContext: require.context('../translations', false, /\.\/translations.*\.json$/),
});

export { reportWebVitals };
