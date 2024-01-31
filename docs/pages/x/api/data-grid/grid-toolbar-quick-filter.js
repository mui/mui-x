import * as React from 'react';
import ApiPage from 'docs/src/modules/components/ApiPage';
import mapApiPageTranslations from 'docs/src/modules/utils/mapApiPageTranslations';
import { dataGridLayoutKeys } from 'docsx/src/modules/utils/layoutStorageKey';
import jsonPageContent from './grid-toolbar-quick-filter.json';

export default function Page(props) {
  const { descriptions, pageContent } = props;
  return (
    <ApiPage
      defaultLayout="expanded"
      layoutStorageKey={dataGridLayoutKeys}
      descriptions={descriptions}
      pageContent={pageContent}
    />
  );
}

Page.getInitialProps = () => {
  const req = require.context(
    'docsx/translations/api-docs/data-grid/grid-toolbar-quick-filter',
    false,
    /\.\/grid-toolbar-quick-filter.*.json$/,
  );
  const descriptions = mapApiPageTranslations(req);

  return {
    descriptions,
    pageContent: jsonPageContent,
  };
};
