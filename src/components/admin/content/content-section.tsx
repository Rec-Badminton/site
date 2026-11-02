import type { ComponentType } from 'react';
import ContentEditor from '@/components/admin/content/ContentEditor';
import type { Field } from '@/components/admin/content/schema';
import type { ContentId } from '@/core/content/types';

// Back office page editing one content document with the given form.
export function contentSection(id: ContentId, fields: Field[]): ComponentType {
  const Section = () => <ContentEditor id={id} fields={fields} />;
  Section.displayName = `ContentSection(${id})`;
  return Section;
}
