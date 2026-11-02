import type { ReactNode } from 'react';
import { cn } from '@/core/utils';

type Align = 'left' | 'center' | 'right';

interface CellProps {
  align?: Align;
  className?: string;
  children?: ReactNode;
}

const ALIGN: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
};

const Table = ({
  caption,
  head,
  children
}: {
  caption?: string;
  head: ReactNode;
  children: ReactNode;
}) => (
  <div className="overflow-x-auto bg-white">
    <table className="w-full border-collapse text-[16px] tabular-nums">
      {caption && <caption className="sr-only">{caption}</caption>}
      <thead className="bg-ink font-display text-[17px] tracking-wider text-white uppercase">
        <tr>{head}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const Th = ({ align = 'left', className, children }: CellProps) => (
  <th scope="col" className={cn('px-4 py-3 font-bold whitespace-nowrap', ALIGN[align], className)}>
    {children}
  </th>
);

const Td = ({ align = 'left', className, children }: CellProps) => (
  <td className={cn('border-t border-line px-4 py-3', ALIGN[align], className)}>{children}</td>
);

const Tr = ({ highlight, children }: { highlight?: boolean; children: ReactNode }) => (
  <tr
    className={cn(highlight && 'bg-brand-tint font-bold shadow-[inset_4px_0_0_var(--color-brand)]')}
  >
    {children}
  </tr>
);

export { Table, Th, Td, Tr };
