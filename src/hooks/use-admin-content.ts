import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useI18n } from '@mxreakit/i18n';
import { SITE_CONTENT_KEY } from '@/hooks/use-site-content';
import { toast } from '@/hooks/use-toast';
import { getContent } from '@/core/admin/content';
import { saveSection } from '@/core/admin/revisions';
import type { ContentId, SiteContent } from '@/core/content/types';

interface SaveVariables<Id extends ContentId> {
  draft: SiteContent[Id];
  previous: SiteContent[Id];
}

export const REVISIONS_KEY: string[] = ['admin', 'revisions'];

const adminContentKey = (id: ContentId): string[] => ['admin', 'content', id];

// no background refetch: it would replace the document under an edit in progress
const useAdminContent = <Id extends ContentId>(id: Id) =>
  useQuery({ queryKey: adminContentKey(id), queryFn: () => getContent(id), staleTime: Infinity });

// Toasts a change that went through but left no revision behind.
const useRevisionWarning = () => {
  const { t } = useI18n();
  return (recorded: boolean) => {
    if (recorded) return;
    toast({
      id: 'admin.revisions.recordFailed',
      title: t('admin.revisions.recordFailed'),
      variant: 'error'
    });
  };
};

// Refreshes the edited document, the history and the public content the site renders.
const useSaveContent = <Id extends ContentId>(id: Id) => {
  const queryClient: QueryClient = useQueryClient();
  const warn = useRevisionWarning();

  return useMutation({
    mutationFn: ({ draft, previous }: SaveVariables<Id>) => saveSection(id, draft, previous),
    onSuccess: (recorded: boolean) => {
      warn(recorded);
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: adminContentKey(id) }),
        queryClient.invalidateQueries({ queryKey: REVISIONS_KEY }),
        queryClient.invalidateQueries({ queryKey: SITE_CONTENT_KEY })
      ]);
    },
    meta: { successKey: 'admin.toasts.saved' }
  });
};

export { useAdminContent, useRevisionWarning, useSaveContent };
