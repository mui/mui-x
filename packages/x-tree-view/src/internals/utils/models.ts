import { warnOnce } from '@mui/x-internals/warning';
import * as React from 'react';

function useAssertModelConsistencyOutsideOfProduction<T>(parameters: {
  state: string;
  controlled: T | undefined;
  defaultValue: T;
}) {
  const { state, controlled, defaultValue } = parameters;
  const [{ initialDefaultValue, isControlled }] = React.useState({
    initialDefaultValue: defaultValue,
    isControlled: controlled !== undefined,
  });

  if (isControlled !== (controlled !== undefined)) {
    warnOnce(
      [
        `MUI X: A component is changing the ${
          isControlled ? '' : 'un'
        }controlled ${state} state of Tree View to be ${isControlled ? 'un' : ''}controlled.`,
        'Elements should not switch from uncontrolled to controlled (or vice versa).',
        `Decide between using a controlled or uncontrolled ${state} ` +
          'element for the lifetime of the component.',
        "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
        'More info: https://fb.me/react-controlled-components',
      ],
      'error',
    );
  }

  if (JSON.stringify(initialDefaultValue) !== JSON.stringify(defaultValue)) {
    warnOnce(
      [
        `MUI X: A component is changing the default ${state} state of an uncontrolled Tree View after being initialized. ` +
          `To suppress this warning opt to use a controlled Tree View.`,
      ],
      'error',
    );
  }
}

export const useAssertModelConsistency =
  process.env.NODE_ENV === 'production' ? () => {} : useAssertModelConsistencyOutsideOfProduction;
