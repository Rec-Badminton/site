import type { ReactNode } from 'react';
import { cn } from '@/core/utils';

interface SectionProps {
  id?: string;
  className?: string;
  innerClassName?: string;
  label?: string;
  children: ReactNode;
}

// Full-width band with the site's centered content column.
const Section = ({ id, className, innerClassName, label, children }: SectionProps) => (
  <section id={id} aria-label={label} className={className}>
    <div className={cn('container-site section-pad', innerClassName)}>{children}</div>
  </section>
);

export default Section;
