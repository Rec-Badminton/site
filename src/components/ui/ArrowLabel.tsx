import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/core/utils';

// Label with the site's "go further" arrow; nudges right when a `group` parent is hovered.
const ArrowLabel = ({ className, children }: { className?: string; children: ReactNode }) => (
  <span className={cn('inline-flex items-center gap-[0.3em]', className)}>
    {children}
    <ArrowRight
      className="size-[1.1em] shrink-0 transition-transform group-hover:translate-x-1"
      aria-hidden="true"
    />
  </span>
);

export default ArrowLabel;
