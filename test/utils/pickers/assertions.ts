import { SinonSpy } from 'sinon';
import {
  cleanText,
  isPickerRangeType,
  PickerComponentType,
  PickerRangeComponentType,
} from 'test/utils/pickers';

export const expectFieldValueV7 = (
  fieldSectionsContainer: HTMLDivElement,
  expectedValue: string,
  specialCase?: 'singleDigit' | 'RTL',
) => {
  const value = cleanText(fieldSectionsContainer.textContent ?? '', specialCase);
  return expect(value).to.equal(expectedValue);
};

export function expectPickerChangeHandlerValue(
  type: PickerComponentType | PickerRangeComponentType,
  spyCallback: SinonSpy,
  expectedValue: any,
) {
  if (isPickerRangeType(type)) {
    spyCallback.lastCall.firstArg.forEach((value: any, index: number) => {
      expect(value).to.deep.equal(expectedValue[index]);
    });
  } else {
    expect(spyCallback.lastCall.firstArg).to.deep.equal(expectedValue);
  }
}
