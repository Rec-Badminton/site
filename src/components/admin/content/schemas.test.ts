import { describe, expect, it } from 'vitest';
import * as schemas from '@/components/admin/content/schemas';
import type { Field } from '@/components/admin/content/schema';
import { ADMIN_SECTIONS, type AdminSection } from '@/components/admin/sections';
import { admin } from '@/core/i18n/admin';
import { fr } from '@/core/i18n/fr';
import { EMPTY_CONTENT } from '@/core/content/empty';

const ADMIN_COPY: Record<string, string> = { ...fr, ...admin };

const FORMS: Record<string, Field[]> = {
  settings: schemas.settingsFields,
  banner: schemas.bannerFields,
  memberships: schemas.membershipsFields,
  schedule: schemas.scheduleFields,
  venues: schemas.venuesFields,
  shop: schemas.shopContentFields,
  partners: schemas.partnersFields,
  photos: schemas.photosFields,
  competition: schemas.competitionFields,
  pages: schemas.pagesFields
};

function flatten(fields: Field[]): Field[] {
  return fields.flatMap((field: Field) =>
    field.type === 'group' || field.type === 'list' ? [field, ...flatten(field.fields)] : [field]
  );
}

describe('back office forms', () => {
  it('have copy for every label and help', () => {
    const keys: string[] = Object.values(FORMS)
      .flatMap(flatten)
      .flatMap((field: Field) => [field.label, field.help])
      .filter((key: string | undefined): key is string => !!key);
    expect(keys.filter((key: string) => !(key in ADMIN_COPY))).toEqual([]);
  });

  it('edit every field of their document', () => {
    for (const [id, fields] of Object.entries(FORMS)) {
      const editable: string[] = fields.map((field: Field) => field.key).sort();
      expect(editable, id).toEqual(
        Object.keys(EMPTY_CONTENT[id as keyof typeof EMPTY_CONTENT]).sort()
      );
    }
  });

  it('create list items with the keys their fields edit', () => {
    for (const field of Object.values(FORMS).flatMap(flatten)) {
      if (field.type !== 'list') continue;
      const created: string[] = Object.keys(field.create());
      const missing: string[] = field.fields
        .map((child: Field) => child.key)
        .filter((key: string) => !created.includes(key));
      expect(missing, field.label).toEqual([]);
    }
  });
});

describe('back office sections', () => {
  it('have a label and a description', () => {
    const keys: string[] = ADMIN_SECTIONS.flatMap(({ path }: AdminSection) => [
      `admin.sections.${path}.label`,
      `admin.sections.${path}.description`
    ]);
    expect(keys.filter((key: string) => !(key in admin))).toEqual([]);
  });
});
