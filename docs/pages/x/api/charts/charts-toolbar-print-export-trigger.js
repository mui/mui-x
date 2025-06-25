import * as React from 'react';
import ApiPage from 'docs/src/modules/components/ApiPage';
import mapApiPageTranslations from 'docs/src/modules/utils/mapApiPageTranslations';
import jsonPageContent from './charts-toolbar-print-export-trigger.json';

export default function Page(props) {
  const { descriptions, pageContent } = props;
  return <ApiPage descriptions={descriptions} pageContent={pageContent} />;
}

Page.getInitialProps = () => {
  const req = require.context(
    'docsx/translations/api-docs/charts/charts-toolbar-print-export-trigger',
    false,
    /\.\/charts-toolbar-print-export-trigger.*.json$/,
  );
  const descriptions = mapApiPageTranslations(req);

  return {
    descriptions,
    pageContent: jsonPageContent,
  };
};
