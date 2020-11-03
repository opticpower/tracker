export const isSameObj = (obj1, obj2): boolean => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  if (obj1Keys.length !== obj2Keys.length) return false;

  for (const key of obj1Keys) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
};

export const getDiff = (arr1, arr2) => {
  return arr1.filter(x => !arr2.map(r => r.id).includes(x.id));
};
