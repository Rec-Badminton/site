import { useState } from 'react';
import { useI18n } from '@mxreakit/i18n';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/sections/ProductCard';
import { useLanguage } from '@/hooks/use-language';
import { useSiteContent } from '@/hooks/use-site-content';
import type { Product, Shop, ShopCategory } from '@/core/content/types';
import { cn } from '@/core/utils';

// category ids are generated, so they never clash with this one
const ALL: string = 'all';

interface ShopCatalogProps {
  shop: Shop;
}

// Product grid filtered by category; ordering happens on HelloAsso.
const ShopCatalog = ({ shop }: ShopCatalogProps) => {
  const { t } = useI18n();
  const { localize } = useLanguage();
  const { categories: allCategories } = useSiteContent().shop;
  const [category, setCategory] = useState<string>(ALL);
  const used: Set<string> = new Set(shop.products.map((product: Product) => product.category));
  const categories: string[] = [
    ALL,
    ...allCategories
      .filter((item: ShopCategory) => used.has(item.id))
      .map((item: ShopCategory) => item.id)
  ];
  const categoryLabel = (id: string): string =>
    id === ALL
      ? t('shop.all')
      : localize(allCategories.find((item: ShopCategory) => item.id === id)?.label);
  const products: Product[] = shop.products.filter(
    (product: Product) => category === ALL || product.category === category
  );

  return (
    <div>
      <div
        role="group"
        aria-label={t('shop.category')}
        className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line"
      >
        <SlidersHorizontal className="size-5 text-muted" aria-label={t('shop.filter')} role="img" />
        {categories.map((item: string) => {
          const selected: boolean = item === category;
          return (
            <button
              key={item}
              type="button"
              aria-pressed={selected}
              onClick={() => setCategory(item)}
              className={cn(
                '-mb-px border-b-3 py-2.5 font-display text-xl font-bold tracking-wide text-ink uppercase transition-colors',
                selected ? 'border-brand' : 'border-transparent hover:border-line'
              )}
            >
              {categoryLabel(item)}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-3 pt-5 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} shopUrl={shop.url} />
        ))}
      </div>
    </div>
  );
};

export default ShopCatalog;
