export const average = (values) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

export const variance = (values) => {
  if (!values.length) return 0;
  const mean = average(values);
  return average(values.map((value) => (value - mean) ** 2));
};

