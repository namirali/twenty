import { isPlainObject } from '@/utils/typeguard/isPlainObject';

export const getLegacyWidgetJsonLogicSingleEntry = (
  node: unknown,
): [string, unknown] | undefined => {
  if (!isPlainObject(node)) {
    return undefined;
  }

  const [entry, ...otherEntries] = Object.entries(node);

  return otherEntries.length === 0 ? entry : undefined;
};
