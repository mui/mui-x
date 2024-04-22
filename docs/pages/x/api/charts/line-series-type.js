import * as React from 'react';
import InterfaceApiPage from 'docsx/src/modules/components/InterfaceApiPage';
import layoutConfig from 'docsx/src/modules/utils/dataGridLayoutConfig';
import mapApiPageTranslations from 'docs/src/modules/utils/mapApiPageTranslations';
import jsonPageContent from './line-series-type.json';

export default function Page(props) {
  const { descriptions, pageContent } = props;
  return (
    <InterfaceApiPage {...layoutConfig} descriptions={descriptions} pageContent={pageContent} />
  );
}

Page.getInitialProps = () => {
  const req = require.context(
    'docsx/translations/api-docs/charts/',
    false,
    /\.\/line-series-type.*.json$/,
  );
  const descriptions = mapApiPageTranslations(req);

  return {
    descriptions,
    pageContent: jsonPageContent,
  };
};
