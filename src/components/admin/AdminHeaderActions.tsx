import { useI18n } from '@mxreakit/i18n';
import { LogOut } from 'lucide-react';
import { useSignOut } from '@/hooks/use-auth';
import { confirmDiscard } from '@/hooks/use-unsaved-changes';

interface AdminHeaderActionsProps {
  email: string | null;
}

const ACTION_CLASS: string = 'btn min-h-10 px-4 py-1.5 text-lg';

const AdminHeaderActions = ({ email }: AdminHeaderActionsProps) => {
  const { t } = useI18n();
  const { mutate: signOut } = useSignOut();

  return (
    <>
      <span className="mr-2 hidden text-sm text-muted-light md:inline">{email}</span>
      <button
        type="button"
        onClick={async () => (await confirmDiscard()) && signOut()}
        className={`${ACTION_CLASS} btn-primary`}
      >
        <LogOut className="size-[1.1em] shrink-0" aria-hidden="true" />
        <span className="max-sm:sr-only">{t('admin.signOut')}</span>
      </button>
    </>
  );
};

export default AdminHeaderActions;
