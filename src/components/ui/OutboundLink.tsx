import type { ReactNode } from 'react';
import { useI18n } from '@mxreakit/i18n';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/core/utils';

interface OutboundLinkProps {
  href: string;
  className?: string;
  iconClassName?: string;
  title?: string;
  children: ReactNode;
}

// Link leaving the site: opens a new tab and shows the external icon.
const OutboundLink = ({ href, className, iconClassName, title, children }: OutboundLinkProps) => {
  const { t } = useI18n();
  return (
    <a href={href} target="_blank" rel="noreferrer" title={title} className={className}>
      {children}
      <ExternalLink className={cn('size-[0.9em] shrink-0', iconClassName)} aria-hidden="true" />
      <span className="sr-only"> {t('common.newTab')}</span>
    </a>
  );
};

export default OutboundLink;
