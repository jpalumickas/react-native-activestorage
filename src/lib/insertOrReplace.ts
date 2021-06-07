type Item = { [key: string]: any };

const insertOrReplace = <T extends Item>(list: T[], obj: T, key = 'id') => {
  const newList = [...list];
  const index = newList.findIndex((it) => it[key] === obj[key]);

  if (index >= 0) {
    newList[index] = obj;
  } else {
    newList.push(obj);
  }

  return newList;
};
export default insertOrReplace;
