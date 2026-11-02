import { useState, type FormEvent } from 'react';
import { useI18n } from '@mxreakit/i18n';
import QueryState from '@/components/admin/QueryState';
import SaveBar from '@/components/admin/SaveBar';
import SectionHeader from '@/components/admin/SectionHeader';
import { GroupEditor } from '@/components/admin/content/FieldEditor';
import type { DraftObject, Field, FieldContext } from '@/components/admin/content/schema';
import { useAdminContent, useSaveContent } from '@/hooks/use-admin-content';
import { useSiteContent } from '@/hooks/use-site-content';
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes';
import { isEqual } from '@/core/admin/draft';
import type { ContentId, SiteContent, SiteData } from '@/core/content/types';

interface ContentEditorProps<Id extends ContentId> {
  id: Id;
  fields: Field[];
}

interface ContentFormProps<Id extends ContentId> extends ContentEditorProps<Id> {
  saved: SiteContent[Id];
}

const ContentForm = <Id extends ContentId>({ id, fields, saved }: ContentFormProps<Id>) => {
  const { t } = useI18n();
  const content: SiteData = useSiteContent();
  const [base, setBase] = useState<SiteContent[Id]>(saved);
  const [draft, setDraft] = useState<SiteContent[Id]>(saved);
  const { mutate: save, isPending } = useSaveContent(id);

  // a successful save refetches the document: start over from it
  if (saved !== base) {
    setBase(saved);
    setDraft(saved);
  }

  const dirty: boolean = !isEqual(draft, base);
  useUnsavedChanges(dirty);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    save({ draft, previous: base });
  };

  const context: FieldContext = { content, draft: draft as unknown as DraftObject, t };

  return (
    <form onSubmit={submit} className="flex flex-col">
      <SectionHeader
        title={t(`admin.sections.${id}.label`)}
        description={t(`admin.sections.${id}.description`)}
      />
      <GroupEditor
        fields={fields}
        id={id}
        value={draft as unknown as DraftObject}
        context={context}
        onChange={(next: DraftObject) => setDraft(next as unknown as SiteContent[Id])}
      />

      <SaveBar dirty={dirty} isPending={isPending} onReset={() => setDraft(base)} />
    </form>
  );
};

// Edits one content document from its field schema.
const ContentEditor = <Id extends ContentId>({ id, fields }: ContentEditorProps<Id>) => (
  <QueryState query={useAdminContent(id)}>
    {(saved: SiteContent[Id]) => <ContentForm id={id} fields={fields} saved={saved} />}
  </QueryState>
);

export default ContentEditor;
