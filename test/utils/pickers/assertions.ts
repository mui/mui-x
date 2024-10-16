import { expect } from 'chai';
import { AdapterClassToUse, cleanText } from 'test/utils/pickers';

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
  value: any | any[],
  expectedValue: any,
  ignoreMilliseconds = false,
  adapterToUse: AdapterClassToUse | null = null,
) {
  if (Array.isArray(value)) {
    value.forEach((positionValue, index) => {
      if (ignoreMilliseconds && adapterToUse) {
        // expect(adapterToUse.setMilliseconds(positionValue, 0)).to.deep.equal(expectedValue[index]);
        expect(positionValue).to.deep.equal(expectedValue[index]);
      } else {
        expect(positionValue).to.deep.equal(expectedValue[index]);
      }
    });
  } else if (ignoreMilliseconds && adapterToUse) {
    // expect(adapterToUse.setMilliseconds(value, 0)).to.deep.equal(expectedValue);
    expect(value).to.deep.equal(expectedValue);
  } else {
    expect(value).to.deep.equal(expectedValue);
  }
}
