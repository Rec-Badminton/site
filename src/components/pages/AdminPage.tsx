import { useEffect, type ReactNode } from 'react';
import { I18nProvider, useI18n, type I18nTranslations } from '@mxreakit/i18n';
import { LogIn, LogOut } from 'lucide-react';
import type { User } from 'firebase/auth';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminHeaderActions from '@/components/admin/AdminHeaderActions';
import AdminDashboard from '@/components/admin/AdminDashboard';
import Toaster from '@/components/admin/Toaster';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { useAuthUser, useIsAdmin, useSignIn, useSignOut } from '@/hooks/use-auth';
import { useDataToast } from '@/hooks/use-data-toast';
import { Constants } from '@/core/constants';
import { admin } from '@/core/i18n/admin';
import { fr } from '@/core/i18n/fr';

// the back office is French only, whatever the visitor language
const ADMIN_TRANSLATIONS: I18nTranslations = {
  fr: { ...fr, ...admin },
  en: { ...fr, ...admin }
};

const Panel = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="mx-auto flex max-w-lg flex-col items-center gap-6 bg-white p-10 text-center">
    <h1 className="section-title">{title}</h1>
    {children}
  </div>
);

const LoginPanel = () => {
  const { t } = useI18n();
  const { mutate: signIn, isPending } = useSignIn();

  return (
    <Panel title={t('admin.login.title')}>
      <p className="text-muted">{t('admin.login.description')}</p>
      <button
        type="button"
        onClick={() => signIn()}
        disabled={isPending}
        className="btn btn-primary disabled:opacity-60"
      >
        <LogIn className="size-[1.1em] shrink-0" aria-hidden="true" />
        {t('admin.login.google')}
      </button>
    </Panel>
  );
};

const ForbiddenPanel = ({ email }: { email: string | null }) => {
  const { t } = useI18n();
  const { mutate: signOut } = useSignOut();

  return (
    <Panel title={t('admin.forbidden.title')}>
      <p className="text-muted">{t('admin.forbidden.description', email ?? '')}</p>
      <button type="button" onClick={() => signOut()} className="btn btn-dark">
        <LogOut className="size-[1.1em] shrink-0" aria-hidden="true" />
        {t('admin.signOut')}
      </button>
    </Panel>
  );
};

interface AdminContentProps {
  // undefined while the session is being restored
  user: User | null | undefined;
  isAdmin: boolean | undefined;
  isPending: boolean;
}

const AdminContent = ({ user, isAdmin, isPending }: AdminContentProps) => {
  const { t } = useI18n();

  if (user === undefined || (user && isPending)) {
    return <p className="text-center text-muted">{t('admin.loading')}</p>;
  }
  if (!user) return <LoginPanel />;
  if (!isAdmin) return <ForbiddenPanel email={user.email} />;
  return <AdminDashboard />;
};

// UX gate only: access control is enforced by the Firestore and Storage rules.
const AdminShell = () => {
  const { t } = useI18n();
  const user: User | null | undefined = useAuthUser();
  const { data: isAdmin, isPending } = useIsAdmin(user);
  useDataToast();

  useEffect(() => {
    document.title = `${Constants.COMPANY_NAME} - ${t('admin.title')}`;
  }, [t]);

  return (
    <div data-admin className="flex min-h-screen w-screen flex-col bg-sand">
      <meta name="robots" content="noindex" />
      <AdminHeader actions={user && isAdmin && <AdminHeaderActions email={user.email} />} />
      <main className="container-site grow py-10">
        <AdminContent user={user} isAdmin={isAdmin} isPending={isPending} />
      </main>
      <Toaster />
      <ConfirmDialog />
    </div>
  );
};

const AdminPage = () => (
  <I18nProvider translations={ADMIN_TRANSLATIONS} defaultLanguage="fr">
    <AdminShell />
  </I18nProvider>
);

export default AdminPage;
