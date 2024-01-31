import * as React from 'react';
import ApiPage from 'docs/src/modules/components/ApiPage';
import mapApiPageTranslations from 'docs/src/modules/utils/mapApiPageTranslations';
import { dataGridLayoutKeys } from 'docsx/src/modules/utils/layoutStorageKey';
import jsonPageContent from './data-grid-pro.json';

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
    'docsx/translations/api-docs/data-grid/data-grid-pro',
    false,
    /\.\/data-grid-pro.*.json$/,
  );
  const descriptions = mapApiPageTranslations(req);

  return {
    descriptions,
    pageContent: jsonPageContent,
  };
};
