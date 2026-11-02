import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@mxreakit/i18n';
import { ShieldCheck } from 'lucide-react';
import { useConsent } from '@/hooks/use-consent';
import { grantConsent, type ConsentCategory } from '@/core/cookie-consent';
import { Constants } from '@/core/constants';
import OutboundLink from '@/components/ui/OutboundLink';

interface ConsentGateProps {
  category: ConsentCategory;
  provider: string;
  fallbackUrl: string;
  className?: string;
  children: ReactNode;
}

// Renders third-party content only once the visitor agreed to its cookies.
const ConsentGate = ({
  category,
  provider,
  fallbackUrl,
  className,
  children
}: ConsentGateProps) => {
  const { t, tc } = useI18n();
  const allowed: boolean = useConsent(category);
  if (allowed) return <>{children}</>;

  return (
    <div className={className}>
      <div className="flex size-full flex-col items-center justify-center gap-4 bg-white p-8 text-center">
        <ShieldCheck className="size-10 text-brand" aria-hidden="true" />
        <p className="max-w-md text-lg">{tc('consent.text', { 0: <strong /> }, provider)}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => grantConsent(category)} className="btn btn-primary">
            {t('consent.show')}
          </button>
          <OutboundLink href={fallbackUrl} className="btn btn-outline-dark">
            {t('consent.open', provider)}
          </OutboundLink>
        </div>
        <Link
          to={Constants.ROUTE_DATA_POLICY}
          className="text-sm text-muted underline hover:text-ink"
        >
          {t('consent.more')}
        </Link>
      </div>
    </div>
  );
};

export default ConsentGate;
