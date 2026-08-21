import * as React from 'react';
import { ErrorBoundary, reactMajor } from '@mui/internal-test-utils';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { useEventDialogOccurrence } from './useEventDialogOccurrence';

describe('useEventDialogOccurrence', () => {
  const { render } = createSchedulerRenderer();

  it('should throw when used outside of the event dialog form', () => {
    const errorRef = React.createRef<any>();

    const errorMessage1 =
      'MUI X Scheduler: useEventDialogOccurrence must be used within the event dialog form.';
    const errorMessage2 = 'The above error occurred in the <Consumer> component';
    const expectedError = reactMajor < 19 ? [errorMessage2] : [errorMessage1];

    function Consumer() {
      useEventDialogOccurrence();
      return null;
    }

    expect(() =>
      render(
        <ErrorBoundary ref={errorRef}>
          <Consumer />
        </ErrorBoundary>,
      ),
    ).toErrorDev(expectedError);

    expect((errorRef.current as any).errors).to.have.length(1);
    expect((errorRef.current as any).errors[0].toString()).to.include(errorMessage1);
  });
});
