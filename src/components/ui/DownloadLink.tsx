import type { ReactNode } from 'react';
import { useI18n } from '@mxreakit/i18n';
import { FileDown } from 'lucide-react';
import { cn } from '@/core/utils';

interface DownloadLinkProps {
  href: string;
  className?: string;
  iconClassName?: string;
  children: ReactNode;
}

// Link to a file the visitor saves, with the download icon.
const DownloadLink = ({ href, className, iconClassName, children }: DownloadLinkProps) => {
  const { t } = useI18n();
  return (
    <a href={href} download className={className}>
      <FileDown className={cn('size-[1.1em] shrink-0', iconClassName)} aria-hidden="true" />
      {children}
      <span className="sr-only"> {t('common.download')}</span>
    </a>
  );
};

export default DownloadLink;
