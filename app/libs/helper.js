const _ = require('lodash');

const filterEmptyString = arr => arr.filter(x => x.trim()).map(x => x.trim());
const isBlank = str => !_.isString(str) || !_.isEmpty();

const splitMetaItem = item => {
  if (isBlank(item)) {
    return item;
  }

  let result = item.trim();
  const index = item.indexOf(':');
  if (index === -1) {
    throw new Error('Illegal metaitem');
  }

  const first = item.substring(0, index);
  const second = index === item.length ? undefined : item.substring(index + 1);

  return [first, second];
};

module.exports = { filterEmptyString, splitMetaItem };
