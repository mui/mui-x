/* Adapted from https://github.com/mui/base-ui/blob/c52a6ab0c5982263e10028756a8792234eeadf42/packages/react/src/utils/useRenderElement.spec.tsx */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable testing-library/render-result-naming-convention */
import * as React from 'react';
import { useRenderElement } from './useRenderElement';
import { expectType } from '../expectType';

const element1 = useRenderElement('div', {}, {});

expectType<React.ReactElement<Record<string, unknown>>, typeof element1>(element1);

const element2 = useRenderElement(
  'div',
  {},
  {
    enabled: true,
  },
);

expectType<React.ReactElement<Record<string, unknown>>, typeof element2>(element2);

const element3 = useRenderElement(
  'div',
  {},
  {
    enabled: false,
  },
);

expectType<null, typeof element3>(element3);

const element4 = useRenderElement(
  'div',
  {},
  {
    enabled: Math.random() > 0.5,
  },
);

expectType<React.ReactElement<Record<string, unknown>> | null, typeof element4>(element4);
