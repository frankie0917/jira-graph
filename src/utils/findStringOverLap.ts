export const findStringOverlap = (a: string, b: string): string => {
  if (b.length === 0) {
    return '';
  }

  if (a.endsWith(b)) {
    return b;
  }

  if (a.indexOf(b) >= 0) {
    return b;
  }

  return findStringOverlap(a, b.substring(0, b.length - 1));
};
