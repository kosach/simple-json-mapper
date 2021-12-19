type KeyValue = { [key: string]: any };
type MapperValue =
  | { src?: string }
  | { defaultValue: any }
  | { transform: (get: (path: string) => any, sourceObject: KeyValue) => any };
interface Mapper {
  [key: string]: string | MapperValue;
}

const isObject = (obj: any): boolean => obj && typeof obj === 'object' && !Array.isArray(obj);

function get(obj: { [key: string]: any }, path: string): any {
  if (!isObject(obj)) return false;
  const result = path
    .split('.')
    .reduce((accumulator: { [key: string]: any } | string, currentVal: keyof typeof obj): object | string => {
      if (typeof accumulator === 'object') {
        return accumulator[currentVal];
      }
      return accumulator;
    }, obj);
  return result;
}

function set(obj: KeyValue, path: string | string[], value: any) {
  if (!isObject(obj)) return false;
  if (!Array.isArray(path)) path = path.split('.');
  const reducedArr = path.slice(0, -1).reduce((a: KeyValue, c: string, i: number) => {
    if (isObject(a[c])) {
      return a[c];
    }
    return (a[c] = Number.isInteger(+path[i + 1]) ? [] : {});
  }, obj);
  reducedArr[path[path.length - 1]] = value;
  return reducedArr;
}

export function mapper(sourceObject: KeyValue, mapObject: Mapper) {
  const result = {};
  Object.keys(mapObject).forEach((path) => {
    if (isObject(mapObject[path])) {
      const mapVal = mapObject[path] as MapperValue;
      if ('src' in mapVal && mapVal.src) {
        const srcVal = get(sourceObject, mapVal.src);
        set(result, path, srcVal);
      }
      if ('defaultValue' in mapVal && (mapVal.defaultValue === '' || mapVal.defaultValue)) {
        set(result, path, mapVal.defaultValue);
      }
      if ('transform' in mapVal) {
        set(result, path, mapVal.transform(get.bind(null, sourceObject), JSON.parse(JSON.stringify(sourceObject))));
      }
    } else if (typeof mapObject[path] === 'string') {
      set(result, path, get(sourceObject, <string>mapObject[path]));
    }
  });
  return result;
}
