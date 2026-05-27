import {
  cleanText,
  isPickerRangeType,
  PickerComponentType,
  PickerRangeComponentType,
} from 'test/utils/pickers';

export const expectFieldValue = (
  fieldSectionsContainer: HTMLDivElement,
  expectedValue: string,
  specialCase?: 'singleDigit' | 'RTL',
) => {
  const value = cleanText(fieldSectionsContainer.textContent ?? '', specialCase);
  return expect(value).to.equal(expectedValue);
};

/**
 * Asserts that a picker change-handler value deep-equals the expected one.
 *
 * Pass the raw value (e.g. `onChange.lastCall.firstArg`) rather than the
 * spy, so the helper stays agnostic of the spy library.
 */
export function expectPickerChangeHandlerValue(
  type: PickerComponentType | PickerRangeComponentType,
  actualValue: any,
  expectedValue: any,
) {
  if (isPickerRangeType(type)) {
    actualValue.forEach((value: any, index: number) => {
      expect(value).to.deep.equal(expectedValue[index]);
    });
  } else {
    expect(actualValue).to.deep.equal(expectedValue);
  }
}
