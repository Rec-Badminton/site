import { Link } from 'react-router-dom';
import { useI18n } from '@mxreakit/i18n';
import SectionHeader from '@/components/admin/SectionHeader';
import ArrowLabel from '@/components/ui/ArrowLabel';
import { ADMIN_SECTIONS, adminPath, type AdminSection } from '@/components/admin/sections';

const AdminOverview = () => {
  const { t } = useI18n();

  return (
    <>
      <SectionHeader title={t('admin.overview.title')} description={t('admin.overview.text')} />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {ADMIN_SECTIONS.map(({ path, icon: Icon }: AdminSection) => (
          <li key={path}>
            <Link
              to={adminPath(path)}
              className="group flex h-full flex-col gap-3 bg-white p-6 transition-colors hover:bg-brand hover:text-white"
            >
              <Icon className="size-8 text-brand group-hover:text-white" aria-hidden="true" />
              <ArrowLabel className="display-title text-3xl">
                {t(`admin.sections.${path}.label`)}
              </ArrowLabel>
              <p className="text-muted group-hover:text-white">
                {t(`admin.sections.${path}.description`)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default AdminOverview;
