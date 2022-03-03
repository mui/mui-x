export function getValueFromOption(option) {
  if (typeof option === 'object' && option !== null) {
    return option.value;
  }
  return option;
}

export function getValueFromValueOptions(value, valueOptions) {
  if (valueOptions === undefined) {
    return undefined;
  }
  const result = valueOptions.find((option) => {
    const optionValue = getValueFromOption(option);
    return String(optionValue) === String(value);
  });
  return getValueFromOption(result);
}
