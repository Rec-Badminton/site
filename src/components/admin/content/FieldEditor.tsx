import { useState, type ChangeEvent, type ReactNode } from 'react';
import { useI18n } from '@mxreakit/i18n';
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from 'lucide-react';
import {
  ColorInput,
  FileInput,
  ImageInput,
  LocalizedInput,
  MultiSelect,
  NumberInput
} from '@/components/admin/content/inputs';
import {
  isWide,
  resolveOptions,
  type DraftObject,
  type DraftValue,
  type Field,
  type FieldContext,
  type ListField,
  type Option
} from '@/components/admin/content/schema';
import type { Localized } from '@/core/content/types';
import { cn } from '@/core/utils';

type ChangeHandler = (value: DraftValue, siblings?: DraftObject) => void;

interface ControlProps {
  field: Field;
  id: string;
  value: DraftValue;
  context: FieldContext;
  onChange: ChangeHandler;
}

// The input matching a field type, without its label.
const FieldControl = ({ field, id, value, context, onChange }: ControlProps) => {
  const { t } = useI18n();
  const text: string = (value as string) ?? '';
  const onText = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    onChange(event.target.value);

  switch (field.type) {
    case 'text':
    case 'url':
    case 'email':
    case 'time':
      return (
        <input id={id} type={field.type} value={text} onChange={onText} className="field-input" />
      );
    case 'textarea':
      return (
        <textarea
          id={id}
          rows={4}
          value={text}
          onChange={onText}
          className="field-input min-h-28 resize-y"
        />
      );
    case 'color':
      return <ColorInput id={id} value={text} onChange={onChange} />;
    case 'number':
      return <NumberInput id={id} value={value as number} step={field.step} onChange={onChange} />;
    case 'boolean':
      return (
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.checked)}
          className="size-5 shrink-0 cursor-pointer accent-brand"
        />
      );
    case 'localized':
      return (
        <LocalizedInput
          id={id}
          value={value as Localized}
          multiline={field.multiline}
          onChange={onChange}
        />
      );
    case 'select': {
      const options: Option[] = resolveOptions(field.options, context);
      const known: boolean = options.some((option: Option) => option.value === text);
      return (
        <select id={id} value={text} onChange={onText} className="field-input">
          {!known && <option value={text}>{t('admin.select.missing')}</option>}
          {options.map((option: Option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    case 'multiselect':
      return (
        <MultiSelect
          value={value as string[]}
          options={resolveOptions(field.options, context)}
          onChange={onChange}
        />
      );
    case 'image':
      return (
        <ImageInput value={value as string | File} measure={field.measure} onChange={onChange} />
      );
    case 'file':
      return <FileInput value={value as string | File} accept={field.accept} onChange={onChange} />;
    case 'group':
      return (
        <GroupEditor
          fields={field.fields}
          id={id}
          value={(value as DraftObject) ?? {}}
          context={context}
          onChange={onChange}
        />
      );
    case 'list':
      return (
        <ListEditor
          field={field}
          id={id}
          value={(value as DraftObject[]) ?? []}
          context={context}
          onChange={onChange}
        />
      );
  }
};

const Help = ({ field }: { field: Field }) => {
  const { t } = useI18n();
  if (!field.help) return null;
  return <p className="mt-1.5 text-sm text-muted">{t(field.help)}</p>;
};

// A field with its label and help.
const FieldEditor = (props: ControlProps) => {
  const { t } = useI18n();
  const { field, id } = props;

  if (field.type === 'boolean') {
    return (
      <div>
        <label htmlFor={id} className="flex cursor-pointer items-center gap-3 font-semibold">
          <FieldControl {...props} />
          {t(field.label)}
        </label>
        <Help field={field} />
      </div>
    );
  }
  if (field.type === 'group' || field.type === 'list') {
    return (
      <fieldset className="min-w-0 border-2 border-line bg-white p-4 md:p-5">
        <legend className="field-label bg-white px-2">{t(field.label)}</legend>
        <Help field={field} />
        <div className={cn(field.help && 'mt-4')}>
          <FieldControl {...props} />
        </div>
      </fieldset>
    );
  }
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {t(field.label)}
      </label>
      <FieldControl {...props} />
      <Help field={field} />
    </div>
  );
};

interface GroupEditorProps {
  fields: Field[];
  id: string;
  value: DraftObject;
  context: FieldContext;
  onChange: (value: DraftObject) => void;
}

// Fields of one object in a two-column grid; wide fields span the whole row.
export const GroupEditor = ({ fields, id, value, context, onChange }: GroupEditorProps) => (
  <div className="grid gap-5 md:grid-cols-2">
    {fields.map((field: Field) => (
      <div key={field.key} className={cn('min-w-0', isWide(field) && 'md:col-span-2')}>
        <FieldEditor
          field={field}
          id={`${id}-${field.key}`}
          value={value[field.key]}
          context={context}
          onChange={(next: DraftValue, siblings?: DraftObject) =>
            onChange({ ...value, ...siblings, [field.key]: next })
          }
        />
      </div>
    ))}
  </div>
);

const ICON_BUTTON: string =
  'flex size-9 shrink-0 items-center justify-center text-ink transition-colors hover:bg-brand hover:text-white disabled:pointer-events-none disabled:opacity-30';

interface ItemActionsProps {
  index: number;
  count: number;
  onMove: (index: number, offset: number) => void;
  onRemove: (index: number) => void;
}

const ItemActions = ({ index, count, onMove, onRemove }: ItemActionsProps) => {
  const { t } = useI18n();
  return (
    <div className="flex shrink-0">
      <button
        type="button"
        onClick={() => onMove(index, -1)}
        disabled={index === 0}
        aria-label={t('admin.list.moveUp')}
        title={t('admin.list.moveUp')}
        className={ICON_BUTTON}
      >
        <ArrowUp className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onMove(index, 1)}
        disabled={index === count - 1}
        aria-label={t('admin.list.moveDown')}
        title={t('admin.list.moveDown')}
        className={ICON_BUTTON}
      >
        <ArrowDown className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onRemove(index)}
        aria-label={t('admin.list.remove')}
        title={t('admin.list.remove')}
        className={ICON_BUTTON}
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
};

// a few columns fit in one table cell, longer texts need room
const CELL_WIDTH: Partial<Record<Field['type'], string>> = {
  number: 'w-20 min-w-16',
  time: 'w-32',
  boolean: 'w-12',
  select: 'min-w-36',
  text: 'min-w-44',
  url: 'min-w-56'
};

interface ListEditorProps {
  field: ListField;
  id: string;
  value: DraftObject[];
  context: FieldContext;
  onChange: (value: DraftObject[]) => void;
}

const TableList = ({
  field,
  id,
  value,
  context,
  onChange,
  actions
}: ListEditorProps & { actions: (index: number) => ReactNode }) => {
  const { t } = useI18n();
  const update = (index: number, key: string, next: DraftValue) =>
    onChange(
      value.map((item: DraftObject, at: number) => (at === index ? { ...item, [key]: next } : item))
    );

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr>
            {field.fields.map((column: Field) => (
              <th
                key={column.key}
                scope="col"
                className="px-1 pb-2 font-display text-sm font-bold tracking-wide whitespace-nowrap uppercase"
              >
                {t(column.label)}
              </th>
            ))}
            <th scope="col" className="sr-only">
              {t('admin.list.actions')}
            </th>
          </tr>
        </thead>
        <tbody>
          {value.map((item: DraftObject, index: number) => (
            <tr key={index} className="border-t border-line">
              {field.fields.map((column: Field) => (
                <td
                  key={column.key}
                  className={cn('px-1 py-1.5 align-middle', CELL_WIDTH[column.type])}
                >
                  <label htmlFor={`${id}-${index}-${column.key}`} className="sr-only">
                    {t(column.label)}
                  </label>
                  <FieldControl
                    field={column}
                    id={`${id}-${index}-${column.key}`}
                    value={item[column.key]}
                    context={context}
                    onChange={(next: DraftValue) => update(index, column.key, next)}
                  />
                </td>
              ))}
              <td className="py-1.5 pl-1">{actions(index)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ListEditor = ({ field, id, value, context, onChange }: ListEditorProps) => {
  const { t } = useI18n();
  // indexes of the unfolded cards
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (index: number) =>
    setOpen((current: Set<number>) => {
      const next: Set<number> = new Set(current);
      if (!next.delete(index)) next.add(index);
      return next;
    });

  const move = (index: number, offset: number) => {
    const target: number = index + offset;
    const next: DraftObject[] = [...value];
    const moved: DraftObject | undefined = next.splice(index, 1)[0];
    if (!moved) return;
    next.splice(target, 0, moved);
    onChange(next);
    setOpen((current: Set<number>) => {
      const swapped: Set<number> = new Set(current);
      swapped.delete(index);
      swapped.delete(target);
      if (current.has(index)) swapped.add(target);
      if (current.has(target)) swapped.add(index);
      return swapped;
    });
  };

  const remove = (index: number) => {
    onChange(value.filter((_item: DraftObject, at: number) => at !== index));
    setOpen(
      (current: Set<number>) =>
        new Set(
          [...current]
            .filter((at: number) => at !== index)
            .map((at: number) => (at > index ? at - 1 : at))
        )
    );
  };

  const add = () => {
    onChange([...value, field.create()]);
    setOpen((current: Set<number>) => new Set(current).add(value.length));
  };

  const actions = (index: number) => (
    <ItemActions index={index} count={value.length} onMove={move} onRemove={remove} />
  );

  return (
    <div className="flex flex-col gap-2">
      {field.layout === 'table' ? (
        value.length > 0 && (
          <TableList
            field={field}
            id={id}
            value={value}
            context={context}
            onChange={onChange}
            actions={actions}
          />
        )
      ) : (
        <ul className="flex flex-col gap-1.5">
          {value.map((item: DraftObject, index: number) => {
            const expanded: boolean = open.has(index);
            const summary: string =
              field.summary?.(item, context) || t('admin.list.item', String(index + 1));
            return (
              <li
                key={index}
                className={cn('bg-sand', expanded && 'shadow-[inset_4px_0_0_var(--color-brand)]')}
              >
                <div className="flex items-center gap-2 pr-1">
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={expanded}
                    aria-controls={`${id}-${index}`}
                    className="flex min-w-0 grow items-center gap-3 px-4 py-3 text-left font-semibold hover:text-brand"
                  >
                    <ChevronDown
                      className={cn(
                        'size-5 shrink-0 transition-transform',
                        expanded && 'rotate-180'
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate">{summary}</span>
                  </button>
                  {actions(index)}
                </div>
                {expanded && (
                  <div id={`${id}-${index}`} className="px-4 pt-1 pb-5">
                    <GroupEditor
                      fields={field.fields}
                      id={`${id}-${index}`}
                      value={item}
                      context={context}
                      onChange={(next: DraftObject) =>
                        onChange(
                          value.map((current: DraftObject, at: number) =>
                            at === index ? next : current
                          )
                        )
                      }
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <button
        type="button"
        onClick={add}
        className="btn btn-dark min-h-10 self-start px-4 py-1.5 text-lg"
      >
        <Plus className="size-[1.1em] shrink-0" aria-hidden="true" />
        {t('admin.list.add')}
      </button>
    </div>
  );
};

export default FieldEditor;
