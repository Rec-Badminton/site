// Pure part of the revision history, kept apart from the Firebase SDK.

export interface KeptFiles {
  id: string;
  files: string[];
}

export interface PrunePlan {
  pruned: string[];
  // files neither the current content nor a kept revision points at anymore
  orphans: string[];
}

// Keeps the newest revisions, given newest first; the first holds the current content.
export function planPrune(revisions: KeptFiles[], discarded: string[], max: number): PrunePlan {
  const kept: KeptFiles[] = revisions.slice(0, max);
  const pruned: KeptFiles[] = revisions.slice(max);
  const keptFiles: Set<string> = new Set(kept.flatMap((revision: KeptFiles) => revision.files));
  const candidates: Set<string> = new Set([
    ...discarded,
    ...pruned.flatMap((revision: KeptFiles) => revision.files)
  ]);
  return {
    pruned: pruned.map((revision: KeptFiles) => revision.id),
    orphans: [...candidates].filter((path: string) => !keptFiles.has(path))
  };
}
