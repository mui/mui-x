import * as React from 'react';
import Head from 'docs/src/modules/components/Head';
import BrandingCssVarsProvider from 'docs/src/BrandingCssVarsProvider';
import AppHeader from 'docs/src/layouts/AppHeader';
// import AppHeaderBanner from 'docs/src/components/banner/AppHeaderBanner';

import MainDemo from 'docsx/src/modules/components/overview/charts/mainDemo/MainDemo';
import FeaturesHighlight from 'docsx/src/modules/components/overview/charts/featuresHighlight/FeaturesHighlight';

export default function ChartsBranding() {
  return (
    <BrandingCssVarsProvider>
      <Head
        title="MUI X: Advanced React components for complex use cases"
        description="Build complex and data-rich applications using a growing list of advanced React
        components, like the Data Grid, Date and Time Pickers, Charts, and more!"
        card="/static/social-previews/muix-preview.jpg"
      />
      {/* <AppHeaderBanner /> */}
      <AppHeader gitHubRepository="https://github.com/mui/mui-x" />
      <main id="main-content">
        <MainDemo />
        <FeaturesHighlight />
      </main>
    </BrandingCssVarsProvider>
  );
}
