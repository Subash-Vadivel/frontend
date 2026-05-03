export const customFieldValueToPlainValue = (value) => {
  if (!value) return '';
  if (value.fieldType === 'NUMBER') return value.valueNumber ?? '';
  if (value.fieldType === 'BOOLEAN') return Boolean(value.valueBoolean);
  return value.valueString ?? '';
};

export const customValuesArrayToMap = (values = []) =>
  values.reduce((acc, value) => {
    acc[value.fieldId] = customFieldValueToPlainValue(value);
    return acc;
  }, {});

export const customValuesMapToPayload = (category, valuesMap) =>
  (category?.customFields || [])
    .map((field) => ({
      fieldId: field.id,
      value: field.type === 'BOOLEAN' ? Boolean(valuesMap[field.id]) : valuesMap[field.id],
    }))
    .filter((item) => item.value !== '' && item.value !== null && item.value !== undefined);

export const valueForDisplay = (value) => {
  if (!value) return '-';
  if (value.fieldType === 'NUMBER') return value.valueNumber ?? '-';
  if (value.fieldType === 'BOOLEAN') return value.valueBoolean ? 'True' : 'False';
  return value.valueString || '-';
};
