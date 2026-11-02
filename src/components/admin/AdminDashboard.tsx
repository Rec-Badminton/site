import type { MouseEvent } from 'react';
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
  type NavigateFunction
} from 'react-router-dom';
import { useI18n } from '@mxreakit/i18n';
import { House, type LucideIcon } from 'lucide-react';
import AdminOverview from '@/components/admin/AdminOverview';
import { ADMIN_SECTIONS, adminPath, type AdminSection } from '@/components/admin/sections';
import { guardNavigation } from '@/hooks/use-unsaved-changes';
import { Constants } from '@/core/constants';
import { cn } from '@/core/utils';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const navLinkClassName = ({ isActive }: { isActive: boolean }): string =>
  cn(
    'flex shrink-0 items-center gap-3 px-4 py-2.5 font-display text-lg font-bold tracking-wide uppercase transition-colors',
    isActive ? 'bg-brand text-white' : 'text-ink hover:bg-white'
  );

const AdminNav = () => {
  const { t } = useI18n();
  const navigate: NavigateFunction = useNavigate();
  const toItem = ({ path, icon }: AdminSection): NavItem => ({
    to: adminPath(path),
    label: t(`admin.sections.${path}.label`),
    icon
  });
  const groups: NavItem[][] = [
    [
      { to: Constants.ROUTE_ADMIN, label: t('admin.overview.label'), icon: House },
      ...ADMIN_SECTIONS.filter((section: AdminSection) => section.group === 'tools').map(toItem)
    ],
    ADMIN_SECTIONS.filter((section: AdminSection) => section.group === 'content').map(toItem)
  ];

  return (
    <nav
      aria-label={t('admin.nav')}
      className="flex gap-1 overflow-x-auto lg:sticky lg:top-6 lg:flex-col lg:gap-4"
    >
      {groups.map((items: NavItem[], index: number) => (
        <ul
          key={index}
          className={cn(
            'flex gap-1 lg:flex-col',
            index > 0 && 'border-l-2 border-line pl-1 lg:border-t-2 lg:border-l-0 lg:pt-4 lg:pl-0'
          )}
        >
          {items.map(({ to, label, icon: Icon }: NavItem) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === Constants.ROUTE_ADMIN}
                onClick={(event: MouseEvent<HTMLAnchorElement>) =>
                  guardNavigation(event, () => navigate(to))
                }
                className={navLinkClassName}
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      ))}
    </nav>
  );
};

const AdminDashboard = () => (
  <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
    <aside className="shrink-0 lg:w-60">
      <AdminNav />
    </aside>

    <div className="min-w-0 grow">
      <Routes>
        <Route index element={<AdminOverview />} />
        {ADMIN_SECTIONS.map(({ path, component: Section }: AdminSection) => (
          <Route key={path} path={`${path}/*`} element={<Section />} />
        ))}
        <Route path="*" element={<Navigate to={Constants.ROUTE_ADMIN} replace />} />
      </Routes>
    </div>
  </div>
);

export default AdminDashboard;
