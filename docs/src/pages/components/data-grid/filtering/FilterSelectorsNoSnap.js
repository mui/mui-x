import React from 'react';
import SelectorsDocs from 'docsx/src/modules/components/SelectorsDocs';
import selectors from 'docsx/pages/api-docs/data-grid/selectors.json';

export default function FilterApiNoSnap() {
    return <SelectorsDocs selectors={selectors.filter(selector => selector.feature === 'Filter')} />;
}
