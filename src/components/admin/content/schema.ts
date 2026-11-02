import type { I18nFunctionString } from '@mxreakit/i18n';
import type { SiteData } from '@/core/content/types';

// A draft value: the document shape, where picked files wait in place of their URL.
export type DraftValue = unknown;
export type DraftObject = Record<string, DraftValue>;

export interface FieldContext {
  // saved site content and synced documents, for options taken from another document
  content: SiteData;
  // document being edited, for options taken from the document itself
  draft: DraftObject;
  t: I18nFunctionString;
}

export interface Option {
  value: string;
  label: string;
}

type Options = Option[] | ((context: FieldContext) => Option[]);

interface BaseField {
  key: string;
  // translation keys
  label: string;
  help?: string;
}

interface InputField extends BaseField {
  type: 'text' | 'textarea' | 'url' | 'email' | 'time' | 'color';
}

interface LocalizedField extends BaseField {
  type: 'localized';
  multiline?: boolean;
}

interface NumberField extends BaseField {
  type: 'number';
  step?: number;
}

interface BooleanField extends BaseField {
  type: 'boolean';
}

interface SelectField extends BaseField {
  type: 'select' | 'multiselect';
  options: Options;
}

interface ImageField extends BaseField {
  type: 'image';
  // also store the picked image size in the sibling width and height fields
  measure?: boolean;
}

interface FileField extends BaseField {
  type: 'file';
  accept: string;
}

export interface GroupField extends BaseField {
  type: 'group';
  fields: Field[];
}

export interface ListField extends BaseField {
  type: 'list';
  fields: Field[];
  // one line describing an item in the collapsed card
  summary?: (item: DraftObject, context: FieldContext) => string;
  create: () => DraftObject;
  // table rows suit items made of a few short fields
  layout?: 'cards' | 'table';
}

export type Field =
  | InputField
  | LocalizedField
  | NumberField
  | BooleanField
  | SelectField
  | ImageField
  | FileField
  | GroupField
  | ListField;

export function resolveOptions(options: Options, context: FieldContext): Option[] {
  return typeof options === 'function' ? options(context) : options;
}

// Takes the full form width rather than one column.
export function isWide(field: Field): boolean {
  return ['localized', 'textarea', 'multiselect', 'group', 'list'].includes(field.type);
}
