import type { MouseEvent, ReactNode } from 'react';
import { Link, useNavigate, type NavigateFunction } from 'react-router-dom';
import { guardNavigation } from '@/hooks/use-unsaved-changes';
import { Constants } from '@/core/constants';
import logoNegative from '@/assets/images/logo-rec-negative.png';

interface AdminHeaderProps {
  actions?: ReactNode;
}

const AdminHeader = ({ actions }: AdminHeaderProps) => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <header className="bg-ink text-white shadow-[inset_0_-3px_0_var(--color-brand)]">
      <div className="container-site flex min-h-18 flex-wrap items-center gap-x-6 gap-y-2 py-2">
        <Link
          to={Constants.ROUTE_HOME}
          onClick={(event: MouseEvent<HTMLAnchorElement>) =>
            guardNavigation(event, () => navigate(Constants.ROUTE_HOME))
          }
          className="flex items-center gap-3 hover:text-brand-light"
        >
          <img src={logoNegative} alt="" className="size-11" />
          <span className="font-display text-2xl font-extrabold tracking-wide uppercase">
            {Constants.COMPANY_NAME}
          </span>
        </Link>
        {actions && <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
};

export default AdminHeader;
