import React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';

import {
  demos,
  docs,
  demoComponents,
} from 'docsx/src/pages/components/charts/pie-chart/pie-chart.md?@mui/markdown';

export default function Page() {
  return <MarkdownDocs demos={demos} docs={docs} demoComponents={demoComponents} disableToc />;
}
