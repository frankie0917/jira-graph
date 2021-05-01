export const parseNumber = (str: string, fallback: number) => {
  const num = Number(str);
  return isNaN(num) ? fallback : num;
};
