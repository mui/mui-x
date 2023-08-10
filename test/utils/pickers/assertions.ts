import { expect } from 'chai';
import { SinonSpy } from 'sinon';

export function expectPickerChangeHandlerValue(
  type: 'date' | 'date-time' | 'time' | 'date-range',
  spyCallback: SinonSpy,
  expectedValue: any,
) {
  if (type === 'date-range') {
    spyCallback.lastCall.firstArg.forEach((value, index) => {
      expect(value).to.deep.equal(expectedValue[index]);
    });
  } else {
    expect(spyCallback.lastCall.firstArg).to.deep.equal(expectedValue);
  }
}
