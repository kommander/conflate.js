/**
 * Conflate
 */

function applyConversion(key, value, conversions, whitelist, ignoreKeys) {
  if (!conversions.length) return value;
  for (let i = 0; i < conversions.length; i++) {
    value = conversions[i](key, value, whitelist, ignoreKeys); // eslint-disable-line
  }
  return value;
}

function merge(obj1, obj2, conversions, whitelist, ignoreKeys) {
  if (typeof obj2 !== 'object' || !obj2) {
    return;
  }

  const keys = Object.keys(obj2);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (whitelist.length && whitelist.indexOf(k) === -1) {
      continue;
    }
    if (ignoreKeys.indexOf(k) === -1) {
      // Merge array values
      if (Array.isArray(obj1[k]) && Array.isArray(obj2[k])) {
        for (let u = 0; u < obj2[k].length; u++) {
          if (obj1[k].indexOf(obj2[k][u]) === -1) {
            obj1[k].push(obj2[k][u]);
          }
        }
        return;
      }

      if (typeof obj1[k] === 'object' && Array.isArray(obj2[k])) {
        obj1[k] = obj2[k]; // eslint-disable-line
        return;
      }

      if (typeof obj2[k] === 'object' && obj2[k] !== null) {
        if (!obj1[k] || typeof obj1[k] !== 'object') {
          obj1[k] = applyConversion(k, obj2[k], conversions, ignoreKeys); // eslint-disable-line
        } else {
          merge(obj1[k], obj2[k], conversions, whitelist, ignoreKeys);
        }
      } else {
        obj1[k] = applyConversion(k, obj2[k], conversions, ignoreKeys); //eslint-disable-line
      }
    }
  }
}

module.exports = function conflate(...rest) {
  const objects = [];
  const conversions = [];
  const ignoreKeys = [];
  const whitelist = [];

  for (let i = 0; i < rest.length; i++) {
    if (Array.isArray(rest[i])) {
      Array.prototype.push.apply(ignoreKeys, rest[i]);
    } else if (typeof rest[i] === 'string') {
      Array.prototype.push.apply(whitelist, rest[i]
        .split(',').map((val) => val.trim()));
    } else if (typeof rest[i] === 'function') {
      conversions.push(rest[i]);
      continue;
    } else {
      objects.push(rest[i]);
    }
  }

  if (objects.length < 2) {
    throw new Error('Need at least two objects to conflate.');
  }

  for (let i = 1; i < objects.length; i++) {
    merge(objects[0], objects[i], conversions, whitelist, ignoreKeys);
  }

  return objects[0];
};
