import { type ConditionalDisplayProperty } from 'twenty-shared/types';

export type UniversalConditionalDisplayPropertyName<
  TProperty extends ConditionalDisplayProperty,
> = `universal${Capitalize<TProperty>}`;
