import * as React from 'react';
import ApiPage from 'docs/src/modules/components/ApiPage';
import mapApiPageTranslations from 'docs/src/modules/utils/mapApiPageTranslations';
import layoutConfig from 'docsx/src/modules/utils/dataGridLayoutConfig';
import jsonPageContent from './ai-assistant-panel-trigger.json';

export default function Page(props) {
  const { descriptions, pageContent } = props;
  return <ApiPage {...layoutConfig} descriptions={descriptions} pageContent={pageContent} />;
}

Page.getInitialProps = () => {
  const req = require.context(
    'docsx/translations/api-docs/data-grid/ai-assistant-panel-trigger',
    false,
    /\.\/ai-assistant-panel-trigger.*.json$/,
  );
  const descriptions = mapApiPageTranslations(req);

  return {
    descriptions,
    pageContent: jsonPageContent,
  };
};
