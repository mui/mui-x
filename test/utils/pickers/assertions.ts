import { MockInstance } from 'vitest';
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

export const expectFieldValueV6 = (
  input: HTMLInputElement,
  expectedValue: string,
  specialCase?: 'singleDigit' | 'RTL',
) => {
  const value = cleanText(input.value, specialCase);
  return expect(value).to.equal(expectedValue);
};

export const expectFieldPlaceholderV6 = (
  input: HTMLInputElement,
  placeholder: string,
  specialCase?: 'singleDigit' | 'RTL',
) => {
  const cleanPlaceholder = cleanText(input.placeholder, specialCase);
  return expect(cleanPlaceholder).to.equal(placeholder);
};

export function expectPickerChangeHandlerValue(
  type: PickerComponentType | PickerRangeComponentType,
  spyCallback: MockInstance,
  expectedValue: any,
) {
  if (isPickerRangeType(type)) {
    spyCallback.mock.lastCall![0].forEach((value: any, index: number) => {
      expect(value).to.deep.equal(expectedValue[index]);
    });
  } else {
    expect(spyCallback.mock.lastCall![0]).to.deep.equal(expectedValue);
  }
}
