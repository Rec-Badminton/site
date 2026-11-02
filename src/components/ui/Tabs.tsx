import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/core/utils';

export interface TabItem {
  id: string;
  label: string;
  // small counter next to the label
  badge?: string;
}

interface TabsProps {
  label: string;
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  tone?: 'light' | 'dark';
  children: ReactNode;
}

const KEY_OFFSETS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowUp: -1,
  ArrowRight: 1,
  ArrowDown: 1
};

const Tabs = ({ label, items, value, onChange, tone = 'light', children }: TabsProps) => {
  const baseId: string = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const offset: number | undefined = KEY_OFFSETS[event.key];
    if (offset === undefined) return;
    event.preventDefault();
    const next: number = (index + offset + items.length) % items.length;
    const item: TabItem | undefined = items[next];
    if (!item) return;
    onChange(item.id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label={label} className="flex flex-wrap gap-1.5">
        {items.map((item: TabItem, index: number) => {
          const selected: boolean = item.id === value;
          return (
            <button
              key={item.id}
              ref={(element: HTMLButtonElement | null) => {
                tabRefs.current[index] = element;
              }}
              id={`${baseId}-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(item.id)}
              onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => onKeyDown(event, index)}
              className={cn(
                'inline-flex min-h-12 min-w-18 items-center justify-center gap-2 px-4 py-2 font-display text-[22px] font-extrabold tracking-wide transition-colors',
                selected && 'bg-brand text-white',
                !selected && tone === 'light' && 'bg-white text-ink hover:bg-brand-tint',
                !selected && tone === 'dark' && 'bg-ink-soft text-white hover:bg-ink-line'
              )}
            >
              {item.label}
              {item.badge && (
                <span
                  className={cn(
                    'flex size-5.5 items-center justify-center text-sm',
                    selected ? 'bg-white text-brand' : 'bg-ink text-white'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${value}`}
        className="mt-1"
      >
        {children}
      </div>
    </div>
  );
};

export default Tabs;
