import { describe, expect, it } from 'vitest';
import { planPrune, type KeptFiles } from '@/core/admin/revision-prune';

// newest first, as Firestore lists them
const REVISIONS: KeptFiles[] = [
  { id: 'r3', files: ['images/photos/c.webp', 'files/settings/booklet.pdf'] },
  { id: 'r2', files: ['images/photos/b.webp', 'files/settings/booklet.pdf'] },
  { id: 'r1', files: ['images/photos/a.webp', 'files/settings/booklet.pdf'] }
];

describe('planPrune', () => {
  it('keeps every revision and file within the limit', () => {
    expect(planPrune(REVISIONS, ['images/photos/b.webp'], 3)).toEqual({ pruned: [], orphans: [] });
  });

  it('drops the oldest revisions and the files only they used', () => {
    expect(planPrune(REVISIONS, [], 2)).toEqual({
      pruned: ['r1'],
      orphans: ['images/photos/a.webp']
    });
  });

  it('deletes a discarded file only once no kept revision points at it', () => {
    expect(planPrune(REVISIONS, ['images/photos/z.webp', 'images/photos/c.webp'], 3)).toEqual({
      pruned: [],
      orphans: ['images/photos/z.webp']
    });
  });
});
